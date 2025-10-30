#!/usr/bin/env python3
"""
Generate practice exercises for data engineering topics.
"""

import argparse
import json
from typing import Dict, List

EXERCISES = {
    "dimensional-modeling": {
        "beginner": [
            {
                "title": "Design a Sales Fact Table",
                "description": "You are building a data warehouse for a retail company. Design a fact table to track daily sales transactions.",
                "requirements": [
                    "Include measures for quantity sold, unit price, discount amount, and total amount",
                    "Connect to date, product, store, and customer dimensions",
                    "Define the grain clearly",
                    "Use appropriate data types"
                ],
                "hints": [
                    "The grain should be at the transaction level",
                    "Use surrogate keys for dimension references",
                    "Consider which facts are additive vs semi-additive"
                ],
                "solution": """CREATE TABLE fact_sales_transactions (
    transaction_id INTEGER PRIMARY KEY,
    date_key INTEGER NOT NULL,
    customer_key INTEGER NOT NULL,
    product_key INTEGER NOT NULL,
    store_key INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key),
    FOREIGN KEY (customer_key) REFERENCES dim_customer(customer_key),
    FOREIGN KEY (product_key) REFERENCES dim_product(product_key),
    FOREIGN KEY (store_key) REFERENCES dim_store(store_key)
);

-- Grain: One row per item sold per transaction
-- All facts are additive except unit_price (ratio)"""
            }
        ],
        "intermediate": [
            {
                "title": "Implement SCD Type 2 Dimension",
                "description": "Implement a customer dimension table that tracks historical changes using Slowly Changing Dimension Type 2.",
                "requirements": [
                    "Track customer name, email, address, and loyalty tier changes over time",
                    "Include effective_date and expiration_date",
                    "Add is_current flag for active records",
                    "Use surrogate key for dimension key"
                ],
                "hints": [
                    "Add version number or effective dates to track history",
                    "is_current should be boolean or 'Y'/'N'",
                    "Expiration date for current record typically set to far future date (9999-12-31)"
                ],
                "solution": """CREATE TABLE dim_customer (
    customer_key INTEGER PRIMARY KEY,  -- Surrogate key
    customer_id VARCHAR(50) NOT NULL,  -- Natural key
    customer_name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    address VARCHAR(500),
    loyalty_tier VARCHAR(50),
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (customer_id, effective_date)
);

-- Example: Inserting new version when customer email changes
INSERT INTO dim_customer 
    (customer_key, customer_id, customer_name, email, address, loyalty_tier, 
     effective_date, expiration_date, is_current)
VALUES 
    (NEXT_VALUE_FOR customer_seq, 'CUST001', 'John Doe', 'john.new@email.com', 
     '123 Main St', 'Gold', CURRENT_DATE, '9999-12-31', TRUE);
     
-- Mark old record as expired
UPDATE dim_customer
SET expiration_date = CURRENT_DATE - 1,
    is_current = FALSE
WHERE customer_id = 'CUST001' AND is_current = TRUE;"""
            }
        ]
    },
    "sql-joins": {
        "beginner": [
            {
                "title": "Customer Order Analysis",
                "description": "Given a customers table and an orders table, write queries to analyze customer purchasing behavior.",
                "schema": """
customers: customer_id (PK), name, email, signup_date
orders: order_id (PK), customer_id (FK), order_date, total_amount
                """,
                "requirements": [
                    "Find all customers with their order count",
                    "Include customers who haven't placed orders",
                    "Show total amount spent per customer"
                ],
                "solution": """-- All customers with their order statistics
SELECT 
    c.customer_id,
    c.name,
    c.email,
    COUNT(o.order_id) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.email
ORDER BY total_spent DESC;

-- This uses LEFT JOIN to include customers with zero orders
-- COALESCE handles NULL values for customers without orders"""
            }
        ]
    },
    "etl-design": {
        "beginner": [
            {
                "title": "Design Incremental Load Pipeline",
                "description": "Design an ETL pipeline that loads new and updated records from a source database to a data warehouse daily.",
                "requirements": [
                    "Source table has 10M records, growing by 50K daily",
                    "Source has updated_at timestamp column",
                    "Minimize data transfer and processing time",
                    "Handle records updated multiple times in a day"
                ],
                "solution": """# ETL Pipeline Design: Incremental Load

## Extract Strategy
- Use timestamp-based incremental extraction
- Query: SELECT * FROM source_table WHERE updated_at > :last_successful_load_timestamp
- Store last_successful_load_timestamp in metadata table

## Transform Strategy
- Deduplicate records based on primary key + max(updated_at) if multiple updates
- Data quality checks: null validation, referential integrity
- Apply business transformations (calculated fields, lookups)

## Load Strategy
- Use MERGE statement (UPSERT) to handle both inserts and updates
- Match on primary key
- Update existing records, insert new ones

## Error Handling
- Implement checkpoints for large batches
- Log failed records to error table
- Send alerts on failure
- Enable pipeline rerun from last checkpoint

## Monitoring
- Track record counts (extracted, transformed, loaded)
- Monitor pipeline duration and data lag
- Alert if no new records (potential source issue)

## Sample SQL (Snowflake)
MERGE INTO target_table t
USING staging_table s
ON t.id = s.id
WHEN MATCHED THEN
    UPDATE SET t.column1 = s.column1, t.updated_at = s.updated_at
WHEN NOT MATCHED THEN
    INSERT (id, column1, updated_at) VALUES (s.id, s.column1, s.updated_at);"""
            }
        ]
    },
    "cdc-patterns": {
        "beginner": [
            {
                "title": "Implement Timestamp-Based CDC",
                "description": "Implement a simple CDC pattern using timestamp columns to capture changes from a source system.",
                "requirements": [
                    "Capture INSERT, UPDATE operations",
                    "Track last processed timestamp",
                    "Handle timezone considerations",
                    "Deal with records updated multiple times between runs"
                ],
                "solution": """-- Metadata table to track CDC progress
CREATE TABLE cdc_watermarks (
    table_name VARCHAR(100) PRIMARY KEY,
    last_processed_timestamp TIMESTAMP_NTZ,
    last_updated TIMESTAMP_NTZ
);

-- CDC extraction query
SELECT 
    id,
    column1,
    column2,
    updated_at,
    CASE 
        WHEN created_at = updated_at THEN 'INSERT'
        ELSE 'UPDATE'
    END as operation_type
FROM source_table
WHERE updated_at > (
    SELECT last_processed_timestamp 
    FROM cdc_watermarks 
    WHERE table_name = 'source_table'
)
ORDER BY updated_at;

-- After successful load, update watermark
UPDATE cdc_watermarks
SET last_processed_timestamp = (SELECT MAX(updated_at) FROM current_batch),
    last_updated = CURRENT_TIMESTAMP()
WHERE table_name = 'source_table';

-- Handle duplicates (keep latest version)
WITH ranked_changes AS (
    SELECT *,
        ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) as rn
    FROM staging_cdc_table
)
SELECT * FROM ranked_changes WHERE rn = 1;"""
            }
        ]
    },
    "query-optimization": {
        "beginner": [
            {
                "title": "Optimize Slow Aggregate Query",
                "description": "Optimize this slow-running query that calculates daily sales totals.",
                "slow_query": """SELECT 
    DATE(order_timestamp) as order_date,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
WHERE order_timestamp >= '2024-01-01'
GROUP BY DATE(order_timestamp)
ORDER BY order_date;""",
                "context": "The orders table has 100M rows. Query takes 3 minutes on Snowflake.",
                "solution": """-- Optimization Strategy:
-- 1. Use partition pruning if table is partitioned by date
-- 2. Avoid function on filter column (breaks partition pruning)
-- 3. Consider materialized view for frequently-run aggregations

-- Optimized Query (Snowflake)
-- Assume table is partitioned/clustered on order_timestamp
SELECT 
    DATE_TRUNC('day', order_timestamp) as order_date,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
WHERE order_timestamp >= '2024-01-01'::TIMESTAMP
  AND order_timestamp < '2025-01-01'::TIMESTAMP  -- Add upper bound
GROUP BY 1  -- Use positional reference
ORDER BY 1;

-- Additional Optimizations:
-- 1. Ensure clustering on order_timestamp
ALTER TABLE orders CLUSTER BY (DATE_TRUNC('day', order_timestamp));

-- 2. Create materialized view for dashboard queries
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT 
    DATE_TRUNC('day', order_timestamp) as order_date,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
GROUP BY 1;

-- Query the materialized view (milliseconds instead of minutes)
SELECT * FROM mv_daily_sales 
WHERE order_date >= '2024-01-01'
ORDER BY order_date;"""
            }
        ]
    },
    "data-quality": {
        "beginner": [
            {
                "title": "Implement Data Quality Checks",
                "description": "Create data quality tests for a customer orders dataset.",
                "requirements": [
                    "Test for null values in required fields",
                    "Validate referential integrity",
                    "Check for duplicates",
                    "Validate data ranges and formats"
                ],
                "solution": """-- Data Quality Test Suite

-- Test 1: Null Checks on Required Fields
SELECT 'Null Check - customer_id' as test_name,
       COUNT(*) as failures
FROM orders
WHERE customer_id IS NULL;

SELECT 'Null Check - order_date' as test_name,
       COUNT(*) as failures
FROM orders
WHERE order_date IS NULL;

-- Test 2: Referential Integrity
SELECT 'Referential Integrity - Invalid customer_id' as test_name,
       COUNT(*) as failures
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;

-- Test 3: Duplicate Check
SELECT 'Duplicate Check - order_id' as test_name,
       COUNT(*) - COUNT(DISTINCT order_id) as failures
FROM orders;

-- Test 4: Data Range Validation
SELECT 'Range Check - negative total_amount' as test_name,
       COUNT(*) as failures
FROM orders
WHERE total_amount < 0;

SELECT 'Range Check - future order_date' as test_name,
       COUNT(*) as failures
FROM orders
WHERE order_date > CURRENT_DATE;

-- Test 5: Format Validation
SELECT 'Format Check - invalid email' as test_name,
       COUNT(*) as failures
FROM customers
WHERE email NOT LIKE '%_@_%.__%';

-- dbt Test Example (schema.yml)
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: customer_id
        tests:
          - not_null
          - relationships:
              to: ref('customers')
              field: customer_id
      - name: total_amount
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"
      - name: order_date
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: "<= current_date"

-- Great Expectations Example (Python)
import great_expectations as gx

context = gx.get_context()

# Create expectation suite
suite = context.add_expectation_suite(suite_name="orders_suite")

# Add expectations
validator = context.sources.add_or_update_sql(
    name="my_datasource",
    connection_string="snowflake://..."
).add_query_asset(
    name="orders",
    query="SELECT * FROM orders"
).build_batch_request()

validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_unique("order_id")
validator.expect_column_values_to_be_between("total_amount", min_value=0)

# Run validation
results = validator.validate()"""
            }
        ]
    }
}

