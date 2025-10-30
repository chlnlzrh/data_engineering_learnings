# Data Modeling Guide

## Dimensional Modeling

### Star Schema
- Fact table at center, dimensions surround it
- Denormalized dimensions (wide & flat)
- Best for: Query performance, business user access
- Example: fact_sales + dim_date, dim_customer, dim_product

### Snowflake Schema  
- Normalized dimension tables (multiple levels)
- Best for: Storage optimization, large dimensions
- Trade-off: More complex queries, slower performance

## Fact Tables

### Types
1. **Transaction Facts**: One row per event (sales transactions, clicks)
2. **Periodic Snapshot**: One row per period (daily account balances)  
3. **Accumulating Snapshot**: One row per process lifecycle (order fulfillment)

### Grain Definition
Critical: Define what one row represents
- Example: "One row per product sold per transaction"
- All facts must be true to grain
- Never mix grains in one table

### Fact Types
- **Additive**: Can SUM across all dimensions (quantity, revenue)
- **Semi-Additive**: Cannot SUM across time (balances, inventory)
- **Non-Additive**: Ratios, percentages (derive from additive facts)

## Dimension Tables

### Design Principles
- Wide & flat (50-100+ columns normal)
- Denormalize hierarchies
- Descriptive text fields
- Use surrogate keys (integer sequence)
- Include audit columns (created_date, updated_date)

### Slowly Changing Dimensions

**SCD Type 1: Overwrite**
```sql
UPDATE dim_customer SET email = 'new@email.com' WHERE customer_id = 'C001';
```
- No history tracking
- Use for: Minor corrections, non-critical changes

**SCD Type 2: Add New Row**
```sql
CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,  -- Surrogate
    customer_id VARCHAR(50),       -- Natural key
    email VARCHAR(200),
    effective_date DATE,
    expiration_date DATE,
    is_current BOOLEAN
);
```
- Full history tracking
- Use for: Regulatory requirements, trend analysis
- Most common approach

**SCD Type 3: Add Column**
```sql
ALTER TABLE dim_customer ADD COLUMN previous_email VARCHAR(200);
```
- Limited history (one previous value)
- Use for: Simple before/after comparisons

## Best Practices
- Always define grain before designing fact table
- Use meaningful surrogate keys
- Implement SCD Type 2 for important dimensions
- Denormalize for query performance
- Add audit columns to all tables
- Document business rules clearly
