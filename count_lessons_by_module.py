import os
import re
from pathlib import Path
from collections import defaultdict

# Mapping of lesson prefixes to module names
MODULE_MAPPING = {
    "Data-Database-Fundamentals": "Module 1: Data & Database Fundamentals",
    "SQL-ELT-Concepts": "Module 2: SQL & ELT Concepts", 
    "Data-Warehousing-Principles": "Module 3: Data Warehousing Principles",
    "Data-Modeling": "Module 4: Data Modeling",
    "Snowflake-Specific-Knowledge": "Module 5: Snowflake-Specific Knowledge",
    "ETLELT-Design-Best-Practices": "Module 6: ETL/ELT Design & Best Practices",
    "Data-Governance-Quality-Metadata": "Module 7: Data Governance, Quality & Metadata",
    "Snowflake-Security-Access-Control": "Module 8: Snowflake Security & Access Control",
    "Reporting-BI-Concepts": "Module 9: Reporting & BI Concepts",
    "UnixLinux-File-Handling": "Module 10: Unix/Linux & File Handling",
    "Version-Control-Team-Collaboration": "Module 11: Version Control & Team Collaboration",
    "Performance-Optimization-Troubleshooting": "Module 12: Performance Optimization & Troubleshooting",
    "CICD-Deployment-Practices": "Module 13: CI/CD & Deployment Practices",
    "Monitoring-Observability": "Module 14: Monitoring & Observability",
    "Orchestration-Scheduling-Tools": "Module 15: Orchestration & Scheduling Tools",
    "Data-Transformation-with-dbt-Optional-but-Recommended": "Module 16: Data Transformation with dbt",
    "Soft-Skills-Professional-Practices": "Module 17: Soft Skills & Professional Practices",
    "Business-Domain-Knowledge": "Module 18: Business & Domain Knowledge",
    "Additional-Technical-Skills": "Module 19: Additional Technical Skills",
    "Emerging-Topics-Advanced-Concepts": "Module 20: Emerging Topics & Advanced Concepts"
}

def count_lessons():
    lessons_dir = Path("C:/ai/data_engineering_learning/lessons")
    module_counts = defaultdict(int)
    
    for lesson_file in lessons_dir.glob("*.md"):
        filename = lesson_file.name
        
        # Extract module prefix from filename
        for prefix, module_name in MODULE_MAPPING.items():
            if filename.startswith(prefix):
                module_counts[module_name] += 1
                break
        else:
            # If no prefix matches, categorize as unknown
            module_counts["Unknown"] += 1
    
    # Print results in order
    total = 0
    print("Lesson Counts by Module:")
    print("=" * 60)
    
    for i in range(1, 21):
        module_key = f"Module {i}:"
        for module_name, count in module_counts.items():
            if module_name.startswith(module_key):
                print(f"{module_name}: {count} lessons")
                total += count
                break
    
    if "Unknown" in module_counts:
        print(f"Unknown: {module_counts['Unknown']} lessons")
        total += module_counts["Unknown"]
    
    print("=" * 60)
    print(f"Total: {total} lessons")
    
    # Return as dictionary for programmatic use
    return dict(module_counts)

if __name__ == "__main__":
    count_lessons()