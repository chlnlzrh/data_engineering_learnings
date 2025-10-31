#!/usr/bin/env python3
"""
Parallel Lesson Enhancement Test for All 20 Modules
Optimized for 10-core/20-thread/32GB RAM system

Tests lesson navigation, markdown rendering, and typography enhancements
across all modules using parallel processing.
"""

import asyncio
import concurrent.futures
import json
import time
from datetime import datetime
from playwright.async_api import async_playwright
import sys

# Module configuration for all 20 modules
MODULES = [
    {"id": "module-1", "name": "Data & Database Fundamentals"},
    {"id": "module-2", "name": "SQL & ELT Concepts"},
    {"id": "module-3", "name": "Data Warehousing Principles"},
    {"id": "module-4", "name": "Data Modeling"},
    {"id": "module-5", "name": "Snowflake-Specific Knowledge"},
    {"id": "module-6", "name": "ETL/ELT Design & Best Practices"},
    {"id": "module-7", "name": "Data Governance, Quality & Metadata"},
    {"id": "module-8", "name": "Snowflake Security & Access Control"},
    {"id": "module-9", "name": "Reporting & BI Concepts"},
    {"id": "module-10", "name": "Unix/Linux & File Handling"},
    {"id": "module-11", "name": "Version Control & Team Collaboration"},
    {"id": "module-12", "name": "Performance Optimization & Troubleshooting"},
    {"id": "module-13", "name": "CI/CD & Deployment Practices"},
    {"id": "module-14", "name": "Monitoring & Observability"},
    {"id": "module-15", "name": "Orchestration & Scheduling Tools"},
    {"id": "module-16", "name": "Data Transformation with dbt"},
    {"id": "module-17", "name": "Soft Skills & Professional Practices"},
    {"id": "module-18", "name": "Business & Domain Knowledge"},
    {"id": "module-19", "name": "Additional Technical Skills"},
    {"id": "module-20", "name": "Emerging Topics & Advanced Concepts"}
]

BASE_URL = "http://localhost:3002"

class LessonEnhancementTester:
    def __init__(self, max_workers=20):
        self.max_workers = max_workers
        self.results = []
        self.start_time = time.time()
        
    async def test_single_module(self, module_info):
        """Test lesson navigation and styling for a single module"""
        module_id = module_info["id"]
        module_name = module_info["name"]
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                print(f"Testing {module_id}: {module_name}")
                
                # Navigate to module page
                module_url = f"{BASE_URL}/learning-path/{module_id}"
                await page.goto(module_url, timeout=30000)
                
                # Wait for module content to load
                await page.wait_for_selector('h1', timeout=15000)
                
                # Check if module loads properly
                title = await page.text_content('h1')
                module_loads = title is not None
                
                # Find Start buttons for lessons
                start_buttons = await page.query_selector_all('button:has-text("Start")')
                lesson_count = len(start_buttons)
                
                lesson_tests = []
                
                # Test up to 3 lessons per module (to manage load)
                for i, button in enumerate(start_buttons[:3]):
                    try:
                        # Click Start button to navigate to lesson
                        await button.click()
                        
                        # Wait for lesson page to load
                        await page.wait_for_selector('h1', timeout=15000)
                        
                        # Check for lesson page elements
                        lesson_title = await page.query_selector('h1')
                        prose_container = await page.query_selector('.prose')
                        headers = await page.query_selector_all('h1, h2, h3')
                        paragraphs = await page.query_selector_all('p')
                        code_blocks = await page.query_selector_all('pre')
                        
                        # Check for raw markdown (should not be present)
                        page_content = await page.text_content('body')
                        has_raw_markdown = '```' in page_content or '##' in page_content
                        
                        lesson_test = {
                            "lesson_index": i + 1,
                            "loads_successfully": lesson_title is not None,
                            "has_prose_styling": prose_container is not None,
                            "header_count": len(headers),
                            "paragraph_count": len(paragraphs),
                            "code_block_count": len(code_blocks),
                            "has_raw_markdown": has_raw_markdown,
                            "title": await lesson_title.text_content() if lesson_title else "No title"
                        }
                        
                        lesson_tests.append(lesson_test)
                        
                        # Go back to module page for next lesson
                        await page.go_back()
                        await page.wait_for_selector('button:has-text("Start")', timeout=10000)
                        
                    except Exception as e:
                        lesson_tests.append({
                            "lesson_index": i + 1,
                            "error": str(e),
                            "loads_successfully": False
                        })
                
                return {
                    "module_id": module_id,
                    "module_name": module_name,
                    "module_loads": module_loads,
                    "module_title": title,
                    "total_lessons": lesson_count,
                    "lessons_tested": len(lesson_tests),
                    "lesson_tests": lesson_tests,
                    "success": True,
                    "timestamp": datetime.now().isoformat()
                }
                
            except Exception as e:
                return {
                    "module_id": module_id,
                    "module_name": module_name,
                    "error": str(e),
                    "success": False,
                    "timestamp": datetime.now().isoformat()
                }
            finally:
                await browser.close()
    
    async def run_parallel_tests(self):
        """Run tests for all modules in parallel"""
        print(f"Starting parallel lesson enhancement tests for {len(MODULES)} modules")
        print(f"Using {self.max_workers} parallel workers (optimized for 20-thread system)")
        
        # Create semaphore to limit concurrent browsers
        semaphore = asyncio.Semaphore(self.max_workers)
        
        async def test_with_semaphore(module_info):
            async with semaphore:
                return await self.test_single_module(module_info)
        
        # Run all tests in parallel
        tasks = [test_with_semaphore(module) for module in MODULES]
        self.results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return self.results
    
    def generate_report(self):
        """Generate comprehensive test report"""
        duration = time.time() - self.start_time
        
        successful_modules = [r for r in self.results if isinstance(r, dict) and r.get('success', False)]
        failed_modules = [r for r in self.results if not isinstance(r, dict) or not r.get('success', False)]
        
        total_lessons_tested = sum(r.get('lessons_tested', 0) for r in successful_modules)
        total_lessons_available = sum(r.get('total_lessons', 0) for r in successful_modules)
        
        # Count styling successes
        modules_with_prose = sum(1 for r in successful_modules 
                               if any(lt.get('has_prose_styling', False) for lt in r.get('lesson_tests', [])))
        
        lessons_without_raw_markdown = sum(
            sum(1 for lt in r.get('lesson_tests', []) if not lt.get('has_raw_markdown', True))
            for r in successful_modules
        )
        
        report = {
            "test_summary": {
                "total_modules": len(MODULES),
                "successful_modules": len(successful_modules),
                "failed_modules": len(failed_modules),
                "total_lessons_available": total_lessons_available,
                "total_lessons_tested": total_lessons_tested,
                "duration_seconds": round(duration, 2),
                "modules_per_second": round(len(MODULES) / duration, 2),
                "lessons_per_second": round(total_lessons_tested / duration, 2)
            },
            "enhancement_quality": {
                "modules_with_typography": modules_with_prose,
                "lessons_with_proper_rendering": lessons_without_raw_markdown,
                "typography_success_rate": round((modules_with_prose / len(successful_modules)) * 100, 1) if successful_modules else 0,
                "rendering_success_rate": round((lessons_without_raw_markdown / total_lessons_tested) * 100, 1) if total_lessons_tested else 0
            },
            "performance_metrics": {
                "max_workers": self.max_workers,
                "parallel_efficiency": round((len(MODULES) / self.max_workers) / duration, 2),
                "avg_module_test_time": round(duration / len(MODULES), 2),
                "system_utilization": "10-core/20-thread optimized"
            },
            "detailed_results": self.results,
            "timestamp": datetime.now().isoformat()
        }
        
        return report

