# ETL/ELT Patterns

## ETL vs ELT

### ETL (Extract, Transform, Load)
- Transform outside warehouse (Python, Spark)
- Best for: Complex transformations, data masking, legacy systems
- Pros: Reduced warehouse load, data cleansing before load
- Cons: Separate infrastructure, slower iterations

### ELT (Extract, Load, Transform)
- Transform inside warehouse (SQL)
- Best for: Cloud warehouses, SQL-friendly transformations
- Pros: Leverage warehouse power, faster development
- Cons: Raw data in warehouse, requires compute resources

### Decision Factors
- **Data Volume**: ELT better for large volumes with MPP
- **Transformation Complexity**: ETL for complex Python logic
- **Team Skills**: ELT if team strong in SQL
- **Warehouse Capabilities**: ELT requires powerful warehouse

## Extract Patterns

### Full Load
```python
df = source.read_table("SELECT * FROM source_table")
target.write(df, mode="overwrite")
```
- Simple, complete refresh
- Use for: Small tables, infrequent changes
- Drawbacks: Resource intensive, longer windows

### Incremental Load (Timestamp-Based)
```sql
SELECT * FROM source_table 
WHERE updated_at > :last_load_timestamp
```
- Efficient, only new/updated records
- Requires: Reliable timestamp column
- Use for: Most operational tables

### Incremental Load (Watermark)
```python
last_id = metadata.get_watermark('source_table')
new_data = source.query(f"SELECT * FROM source WHERE id > {last_id}")
metadata.update_watermark('source_table', max(new_data['id']))
```
- Use monotonically increasing ID
- More reliable than timestamps

## Change Data Capture (CDC)

### Timestamp-Based CDC
```sql
-- Capture changes
SELECT *, 
  CASE WHEN created_at = updated_at THEN 'INSERT'
       ELSE 'UPDATE' END as operation
FROM source WHERE updated_at > :last_processed
```
- Simplest approach
- Limitations: No DELETE capture, clock skew issues

### Log-Based CDC
- Read database transaction logs
- Captures: INSERT, UPDATE, DELETE
- Tools: Debezium, Maxwell, AWS DMS
- Best for: Real-time requirements, complete change capture

### Trigger-Based CDC
```sql
CREATE TRIGGER capture_changes
AFTER INSERT OR UPDATE OR DELETE ON source_table
FOR EACH ROW EXECUTE PROCEDURE log_change();
```
- Performance impact on source
- Use only when log-based unavailable

## Transform Patterns

### Data Cleansing
- Null handling, standardization, deduplication
- Type conversions, format standardization
- Business rule application

### Enrichment  
- Lookup tables, calculated fields
- Geocoding, categorization
- Reference data joins

### Aggregation
- Pre-aggregate for performance
- Materialize views, summary tables
- Balance: storage vs query time

## Load Patterns

### Insert Only
```sql
INSERT INTO target SELECT * FROM staging;
```
- Simplest, append-only
- Use for: Event logs, immutable data

### Upsert (MERGE)
```sql
MERGE INTO target t USING staging s ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.col = s.col
WHEN NOT MATCHED THEN INSERT VALUES (s.col);
```
- Handle inserts and updates
- Use for: Most dimensional data

### Soft Delete
```sql
UPDATE target SET is_deleted = TRUE, deleted_at = NOW()
WHERE id IN (SELECT id FROM deleted_records);
```
- Preserve history
- Use for: Audit requirements

## Orchestration Principles

### DAG Design
- Tasks as nodes, dependencies as edges
- No cycles (must be acyclic)
- Idempotent tasks (rerunnable)

### Error Handling
```python
# Airflow example
task = PythonOperator(
    retries=3,
    retry_delay=timedelta(minutes=5),
    on_failure_callback=send_alert
)
```

### Backfill Strategy
- Design for historical reruns
- Parameterize date ranges
- Avoid hardcoded dates

### Monitoring
- Track: Duration, record counts, failures
- Alert on: Failures, SLA breaches, anomalies
- Log: Metadata for debugging

## Best Practices
- Design idempotent pipelines
- Implement incremental loads where possible
- Use CDC for high-volume, real-time needs
- Add comprehensive error handling
- Monitor and alert appropriately
- Document dependencies clearly
