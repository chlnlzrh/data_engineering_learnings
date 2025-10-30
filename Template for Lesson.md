# ACID Properties in Database Systems

## **What Are ACID Properties?**

ACID is an acronym representing four fundamental properties that guarantee reliable processing of database transactions. These properties ensure data integrity and consistency, especially in multi-user environments where concurrent operations occur.

**ACID stands for:**

- **A**tomicity
- **C**onsistency
- **I**solation
- **D**urability

These properties work together to maintain database reliability, particularly critical in systems handling financial transactions, inventory management, or any scenario where data accuracy is paramount.

------

## **1. Atomicity: "All or Nothing"**

### Theory

**Atomicity** ensures that a transaction is treated as a single, indivisible unit of work. Either **all operations within the transaction complete successfully**, or **none of them do**. There is no middle ground where some operations succeed while others fail.

If any part of the transaction fails, the entire transaction is **rolled back**, returning the database to its state before the transaction began.

### Why It Matters

Without atomicity, partial updates could leave your database in an inconsistent state. Imagine transferring money between bank accounts—if the debit occurs but the credit fails, money would simply vanish!

### Real-World Example

**Bank Transfer Scenario:**

```sql
BEGIN TRANSACTION;

-- Step 1: Deduct $100 from Account A
UPDATE accounts 
SET balance = balance - 100 
WHERE account_id = 'A123';

-- Step 2: Add $100 to Account B
UPDATE accounts 
SET balance = balance + 100 
WHERE account_id = 'B456';

COMMIT;
```

**What Happens:**

