#!/usr/bin/env python3
"""
Generate structured lesson plans for data engineering topics.
"""

import argparse
from datetime import datetime

LESSON_PLANS = {
    "slowly-changing-dimensions": {
        "title": "Slowly Changing Dimensions (SCD)",
        "prerequisites": ["Dimensional modeling basics", "SQL DDL/DML"],
        "learning_objectives": [
            "Understand the need for tracking historical changes in dimension tables",
            "Implement SCD Type 1 (overwrite)",
            "Implement SCD Type 2 (add new row with versioning)",
            "Choose appropriate SCD type based on business requirements"
        ],
        "theory_outline": [
            "What are Slowly Changing Dimensions?",
            "Business drivers for tracking history",
            "SCD Type 1: Overwrite (no history)",
            "SCD Type 2: Add row (full history)",
            "SCD Type 3: Add column (limited history)",
            "Hybrid approaches",
            "Performance and storage considerations"
        ],
        "hands_on": [
            "Create customer dimension table with SCD Type 2 structure",
            "Write SQL to insert initial customer records",
            "Implement logic to detect changes and create new versions",
            "Query historical data using effective/expiration dates",
            "Compare query performance: SCD vs non-SCD"
        ]
    },
    "cdc-patterns": {
        "title": "Change Data Capture (CDC) Patterns",
        "prerequisites": ["ETL fundamentals", "Database transaction logs", "Incremental loading"],
        "learning_objectives": [
            "Understand CDC concepts and benefits over full loads",
            "Implement timestamp-based CDC",
            "Understand log-based CDC mechanisms",
            "Handle CDC events in target warehouse",
            "Manage schema evolution in CDC pipelines"
        ],
        "theory_outline": [
            "What is CDC and why use it?",
            "CDC vs full load vs incremental load",
            "Timestamp-based CDC implementation",
            "Log-based CDC (transaction logs)",
            "Trigger-based CDC",
            "CDC tools landscape (Debezium, Fivetran, Airbyte)",
            "Handling DELETE operations",
            "Schema evolution challenges"
        ],
        "hands_on": [
            "Implement timestamp-based CDC extraction",
            "Create CDC metadata/watermark table",
            "Process CDC events into dimensional model",
            "Handle updates to SCD Type 2 dimensions",
            "Simulate schema changes and handle gracefully"
        ]
    },
    "query-optimization": {
        "title": "SQL Query Optimization for Cloud Warehouses",
        "prerequisites": ["SQL fundamentals", "Cloud warehouse basics"],
        "learning_objectives": [
            "Read and interpret query execution plans",
            "Apply partitioning and clustering strategies",
            "Optimize JOIN operations",
            "Use materialized views effectively",
            "Implement query performance monitoring"
        ],
        "theory_outline": [
            "Query execution fundamentals (scan, filter, join, aggregate)",
            "Understanding EXPLAIN PLAN output",
            "Partitioning vs clustering",
            "JOIN optimization (broadcast vs shuffle)",
            "Predicate pushdown",
            "Materialized views and incremental refresh",
            "Cost-based query optimization",
            "Platform-specific features (Snowflake, BigQuery, Redshift)"
        ],
        "hands_on": [
            "Analyze slow query using EXPLAIN PLAN",
            "Apply clustering to improve query performance",
            "Rewrite query to leverage partitioning",
            "Create materialized view for common aggregation",
            "Compare performance before/after optimization"
        ]
    },
    "dimensional-modeling": {
        "title": "Dimensional Modeling Fundamentals",
        "prerequisites": ["Database concepts", "SQL basics", "Business process understanding"],
        "learning_objectives": [
            "Design star schema dimensional models",
            "Define appropriate grain for fact tables",
            "Create properly structured dimension tables",
            "Understand when to denormalize vs normalize",
            "Apply dimensional modeling best practices"
        ],
        "theory_outline": [
            "Star schema vs snowflake schema",
            "Fact tables: types and design",
            "Grain definition and its importance",
            "Dimension tables: attributes and hierarchies",
            "Additive vs semi-additive vs non-additive facts",
            "Surrogate keys vs natural keys",
            "Conformed dimensions",
            "Common dimensional modeling patterns"
        ],
        "hands_on": [
            "Design dimensional model for retail sales",
            "Create fact and dimension table DDL",
            "Load sample data into star schema",
            "Write analytical queries on dimensional model",
            "Compare performance: dimensional vs normalized"
        ]
    },
    "etl-vs-elt": {
        "title": "ETL vs ELT: Choosing the Right Approach",
        "prerequisites": ["Data pipeline concepts", "SQL", "Cloud platforms basics"],
        "learning_objectives": [
            "Understand differences between ETL and ELT",
            "Identify factors influencing approach selection",
            "Implement basic ETL pipeline",
            "Implement basic ELT pipeline",
            "Make informed architectural decisions"
        ],
        "theory_outline": [
            "ETL: Extract, Transform, Load",
            "ELT: Extract, Load, Transform",
            "Historical context and evolution",
            "Cloud warehouse capabilities enabling ELT",
            "Performance considerations",
            "Cost implications",
            "Maintenance and debugging differences",
            "When to choose ETL vs ELT"
        ],
        "hands_on": [
            "Build ETL pipeline with Python transformation",
            "Build ELT pipeline with SQL transformation in warehouse",
            "Compare development time and complexity",
            "Measure performance and costs",
            "Handle complex transformation in both approaches"
        ]
    }
}

