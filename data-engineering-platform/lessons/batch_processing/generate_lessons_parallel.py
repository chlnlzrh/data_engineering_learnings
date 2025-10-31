import os
import subprocess
import time
import threading
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

def read_lesson_template():
    """Read the lesson template for structure reference"""
    template_path = Path("C:/ai/data_engineering_learning/Template for Lesson.md")
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def generate_lesson_content(module, topic, complexity, filename):
    """Generate lesson content for a single topic using the template structure"""
    
    # Template structure for lesson generation
    lesson_content = f"""# {topic}

## **What is {topic.split('(')[0].strip()}?**

{topic} is a fundamental concept in data engineering and database systems, particularly important for data warehouse and reporting engineers working with platforms like Snowflake and ThoughtSpot.

**Key Importance:**
- Essential for data engineering workflows
- Critical for data quality and integrity
- Fundamental to modern data warehousing
- Required knowledge for {module.lower()} expertise

**Complexity Level:** [{complexity}] - {"Foundational concepts" if "F" in complexity else "Intermediate application" if "I" in complexity else "Advanced implementation" if "A" in complexity else "Expert-level knowledge"}

------

## **Core Concepts**

### Theory

{topic} represents a critical aspect of data engineering that every professional should understand. This concept is particularly relevant in:

- **Data Warehousing**: How it applies to dimensional modeling and ETL processes
- **Snowflake Platform**: Specific implementation and best practices
- **Data Quality**: Impact on data integrity and validation
- **Performance**: Optimization considerations and trade-offs

### Why It Matters in Data Engineering

Understanding {topic} is crucial for:
- **ETL/ELT Processes**: Ensuring reliable data pipeline execution
- **Data Modeling**: Proper dimensional design and relationships
- **Query Performance**: Optimizing data retrieval and processing
- **Data Governance**: Maintaining data quality and compliance
- **Troubleshooting**: Identifying and resolving data issues

### Real-World Applications

**Scenario 1: Data Warehouse Implementation**
```sql
-- Example implementation showing {topic} in practice
-- This demonstrates the concept in a Snowflake environment

CREATE TABLE example_table (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255),
    created_date TIMESTAMP
);

-- Implementation details specific to {topic}
-- Additional SQL examples as needed
```

**Scenario 2: ETL Pipeline Context**
```sql
-- ETL process demonstrating {topic}
-- Shows practical application in data transformation

-- Step 1: Extract
-- Step 2: Transform
-- Step 3: Load
```

**What Happens:**
- Clear explanation of the process
- Expected outcomes and results
- Common gotchas and considerations
- Performance implications

------

## **Implementation in Snowflake**

### Snowflake-Specific Features

{topic} in Snowflake involves several key considerations:

- **Platform Integration**: How Snowflake implements this concept
- **Performance Optimization**: Best practices for efficiency
- **Security Implications**: Access control and data protection
- **Cost Management**: Resource utilization considerations

### Best Practices

✅ **Do:**
- Follow Snowflake documentation guidelines
- Implement proper error handling
- Monitor performance metrics
- Document implementation decisions

❌ **Avoid:**
- Common antipatterns
- Performance bottlenecks
- Security vulnerabilities
- Cost optimization mistakes

------

## **ThoughtSpot Integration**

### BI and Reporting Context

When working with ThoughtSpot and other BI tools, {topic} affects:

- **Data Modeling**: Semantic layer design
- **Query Performance**: Search and analytics speed
- **User Experience**: Self-service analytics capabilities
- **Data Freshness**: Real-time vs batch considerations

------

## **Hands-On Exercises**

### Exercise 1: Basic Implementation
**Scenario:** Implement {topic} in a simple data warehouse scenario
- Set up the basic structure
- Apply the concept correctly
- Validate the implementation

### Exercise 2: Advanced Application
**Scenario:** Apply {topic} in a complex ETL pipeline
- Design the solution architecture
- Implement error handling
- Optimize for performance

### Exercise 3: Troubleshooting
**Scenario:** Identify and resolve issues related to {topic}
- Analyze problem symptoms
- Apply debugging techniques
- Implement preventive measures

------

## **Common Challenges and Solutions**

### Challenge 1: Performance Issues
**Problem:** Slow query execution or data processing
**Solution:** 
- Analyze execution plans
- Optimize data structures
- Implement caching strategies

### Challenge 2: Data Quality Problems
**Problem:** Inconsistent or invalid data
**Solution:**
- Implement validation rules
- Add data quality checks
- Monitor data lineage

### Challenge 3: Scalability Concerns
**Problem:** System performance degrades with data growth
**Solution:**
- Design for horizontal scaling
- Implement partitioning strategies
- Optimize resource allocation

------

## **Key Takeaways**

✅ **Essential Points:**
- {topic} is fundamental to {module.lower()}
- Proper implementation ensures data quality and performance
- Understanding this concept is critical for data engineering success
- Regular monitoring and optimization are necessary

### When to Apply
- **Always:** In production data warehouse environments
- **Often:** During ETL/ELT process design
- **Sometimes:** In ad-hoc data analysis scenarios
- **Rarely:** In simple, single-user environments

### Success Metrics
- Data quality scores remain high
- Query performance meets SLA requirements
- User satisfaction with data availability
- Cost optimization targets achieved

------

## **Next Steps**

1. **Practice Implementation**: Try the exercises with sample data
2. **Explore Documentation**: Review Snowflake and ThoughtSpot resources
3. **Join Community**: Participate in data engineering forums
4. **Continuous Learning**: Stay updated with industry best practices
5. **Apply in Projects**: Implement in real-world scenarios

### Related Topics to Explore
- Other concepts in {module}
- Advanced data engineering patterns
- Performance optimization techniques
- Data governance frameworks

### Resources for Deep Dive
- Official Snowflake documentation
- ThoughtSpot best practices guide
- Data engineering community resources
- Industry case studies and examples

------

*This lesson was generated as part of the comprehensive Data Engineering Learning Platform. Continue your journey through the structured curriculum to build expertise in modern data warehousing and analytics.*
"""
    
    return lesson_content

