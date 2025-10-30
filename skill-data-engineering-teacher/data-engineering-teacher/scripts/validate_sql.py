#!/usr/bin/env python3
"""
Validate SQL syntax for common cloud data warehouses.
"""

import argparse
import re

class SQLValidator:
    """Basic SQL syntax validator for cloud warehouses."""
    
    SNOWFLAKE_KEYWORDS = {
        'TIME_TRAVEL', 'SNOWPIPE', 'STREAM', 'TASK', 'TO_DATE', 'DATE_TRUNC',
        'VARIANT', 'ARRAY', 'OBJECT', 'FLATTEN', 'LATERAL'
    }
    
    BIGQUERY_KEYWORDS = {
        'STRUCT', 'ARRAY', 'UNNEST', 'TIMESTAMP', 'DATE', 'DATETIME',
        'GENERATE_UUID', 'PARSE_DATE', 'FORMAT_DATE', 'SAFE_CAST'
    }
    
    REDSHIFT_KEYWORDS = {
        'DISTKEY', 'SORTKEY', 'ENCODE', 'DISTSTYLE', 'COPY', 'UNLOAD',
        'ANALYZE', 'VACUUM'
    }
    
    def __init__(self, dialect='snowflake'):
        self.dialect = dialect.lower()
        
    def validate(self, query):
        """Validate SQL query and return issues."""
        issues = []
        warnings = []
        
        # Basic syntax checks
        if not query.strip():
            issues.append("Empty query")
            return issues, warnings
            
        # Check for common syntax errors
        if query.count('(') != query.count(')'):
            issues.append("Unmatched parentheses")
            
        if query.count("'") % 2 != 0:
            issues.append("Unmatched single quotes")
            
        # Check for SELECT without FROM (except for special cases)
        if 'SELECT' in query.upper() and 'FROM' not in query.upper():
            if not any(x in query.upper() for x in ['DUAL', 'GENERATE_SERIES', 'SEQ']):
                warnings.append("SELECT without FROM clause")
        
        # Dialect-specific checks
        if self.dialect == 'snowflake':
            issues.extend(self._check_snowflake(query))
        elif self.dialect == 'bigquery':
            issues.extend(self._check_bigquery(query))
        elif self.dialect == 'redshift':
            issues.extend(self._check_redshift(query))
            
        # Common anti-patterns
        warnings.extend(self._check_anti_patterns(query))
        
        return issues, warnings
    
    def _check_snowflake(self, query):
        """Snowflake-specific validation."""
        issues = []
        
        # Check for DATE formatting
        if re.search(r"WHERE\s+\w+\s*>\s*'[\d-]+'", query, re.IGNORECASE):
            issues.append("Consider using TO_DATE() or proper date casting for Snowflake")
        
        # Check for JSON handling
        if '::' in query and 'VARIANT' not in query.upper():
            issues.append("Using :: casting - ensure column is VARIANT type in Snowflake")
            
        return issues
    
    def _check_bigquery(self, query):
        """BigQuery-specific validation."""
        issues = []
        
        # Check for table naming
        if re.search(r'FROM\s+[\w-]+\.[\w-]+\.[\w-]+', query):
            pass  # Correct format: project.dataset.table
        elif re.search(r'FROM\s+`[^`]+`', query):
            pass  # Backtick notation
        elif 'FROM' in query.upper():
            issues.append("BigQuery requires project.dataset.table or backtick notation")
        
        # Check for SAFE functions
        if 'CAST' in query.upper() and 'SAFE_CAST' not in query.upper():
            issues.append("Consider SAFE_CAST in BigQuery to avoid errors with invalid data")
            
        return issues
    
    def _check_redshift(self, query):
        """Redshift-specific validation."""
        issues = []
        
        # Check for COPY command structure
        if 'COPY' in query.upper() and 'FROM' not in query.upper():
            issues.append("COPY command requires FROM clause in Redshift")
        
        # Check for distribution keys in CREATE TABLE
        if 'CREATE TABLE' in query.upper():
            if 'DISTKEY' not in query.upper() and 'DISTSTYLE' not in query.upper():
                issues.append("Consider specifying DISTKEY or DISTSTYLE for Redshift table")
                
        return issues
    
    def _check_anti_patterns(self, query):
        """Check for common SQL anti-patterns."""
        warnings = []
        
        # SELECT *
        if re.search(r'SELECT\s+\*', query, re.IGNORECASE):
            warnings.append("Using SELECT * - consider specifying columns explicitly")
        
        # No WHERE clause with DELETE or UPDATE
        if 'DELETE' in query.upper() and 'WHERE' not in query.upper():
            warnings.append("DELETE without WHERE clause - will delete all rows!")
            
        if 'UPDATE' in query.upper() and 'WHERE' not in query.upper():
            warnings.append("UPDATE without WHERE clause - will update all rows!")
        
        # DISTINCT usage
        if 'DISTINCT' in query.upper():
            warnings.append("Using DISTINCT - ensure it's necessary as it can impact performance")
        
        # Multiple JOINs without explicit order
        join_count = query.upper().count(' JOIN ')
        if join_count > 3:
            warnings.append(f"Query has {join_count} JOINs - ensure join order is optimized")
        
        # GROUP BY with column numbers
        if re.search(r'GROUP BY\s+\d+', query, re.IGNORECASE):
            warnings.append("Using positional GROUP BY - consider explicit column names for clarity")
            
        return warnings

def main():
    parser = argparse.ArgumentParser(description="Validate SQL syntax for cloud data warehouses")
    parser.add_argument("--query", help="SQL query to validate")
    parser.add_argument("--file", help="File containing SQL query")
    parser.add_argument("--dialect", default="snowflake",
                       choices=["snowflake", "bigquery", "redshift"],
                       help="SQL dialect to validate against")
    
    args = parser.parse_args()
    
    if not args.query and not args.file:
        parser.error("Must provide either --query or --file")
    
    if args.file:
        with open(args.file, 'r') as f:
            query = f.read()
    else:
        query = args.query
    
    validator = SQLValidator(dialect=args.dialect)
    issues, warnings = validator.validate(query)
    
    print(f"\nValidating SQL for {args.dialect.upper()}")
    print("="*80)
    print(f"\nQuery:\n{query}\n")
    print("="*80)
    
    if not issues and not warnings:
        print("\n✅ No issues found!")
    else:
        if issues:
            print("\n❌ ERRORS:")
            for i, issue in enumerate(issues, 1):
                print(f"  {i}. {issue}")
        
        if warnings:
            print("\n⚠️  WARNINGS:")
            for i, warning in enumerate(warnings, 1):
                print(f"  {i}. {warning}")
    
    print("\n" + "="*80)
    
    # Return exit code based on issues
    return 1 if issues else 0

if __name__ == "__main__":
    exit(main())
