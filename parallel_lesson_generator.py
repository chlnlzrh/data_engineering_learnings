#!/usr/bin/env python3
"""
Parallel Lesson Generator and Enhancement
Optimized for 10-core/20-thread/32GB RAM system

Generates proper lesson slug navigation for all modules and verifies
the lesson navigation system works correctly.
"""

import os
import re
import json
import asyncio
import concurrent.futures
from pathlib import Path
from datetime import datetime

# Base directory for lessons
LESSONS_DIR = Path(r"C:\ai\data_engineering_learning\lessons")

# Module mapping
MODULE_MAPPING = {
    'Data-Database-Fundamentals': {'id': 'module-1', 'name': 'Module 1: Data & Database Fundamentals'},
    'SQL-ELT-Concepts': {'id': 'module-2', 'name': 'Module 2: SQL & ELT Concepts'},
    'Data-Warehousing-Principles': {'id': 'module-3', 'name': 'Module 3: Data Warehousing Principles'},
    'Data-Modeling': {'id': 'module-4', 'name': 'Module 4: Data Modeling'},
    'Snowflake-Specific-Knowledge': {'id': 'module-5', 'name': 'Module 5: Snowflake-Specific Knowledge'},
    'ETLELT-Design-Best-Practices': {'id': 'module-6', 'name': 'Module 6: ETL/ELT Design & Best Practices'},
    'Data-Governance-Quality-Metadata': {'id': 'module-7', 'name': 'Module 7: Data Governance, Quality & Metadata'},
    'Snowflake-Security-Access-Control': {'id': 'module-8', 'name': 'Module 8: Snowflake Security & Access Control'},
    'Reporting-BI-Concepts': {'id': 'module-9', 'name': 'Module 9: Reporting & BI Concepts'},
    'UnixLinux-File-Handling': {'id': 'module-10', 'name': 'Module 10: Unix/Linux & File Handling'},
    'Version-Control-Team-Collaboration': {'id': 'module-11', 'name': 'Module 11: Version Control & Team Collaboration'},
    'Performance-Optimization-Troubleshooting': {'id': 'module-12', 'name': 'Module 12: Performance Optimization & Troubleshooting'},
    'CICD-Deployment-Practices': {'id': 'module-13', 'name': 'Module 13: CI/CD & Deployment Practices'},
    'Monitoring-Observability': {'id': 'module-14', 'name': 'Module 14: Monitoring & Observability'},
    'Orchestration-Scheduling-Tools': {'id': 'module-15', 'name': 'Module 15: Orchestration & Scheduling Tools'},
    'Data-Transformation-with-dbt-Optional-but-Recommended': {'id': 'module-16', 'name': 'Module 16: Data Transformation with dbt'},
    'Soft-Skills-Professional-Practices': {'id': 'module-17', 'name': 'Module 17: Soft Skills & Professional Practices'},
    'Business-Domain-Knowledge': {'id': 'module-18', 'name': 'Module 18: Business & Domain Knowledge'},
    'Additional-Technical-Skills': {'id': 'module-19', 'name': 'Module 19: Additional Technical Skills'},
    'Emerging-Topics-Advanced-Concepts': {'id': 'module-20', 'name': 'Module 20: Emerging Topics & Advanced Concepts'},
}