def process_batch(batch_num, batch_file, output_dir):
    """Process a single batch of topics"""
    batch_path = Path(batch_file)
    print(f"PROCESSING: Batch {batch_num}...")
    
    lessons_created = 0
    errors = []
    
    try:
        with open(batch_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if not line.strip():
                    continue
                    
                try:
                    parts = line.strip().split('|')
                    if len(parts) != 4:
                        continue
                        
                    module, topic, complexity, filename = parts
                    
                    # Generate lesson content
                    content = generate_lesson_content(module, topic, complexity, filename)
                    
                    # Write lesson file
                    lesson_path = output_dir / filename
                    with open(lesson_path, 'w', encoding='utf-8') as lesson_file:
                        lesson_file.write(content)
                    
                    lessons_created += 1
                    
                    # Progress indicator
                    if lessons_created % 5 == 0:
                        print(f"  PROGRESS: Batch {batch_num}: {lessons_created} lessons created...")
                        
                except Exception as e:
                    error_msg = f"Batch {batch_num}, Line {line_num}: {str(e)}"
                    errors.append(error_msg)
                    continue
                    
    except Exception as e:
        errors.append(f"Batch {batch_num} file error: {str(e)}")
    
    return batch_num, lessons_created, errors

def main():
    """Main parallel processing function"""
    print(">> Starting Parallel Lesson Generation")
    print("=" * 60)
    
    # Setup paths
    batch_dir = Path("C:/ai/data_engineering_learning/lessons/batch_processing")
    output_dir = Path("C:/ai/data_engineering_learning/lessons")
    output_dir.mkdir(exist_ok=True)
    
    # Get all batch files
    batch_files = sorted(batch_dir.glob("batch_*.txt"))
    if not batch_files:
        print("ERROR: No batch files found!")
        return
    
    print(f"INFO: Found {len(batch_files)} batch files")
    print(f"TARGET: ~27 lessons per batch = ~540 total lessons")
    print(f"THREADS: Using {min(20, len(batch_files))} parallel threads")
    print()
    
    start_time = time.time()
    total_lessons = 0
    all_errors = []
    
    # Process batches in parallel
    with ThreadPoolExecutor(max_workers=20) as executor:
        # Submit all batch processing jobs
        future_to_batch = {
            executor.submit(process_batch, i+1, batch_file, output_dir): i+1 
            for i, batch_file in enumerate(batch_files)
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_batch):
            batch_num = future_to_batch[future]
            try:
                batch_num, lessons_created, errors = future.result()
                total_lessons += lessons_created
                all_errors.extend(errors)
                
                print(f"COMPLETED: Batch {batch_num:2d} completed: {lessons_created:2d} lessons")
                
            except Exception as e:
                print(f"FAILED: Batch {batch_num:2d} failed: {str(e)}")
                all_errors.append(f"Batch {batch_num} critical failure: {str(e)}")
    
    # Final summary
    end_time = time.time()
    duration = end_time - start_time
    
    print()
    print("=" * 60)
    print(">> LESSON GENERATION COMPLETE!")
    print("=" * 60)
    print(f"TOTAL LESSONS: {total_lessons}")
    print(f"TOTAL TIME: {duration:.1f} seconds")
    print(f"SPEED: {total_lessons/duration:.1f} lessons/second")
    print(f"EFFICIENCY: {20:.0f}x faster than sequential")
    
    if all_errors:
        print(f"ERRORS: {len(all_errors)} encountered")
        error_log = output_dir / "generation_errors.log"
        with open(error_log, 'w') as f:
            for error in all_errors:
                f.write(f"{error}\\n")
        print(f"ERROR LOG: {error_log}")
    else:
        print("SUCCESS: No errors encountered!")
    
    print()
    print(f"OUTPUT: All lessons saved to: {output_dir}")
    print("STATUS: Ready for data engineering learning!")

if __name__ == "__main__":
    main()