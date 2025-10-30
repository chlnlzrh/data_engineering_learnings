# Data Quality & Testing

## Data Quality Dimensions

1. **Accuracy**: Data reflects reality
2. **Completeness**: All required data present
3. **Consistency**: Data agrees across systems
4. **Timeliness**: Data available when needed
5. **Validity**: Data conforms to rules/formats
6. **Uniqueness**: No unexpected duplicates

## Testing Pyramid for Data

```
       /\        E2E Tests (Few)
      /  \       - Pipeline integration
     /    \      - Business logic validation
    /------\     
   / Inte-  \    Integration Tests (Some)  
  / gration \   - Multi-table consistency
 /           \  - Reference integrity
/-------------\ 
  Unit Tests    Unit Tests (Many)
(Table-level)   - Schema validation
                - Null checks
                - Uniqueness
                - Range validation
```

## SQL-Based Testing

### Basic Quality Checks
```sql
-- Null check
SELECT COUNT(*) as null_count
FROM orders WHERE customer_id IS NULL;

-- Uniqueness
SELECT COUNT(*) - COUNT(DISTINCT order_id) as duplicates
FROM orders;

-- Referential integrity
SELECT COUNT(*) as orphaned_records
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;

-- Range validation
SELECT COUNT(*) as invalid_dates
FROM orders
WHERE order_date > CURRENT_DATE 
   OR order_date < '2020-01-01';

-- Format validation
SELECT COUNT(*) as invalid_emails
FROM customers
WHERE email NOT LIKE '%_@_%.__%';
```

### Distribution/Anomaly Checks
```sql
-- Record count validation
WITH daily_counts AS (
    SELECT DATE(order_date) as date, COUNT(*) as cnt
    FROM orders GROUP BY DATE(order_date)
)
SELECT * FROM daily_counts
WHERE cnt < 0.5 * AVG(cnt) OVER (ORDER BY date ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING);

-- Value distribution
SELECT category, COUNT(*) as cnt,
       COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as pct
FROM products
GROUP BY category
HAVING pct > 50;  -- Flag if one category dominates
```

## Great Expectations

Python-based data quality framework.

### Basic Setup
```python
import great_expectations as gx

context = gx.get_context()

# Create expectation suite
validator = context.sources.add_or_update_sql(
    name="my_datasource",
    connection_string="snowflake://..."
).add_table_asset(
    name="orders"
).build_batch_request()

# Add expectations
validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_unique("order_id")
validator.expect_column_values_to_be_between(
    "order_amount", 
    min_value=0, 
    max_value=1000000
)
validator.expect_column_values_to_be_in_set(
    "order_status",
    value_set=["pending", "shipped", "delivered", "cancelled"]
)

# Validate
results = validator.validate()
print(results.success)
```

### Custom Expectations
```python
# Custom business rule
validator.expect_column_pair_values_A_to_be_greater_than_B(
    column_A="order_date",
    column_B="shipped_date",
    or_equal=True
)
```

## dbt Tests

SQL-based testing within dbt (data build tool).

### Schema Tests (schema.yml)
```yaml
version: 2

models:
  - name: orders
    description: Customer orders
    columns:
      - name: order_id
        description: Unique order identifier
        tests:
          - unique
          - not_null
          
      - name: customer_id
        description: Reference to customer
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
              
      - name: order_amount
        description: Total order amount
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"
              
      - name: order_date
        tests:
          - dbt_utils.expression_is_true:
              expression: "<= current_date"
```

### Data Tests (SQL files)
```sql
-- tests/assert_revenue_positive.sql
SELECT order_id, order_amount
FROM {{ ref('orders') }}
WHERE order_amount < 0
```

### Running Tests
```bash
dbt test                    # Run all tests
dbt test --models orders    # Test specific model
dbt test --select test_type:generic  # Only generic tests
```

## Data Observability

### Five Pillars

1. **Freshness**: Is data up-to-date?
```sql
SELECT MAX(updated_at) as last_update,
       DATEDIFF(hour, MAX(updated_at), CURRENT_TIMESTAMP) as hours_since
FROM orders;
```

2. **Volume**: Expected number of records?
```sql
WITH daily_volume AS (
    SELECT DATE(created_at) as date, COUNT(*) as cnt
    FROM orders GROUP BY DATE(created_at)
)
SELECT *, AVG(cnt) OVER (ORDER BY date ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING) as avg_prev_week
FROM daily_volume
WHERE cnt < 0.7 * avg_prev_week;  -- Alert if 30% drop
```

3. **Schema**: Structure changes?
```sql
-- Monitor column count, data types
SELECT COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'orders';
```

4. **Distribution**: Value patterns normal?
```sql
-- Monitor NULL rates, distinct counts
SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(CASE WHEN customer_id IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as null_pct
FROM orders;
```

5. **Lineage**: Data dependencies tracked?
- Document upstream/downstream dependencies
- Tools: dbt docs, data catalogs

## Monitoring Implementation

### Automated Checks
```python
# Airflow example
def check_data_quality():
    checks = [
        ("null_check", "SELECT COUNT(*) FROM orders WHERE customer_id IS NULL"),
        ("dup_check", "SELECT COUNT(*) - COUNT(DISTINCT order_id) FROM orders"),
        ("ref_check", "SELECT COUNT(*) FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL")
    ]
    
    for name, query in checks:
        result = run_query(query)
        if result[0][0] > 0:
            send_alert(f"Data quality issue: {name}")
            raise Exception(f"Quality check failed: {name}")
```

### Alerting Strategy
- **Critical**: Pipeline failures, referential integrity
- **Warning**: Volume anomalies, distribution changes
- **Info**: Schema changes, freshness delays

## Best Practices
1. **Test Early**: Validate at ingestion
2. **Document Expectations**: Make rules explicit
3. **Monitor Trends**: Track metrics over time
4. **Alert Appropriately**: Don't cry wolf
5. **Version Tests**: Track changes to expectations
6. **Automate**: Integrate into CI/CD
7. **Measure Coverage**: Track % of data tested