async def main():
    """Main test execution"""
    print("=" * 80)
    print("PARALLEL LESSON ENHANCEMENT TEST")
    print("Data Engineering Learning Platform - All 20 Modules")
    print("Optimized for 10-core/20-thread/32GB RAM system")
    print("=" * 80)
    
    tester = LessonEnhancementTester(max_workers=20)
    
    try:
        # Run parallel tests
        results = await tester.run_parallel_tests()
        
        # Generate and save report
        report = tester.generate_report()
        
        # Save report to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"lesson_enhancement_report_{timestamp}.json"
        
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        # Print summary
        print("\n" + "=" * 80)
        print("TEST RESULTS SUMMARY")
        print("=" * 80)
        
        summary = report["test_summary"]
        quality = report["enhancement_quality"]
        performance = report["performance_metrics"]
        
        print(f"Modules Tested: {summary['successful_modules']}/{summary['total_modules']}")
        print(f"Lessons Tested: {summary['total_lessons_tested']}/{summary['total_lessons_available']}")
        print(f"Test Duration: {summary['duration_seconds']} seconds")
        print(f"Performance: {summary['modules_per_second']} modules/sec, {summary['lessons_per_second']} lessons/sec")
        
        print(f"\nENHANCEMENT QUALITY:")
        print(f"Typography Success: {quality['typography_success_rate']}% ({quality['modules_with_typography']}/{summary['successful_modules']} modules)")
        print(f"Rendering Success: {quality['rendering_success_rate']}% ({quality['lessons_with_proper_rendering']}/{summary['total_lessons_tested']} lessons)")
        
        print(f"\nPERFORMANCE METRICS:")
        print(f"Parallel Workers: {performance['max_workers']}")
        print(f"Parallel Efficiency: {performance['parallel_efficiency']}")
        print(f"Avg Module Time: {performance['avg_module_test_time']}s")
        
        if summary['failed_modules'] > 0:
            print(f"\nFAILED MODULES: {summary['failed_modules']}")
            for result in tester.results:
                if not isinstance(result, dict) or not result.get('success', False):
                    if isinstance(result, dict):
                        print(f"- {result.get('module_id', 'Unknown')}: {result.get('error', 'Unknown error')}")
                    else:
                        print(f"- Exception: {result}")
        
        print(f"\nDetailed report saved to: {report_file}")
        print("=" * 80)
        
        return report
        
    except Exception as e:
        print(f"Test execution failed: {e}")
        return None

if __name__ == "__main__":
    asyncio.run(main())