class LessonSlugGenerator:
    def __init__(self):
        self.lessons_by_module = {}
        self.all_lessons = []
        
    def extract_slug_from_filename(self, filename):
        """Extract lesson slug from filename"""
        # Remove .md extension
        without_ext = filename.replace('.md', '')
        # Format: Module-Name--topic-slug--2024-10-30
        parts = without_ext.split('--')
        if len(parts) >= 2:
            return parts[1] if len(parts) == 3 else '--'.join(parts[1:-1])
        return without_ext
    
    def parse_module_from_filename(self, filename):
        """Parse module info from filename"""
        for prefix, module_info in MODULE_MAPPING.items():
            if filename.startswith(prefix):
                return module_info
        return None
    
    def process_lesson_file(self, file_path):
        """Process a single lesson file"""
        try:
            filename = file_path.name
            module_info = self.parse_module_from_filename(filename)
            
            if not module_info:
                return None
            
            # Read content to extract title
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract title (first # heading)
            title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1) if title_match else 'Untitled Lesson'
            
            slug = self.extract_slug_from_filename(filename)
            
            lesson_info = {
                'slug': slug,
                'title': title,
                'filename': filename,
                'module_id': module_info['id'],
                'module_name': module_info['name'],
                'file_path': str(file_path)
            }
            
            return lesson_info
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return None
    
    def scan_all_lessons(self):
        """Scan all lesson files and organize by module"""
        print(f"Scanning lessons directory: {LESSONS_DIR}")
        
        if not LESSONS_DIR.exists():
            print(f"Lessons directory not found: {LESSONS_DIR}")
            return
        
        md_files = list(LESSONS_DIR.glob("*.md"))
        print(f"Found {len(md_files)} markdown files")
        
        # Process files in parallel
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            results = list(executor.map(self.process_lesson_file, md_files))
        
        # Filter and organize results
        valid_lessons = [r for r in results if r is not None]
        self.all_lessons = valid_lessons
        
        # Group by module
        for lesson in valid_lessons:
            module_id = lesson['module_id']
            if module_id not in self.lessons_by_module:
                self.lessons_by_module[module_id] = []
            self.lessons_by_module[module_id].append(lesson)
        
        print(f"Processed {len(valid_lessons)} valid lessons across {len(self.lessons_by_module)} modules")
        
        return self.lessons_by_module
    
    def generate_lesson_navigation_map(self):
        """Generate lesson navigation mapping for frontend"""
        navigation_map = {}
        
        for module_id, lessons in self.lessons_by_module.items():
            navigation_map[module_id] = {
                'module_id': module_id,
                'module_name': lessons[0]['module_name'] if lessons else '',
                'lesson_count': len(lessons),
                'lessons': [
                    {
                        'slug': lesson['slug'],
                        'title': lesson['title'],
                        'url': f"/lessons/{lesson['slug']}"
                    }
                    for lesson in lessons
                ]
            }
        
        return navigation_map
    
    def save_navigation_map(self, output_file="lesson_navigation_map.json"):
        """Save navigation map to JSON file"""
        nav_map = self.generate_lesson_navigation_map()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(nav_map, f, indent=2, ensure_ascii=False)
        
        print(f"Navigation map saved to: {output_file}")
        return nav_map
    
    def generate_report(self):
        """Generate comprehensive lesson analysis report"""
        nav_map = self.generate_lesson_navigation_map()
        
        total_lessons = sum(info['lesson_count'] for info in nav_map.values())
        
        module_stats = []
        for module_id, info in nav_map.items():
            module_stats.append({
                'module_id': module_id,
                'module_name': info['module_name'],
                'lesson_count': info['lesson_count'],
                'sample_lessons': info['lessons'][:3]  # First 3 lessons as sample
            })
        
        report = {
            'summary': {
                'total_modules': len(nav_map),
                'total_lessons': total_lessons,
                'avg_lessons_per_module': round(total_lessons / len(nav_map), 1) if nav_map else 0,
                'timestamp': datetime.now().isoformat()
            },
            'module_statistics': module_stats,
            'full_navigation_map': nav_map
        }
        
        return report

async def main():
    """Main execution"""
    print("=" * 80)
    print("PARALLEL LESSON SLUG GENERATOR")
    print("Data Engineering Learning Platform - All Modules")
    print("Optimized for 10-core/20-thread/32GB RAM system")
    print("=" * 80)
    
    generator = LessonSlugGenerator()
    
    # Scan and process all lessons
    lessons_by_module = generator.scan_all_lessons()
    
    if not lessons_by_module:
        print("No lessons found!")
        return
    
    # Generate navigation map
    nav_map = generator.save_navigation_map()
    
    # Generate report
    report = generator.generate_report()
    
    # Save detailed report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"lesson_analysis_report_{timestamp}.json"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "=" * 80)
    print("LESSON ANALYSIS SUMMARY")
    print("=" * 80)
    
    summary = report['summary']
    print(f"Total Modules: {summary['total_modules']}")
    print(f"Total Lessons: {summary['total_lessons']}")
    print(f"Avg Lessons/Module: {summary['avg_lessons_per_module']}")
    
    print(f"\nMODULE BREAKDOWN:")
    for stat in report['module_statistics']:
        print(f"  {stat['module_id']}: {stat['lesson_count']} lessons - {stat['module_name']}")
        if stat['sample_lessons']:
            for lesson in stat['sample_lessons']:
                print(f"    • {lesson['title']} ({lesson['url']})")
    
    print(f"\nReports saved:")
    print(f"  - Navigation map: lesson_navigation_map.json")
    print(f"  - Detailed report: {report_file}")
    print("=" * 80)
    
    return report

if __name__ == "__main__":
    asyncio.run(main())