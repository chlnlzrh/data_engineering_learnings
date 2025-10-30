# Cloud Data Warehousing

## Snowflake

### Architecture
- **Storage**: S3-based, columnar, compressed
- **Compute**: Virtual warehouses (clusters)
- **Cloud Services**: Metadata, optimization, security

### Key Features

**Virtual Warehouses**
```sql
CREATE WAREHOUSE compute_wh WITH
    WAREHOUSE_SIZE = 'MEDIUM'
    AUTO_SUSPEND = 300        -- seconds
    AUTO_RESUME = TRUE;
```
- Sizes: X-Small to 6X-Large
- Auto-suspend for cost savings
- Scale up (larger) or out (clusters)

**Time Travel**
```sql
-- Query historical data
SELECT * FROM table AT(TIMESTAMP => '2024-01-01'::TIMESTAMP);
SELECT * FROM table BEFORE(STATEMENT => '<query_id>');
```
- Default: 1 day, Enterprise: up to 90 days
- Use for: Error recovery, auditing

**Clustering**
```sql
ALTER TABLE large_table CLUSTER BY (date_column, category);
```
- Improves query performance
- Auto-maintains with DML
- Use for: Large tables with filter/join columns

**Snowpipe (Continuous Loading)**
```sql
CREATE PIPE my_pipe AS
COPY INTO target_table FROM @my_stage
FILE_FORMAT = (TYPE = 'JSON');
```
- Serverless ingestion
- Triggered by S3 events
- Near real-time loading

**Streams & Tasks (CDC)**
```sql
-- Create stream to capture changes
CREATE STREAM customer_stream ON TABLE customers;

-- Create task to process changes
CREATE TASK process_changes
  WAREHOUSE = compute_wh
  SCHEDULE = '5 MINUTE'
AS
  MERGE INTO dim_customer USING customer_stream ...;
```

### Optimization Tips
- Right-size virtual warehouses
- Use clustering for large tables (>1TB)
- Partition external stages
- Use COPY for bulk loads
- Materialize views for repeated aggregations

## BigQuery

### Architecture
- **Storage**: Capacitor columnar format
- **Compute**: Dremel engine (distributed)
- **Serverless**: No warehouse management

### Key Features

**Partitioning**
```sql
CREATE TABLE sales
PARTITION BY DATE(order_date)
CLUSTER BY customer_id, product_id
AS SELECT * FROM source;
```
- Required for large tables
- Partition pruning improves performance
- Max 4000 partitions per table

**Clustering**
- Up to 4 columns
- Applied within partitions
- Auto-maintains

**Nested/Repeated Fields**
```sql
CREATE TABLE orders (
    order_id STRING,
    items ARRAY<STRUCT<
        product_id STRING,
        quantity INT64,
        price FLOAT64
    >>
);

-- Query nested data
SELECT order_id, item.product_id
FROM orders, UNNEST(items) AS item;
```

**Materialized Views**
```sql
CREATE MATERIALIZED VIEW daily_sales AS
SELECT DATE(order_timestamp) as date,
       SUM(amount) as total
FROM orders GROUP BY date;
```
- Auto-refreshed incrementally
- Query rewriting (automatic usage)

### Optimization Tips
- Always partition large tables (>1GB)
- Cluster on filter/join columns
- Use INT64 instead of STRING for IDs
- Avoid SELECT * in production
- Use APPROX functions when exact not needed
- Monitor slot usage and costs

## Redshift

### Architecture
- **Leader Node**: Query planning, coordination
- **Compute Nodes**: Query execution, storage
- **MPP**: Massively parallel processing

### Key Features

**Distribution Styles**
```sql
CREATE TABLE dimension_table
DISTSTYLE ALL;  -- Copy to all nodes

CREATE TABLE fact_table  
DISTKEY(customer_id)  -- Distribute by key
SORTKEY(order_date);  -- Sort by key
```
- **ALL**: Small dimensions (<1M rows)
- **KEY**: Join/filter column, evenly distributed
- **EVEN**: Round-robin, no obvious key
- **AUTO**: Let Redshift decide

**Sort Keys**
```sql
-- Compound (default): order matters
SORTKEY(date, category, product);

-- Interleaved: equal weight to all columns
INTERLEAVED SORTKEY(date, category, product);
```
- Compound: Range queries, one column dominates
- Interleaved: Multiple filter combinations

**Compression**
```sql
ANALYZE COMPRESSION table_name;
-- Redshift recommends encoding per column
```
- Auto-compression on COPY
- Reduces storage and I/O

**COPY Command**
```sql
COPY target_table FROM 's3://bucket/data/'
IAM_ROLE 'arn:aws:iam::...'
FORMAT AS PARQUET;
```
- Fastest load method
- Parallel loading from S3
- Supports CSV, JSON, Parquet, Avro

### Optimization Tips
- Use COPY for bulk loads
- Distribute fact tables by join key
- ANALYZE after significant loads
- VACUUM regularly (reclaim space)
- Use columnar compression
- Monitor WLM queues

## Cross-Platform Comparison

| Feature | Snowflake | BigQuery | Redshift |
|---------|-----------|----------|----------|
| **Pricing** | Compute + Storage | Queries + Storage | Node hours |
| **Scaling** | Manual (instant) | Automatic | Manual (slower) |
| **Admin** | Low | Lowest | Higher |
| **Performance** | Excellent | Excellent | Very Good |
| **Best For** | Flexibility | Simplicity | AWS ecosystem |

## General Optimization Principles
1. **Partition/Cluster** on filter columns
2. **Avoid SELECT \*** - specify columns
3. **Push predicates** down (filter early)
4. **Denormalize** for query performance
5. **Materialize** expensive aggregations
6. **Monitor costs** and query patterns
7. **Use appropriate data types** (INT vs STRING)
8. **Compress** large text columns