def generate_lesson_plan(topic: str, duration: int) -> str:
    """Generate lesson plan for given topic and duration."""
    if topic not in LESSON_PLANS:
        available = ", ".join(LESSON_PLANS.keys())
        return f"Error: Topic '{topic}' not found. Available topics: {available}"
    
    plan = LESSON_PLANS[topic]
    
    # Calculate time allocations based on duration
    intro_time = int(duration * 0.05)
    theory_time = int(duration * 0.40)
    hands_on_time = int(duration * 0.40)
    assessment_time = int(duration * 0.10)
    qa_time = duration - (intro_time + theory_time + hands_on_time + assessment_time)
    
    output = f"""
{'='*80}
LESSON PLAN: {plan['title']}
{'='*80}

Duration: {duration} minutes
Date: {datetime.now().strftime('%Y-%m-%d')}

PREREQUISITES
-------------
{chr(10).join(f'  • {p}' for p in plan['prerequisites'])}

LEARNING OBJECTIVES
-------------------
{chr(10).join(f'  {i+1}. {obj}' for i, obj in enumerate(plan['learning_objectives']))}

TIME ALLOCATION
---------------
  • Introduction & Context: {intro_time} minutes
  • Theory Deep-Dive: {theory_time} minutes
  • Hands-On Practice: {hands_on_time} minutes
  • Assessment: {assessment_time} minutes
  • Q&A and Wrap-up: {qa_time} minutes

{'='*80}
LESSON CONTENT
{'='*80}

1. INTRODUCTION & CONTEXT ({intro_time} minutes)
------------------------------------------
   • Welcome and learning objectives overview
   • Connect to real-world scenarios
   • Activate prior knowledge (review prerequisites)
   • Set expectations for hands-on activities

2. THEORY DEEP-DIVE ({theory_time} minutes)
------------------------------------
{chr(10).join(f'   {i+1}. {topic} ({theory_time//(len(plan["theory_outline"])+1)} min)' for i, topic in enumerate(plan['theory_outline']))}

   Teaching Approach:
   • Define concepts clearly with examples
   • Use diagrams and visual aids (described verbally)
   • Compare and contrast related concepts
   • Highlight common mistakes and anti-patterns
   • Pause for questions after each major section

3. HANDS-ON PRACTICE ({hands_on_time} minutes)
---------------------------------------
{chr(10).join(f'   Activity {i+1}: {activity}' for i, activity in enumerate(plan['hands_on']))}

   Implementation Notes:
   • Start with guided example (instructor leads)
   • Progress to assisted practice (students work with support)
   • End with independent exercise (students apply concepts)
   • Circulate to provide individual help
   • Discuss common solutions and approaches

4. ASSESSMENT ({assessment_time} minutes)
---------------------------------
   • Quick quiz: 3-5 questions covering key concepts
   • Review exercise solutions
   • Discuss common errors and corrections
   • Self-assessment: "Can you explain X to a colleague?"

5. Q&A AND WRAP-UP ({qa_time} minutes)
-------------------------------
   • Open floor for questions
   • Summarize key takeaways
   • Preview next lesson/topic
   • Assign homework/practice exercises (optional)

{'='*80}
MATERIALS NEEDED
{'='*80}
  • Sample database/warehouse environment
  • Handout with schema diagrams
  • Exercise worksheet
  • Solutions guide (for instructor)
  • Code examples repository

{'='*80}
ASSESSMENT CRITERIA
{'='*80}
Students should be able to:
{chr(10).join(f'  • {obj}' for obj in plan['learning_objectives'])}

Self-Check Questions:
  1. Can you explain the concept to someone unfamiliar with it?
  2. Can you identify when to apply this pattern in real scenarios?
  3. Can you implement a basic version without reference materials?
  4. Can you debug common issues independently?

{'='*80}
FOLLOW-UP ACTIVITIES
{'='*80}
  • Practice exercises for reinforcement
  • Additional reading materials
  • Real-world case studies to analyze
  • Connect with upcoming topics

{'='*80}
"""
    return output

def main():
    parser = argparse.ArgumentParser(description="Generate data engineering lesson plans")
    parser.add_argument("--topic", required=True,
                       choices=list(LESSON_PLANS.keys()),
                       help="Lesson topic")
    parser.add_argument("--duration", type=int, required=True,
                       choices=[30, 60, 90, 120],
                       help="Lesson duration in minutes")
    parser.add_argument("--output", help="Output file path (optional)")
    
    args = parser.parse_args()
    
    lesson_plan = generate_lesson_plan(args.topic, args.duration)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(lesson_plan)
        print(f"Lesson plan saved to: {args.output}")
    else:
        print(lesson_plan)

if __name__ == "__main__":
    main()