- If both UPDATE statements succeed → Transaction commits, both accounts updated
- If Step 2 fails (e.g., Account B doesn't exist) → Transaction rolls back, Account A balance unchanged
- You never end up with money deducted but not deposited

------

## **2. Consistency: "Valid State to Valid State"**

### Theory

**Consistency** ensures that a transaction brings the database from one **valid state** to another valid state, maintaining all defined rules, constraints, and integrity requirements.

The database must satisfy all:

- **Constraints** (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
- **Triggers**
- **Cascades**
- **Business rules**

### Why It Matters

Consistency prevents data corruption by enforcing your database's integrity rules. It ensures that the data always makes logical sense according to your business requirements.

### Real-World Example

**Inventory Management:**

```sql
-- Table with constraint
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    quantity INT CHECK (quantity >= 0),  -- Cannot be negative
    reserved INT DEFAULT 0
);

BEGIN TRANSACTION;

-- Attempt to sell 10 units
UPDATE products 
SET quantity = quantity - 10,
    reserved = reserved + 10
WHERE product_id = 101;

-- If this would make quantity negative, 
-- the CHECK constraint violation causes rollback
COMMIT;
```

**What Happens:**

- If `quantity` is 15 → Transaction succeeds (15 - 10 = 5, still valid)
- If `quantity` is 5 → Transaction **fails** due to CHECK constraint (5 - 10 = -5, invalid)
- Database never reaches an inconsistent state with negative inventory

------

## **3. Isolation: "Concurrent Transactions Don't Interfere"**

### Theory

**Isolation** ensures that concurrent transactions execute independently without interfering with each other. Each transaction should appear to execute in isolation, even when multiple transactions run simultaneously.

This prevents issues like:

- **Dirty reads** (reading uncommitted changes)
- **Non-repeatable reads** (data changes between reads within same transaction)
- **Phantom reads** (new rows appear between reads)

### Why It Matters

In multi-user systems, without proper isolation, one user's incomplete transaction could be visible to others, leading to incorrect decisions based on "dirty" data.

### Isolation Levels (from least to most strict)

1. **READ UNCOMMITTED** - Can see uncommitted changes (dirty reads possible)
2. **READ COMMITTED** - Only sees committed data (most common default)
3. **REPEATABLE READ** - Same query returns same results within transaction
4. **SERIALIZABLE** - Complete isolation, as if transactions ran serially

### Real-World Example

**Concert Ticket Booking:**

```sql
-- User 1's Transaction
BEGIN TRANSACTION;
SELECT available_seats FROM concerts WHERE concert_id = 500;
-- Returns: 1 seat available

-- Meanwhile, User 2's Transaction
BEGIN TRANSACTION;
SELECT available_seats FROM concerts WHERE concert_id = 500;
-- Also returns: 1 seat available

-- User 1 books the seat
UPDATE concerts SET available_seats = 0 WHERE concert_id = 500;
COMMIT;

-- User 2 tries to book
UPDATE concerts SET available_seats = -1 WHERE concert_id = 500;
-- With proper isolation, this would fail or queue
```

**With Proper Isolation:**

- User 2's transaction would either wait for User 1 to complete, or
- User 2 would see the updated seat count (0), preventing double-booking

------

## **4. Durability: "Permanent Once Committed"**

### Theory

**Durability** guarantees that once a transaction is **committed**, its changes are **permanent** and will survive system crashes, power failures, or other failures. The data is safely stored on non-volatile storage (disk).

### Why It Matters

Users need confidence that completed transactions won't be lost. If you confirm a purchase, that confirmation must persist even if the server crashes immediately afterward.

### Real-World Example

**E-commerce Order:**

```sql
BEGIN TRANSACTION;

-- Insert order
INSERT INTO orders (order_id, customer_id, total, status)
VALUES (99001, 'CUST123', 299.99, 'CONFIRMED');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES 
    (99001, 'PROD456', 2, 149.99),
    (99001, 'PROD789', 1, 49.99);

-- Deduct inventory
UPDATE products 
SET quantity = quantity - 2 
WHERE product_id = 'PROD456';

COMMIT;  -- Changes written to disk

-- Even if server crashes here, order 99001 is saved!
```

**What Happens:**

- After `COMMIT`, changes are written to transaction log and data files
- Even if power fails immediately after, data can be recovered
- Customer's order won't be lost

------

## **How ACID Properties Work Together**

### Complete Example: Money Transfer

```sql
BEGIN TRANSACTION;  -- Start ACID boundary

-- ATOMICITY: All these operations succeed or all fail
UPDATE accounts SET balance = balance - 500 WHERE account_id = 'A123';
UPDATE accounts SET balance = balance + 500 WHERE account_id = 'B456';
INSERT INTO transactions (from_account, to_account, amount, timestamp)
VALUES ('A123', 'B456', 500, CURRENT_TIMESTAMP);

-- CONSISTENCY: Check constraints enforced
-- If Account A balance would go below minimum_balance, rollback occurs

-- ISOLATION: Other users see old balances until COMMIT
-- No one sees Account A debited but Account B not yet credited

COMMIT;  -- DURABILITY: Changes permanently written

-- After COMMIT, all four ACID properties have been satisfied
```

------

## **Practice Exercises**

### Exercise 1: Identify ACID Property Violations

For each scenario, identify which ACID property is violated:

1. **Scenario A:** A transaction debits Account X but the system crashes before crediting Account Y. When restarted, Account X remains debited but Account Y was never credited.
   - **Violated Property:** _________
2. **Scenario B:** User 1 reads a product's price as $100. User 2 updates it to $150. User 1 reads it again in the same transaction and sees $150.
   - **Violated Property:** _________
3. **Scenario C:** An order is inserted with a customer_id that doesn't exist in the customers table, despite a FOREIGN KEY constraint.
   - **Violated Property:** _________
4. **Scenario D:** A confirmed payment transaction is lost after a power failure and cannot be recovered.
   - **Violated Property:** _________

### Exercise 2: Writing ACID-Compliant Transactions

Write SQL transactions for these scenarios:

1. **Transfer inventory between warehouses** (200 units from WH-A to WH-B)
2. **Process a refund** (update order status, credit customer account, restore inventory)
3. **Enroll student in course** (check capacity, add enrollment record, update available_seats)

------

## **Key Takeaways**

✅ **Atomicity** = All or nothing (no partial updates)
 ✅ **Consistency** = Valid state to valid state (rules enforced)
 ✅ **Isolation** = Concurrent transactions don't interfere
 ✅ **Durability** = Committed changes persist forever

### When to Apply ACID

- **Critical:** Financial systems, healthcare records, inventory management
- **Important:** User accounts, order processing, booking systems
- **Less Critical:** Analytics queries, read-heavy reporting (may relax isolation)

------

## **Next Steps**

1. Review the exercises and write out your answers
2. Try creating your own transaction examples using the patterns shown
3. Research how Snowflake specifically implements ACID properties
4. Explore transaction isolation levels in more depth