def generate_exercise(topic: str, difficulty: str) -> Dict:
    """Generate exercise for given topic and difficulty."""
    if topic not in EXERCISES:
        available = ", ".join(EXERCISES.keys())
        return {"error": f"Topic '{topic}' not found. Available topics: {available}"}
    
    if difficulty not in EXERCISES[topic]:
        available = ", ".join(EXERCISES[topic].keys())
        return {"error": f"Difficulty '{difficulty}' not found for topic '{topic}'. Available: {available}"}
    
    exercises = EXERCISES[topic][difficulty]
    return {
        "topic": topic,
        "difficulty": difficulty,
        "exercises": exercises
    }

def main():
    parser = argparse.ArgumentParser(description="Generate data engineering practice exercises")
    parser.add_argument("--topic", required=True, 
                       choices=list(EXERCISES.keys()),
                       help="Exercise topic")
    parser.add_argument("--difficulty", required=True,
                       choices=["beginner", "intermediate", "advanced"],
                       help="Difficulty level")
    parser.add_argument("--format", default="text", choices=["text", "json"],
                       help="Output format")
    
    args = parser.parse_args()
    
    result = generate_exercise(args.topic, args.difficulty)
    
    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        if "error" in result:
            print(f"Error: {result['error']}")
        else:
            print(f"\n{'='*80}")
            print(f"Topic: {result['topic'].upper()}")
            print(f"Difficulty: {result['difficulty'].upper()}")
            print(f"{'='*80}\n")
            
            for i, ex in enumerate(result['exercises'], 1):
                print(f"Exercise {i}: {ex['title']}")
                print(f"\n{ex['description']}\n")
                
                if 'schema' in ex:
                    print(f"Schema:\n{ex['schema']}\n")
                
                print("Requirements:")
                for req in ex['requirements']:
                    print(f"  - {req}")
                
                if 'hints' in ex:
                    print("\nHints:")
                    for hint in ex['hints']:
                        print(f"  - {hint}")
                
                print(f"\nSolution:\n{ex['solution']}")
                print(f"\n{'='*80}\n")

if __name__ == "__main__":
    main()
