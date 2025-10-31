#!/usr/bin/env python3
"""
Final Comprehensive Lesson Test with Proper Navigation
Optimized for 10-core/20-thread/32GB RAM system

Tests individual lesson pages directly using the generated navigation map
to verify typography enhancements and markdown rendering.
"""

import asyncio
import concurrent.futures
import json
import time
import random
from datetime import datetime
from playwright.async_api import async_playwright
from pathlib import Path

BASE_URL = "http://localhost:3002"

class ComprehensiveLessonTester:
    def __init__(self, max_workers=15):  # Slightly reduced to prevent overwhelming
        self.max_workers = max_workers
        self.results = []
        self.start_time = time.time()
        self.navigation_map = self.load_navigation_map()
        
    def load_navigation_map(self):
        """Load the lesson navigation map"""
        try:
            with open('lesson_navigation_map.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print("Navigation map not found! Run parallel_lesson_generator.py first.")
            return {}
    
    def select_test_lessons(self, lessons_per_module=3):
        """Select representative lessons from each module for testing"""
        test_lessons = []
        
        for module_id, module_info in self.navigation_map.items():
            lessons = module_info['lessons']
            
            # Select diverse lessons: first, middle, last (up to 3)
            if len(lessons) >= 3:
                selected = [
                    lessons[0],  # First lesson
                    lessons[len(lessons)//2],  # Middle lesson
                    lessons[-1]  # Last lesson
                ]
            else:
                selected = lessons  # All lessons if fewer than 3
            
            for lesson in selected[:lessons_per_module]:
                test_lessons.append({
                    'module_id': module_id,
                    'module_name': module_info['module_name'],
                    'lesson_slug': lesson['slug'],
                    'lesson_title': lesson['title'],
                    'lesson_url': lesson['url']
                })
        
        return test_lessons
    
    async def test_single_lesson(self, lesson_info):
        """Test a single lesson page for typography and rendering"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                lesson_url = f"{BASE_URL}{lesson_info['lesson_url']}"
                
                # Navigate directly to lesson page
                await page.goto(lesson_url, timeout=30000)
                
                # Wait for lesson content to load
                await page.wait_for_selector('h1', timeout=15000)
                
                # Test lesson page elements
                lesson_title = await page.query_selector('h1')
                title_text = await lesson_title.text_content() if lesson_title else "No title"
                
                # Check for Tailwind Typography prose container
                prose_container = await page.query_selector('.prose')
                has_prose_styling = prose_container is not None
                
                # Check specific typography elements
                h1_elements = await page.query_selector_all('h1')
                h2_elements = await page.query_selector_all('h2')
                h3_elements = await page.query_selector_all('h3')
                paragraph_elements = await page.query_selector_all('p')
                code_blocks = await page.query_selector_all('pre')
                
                # Check for enhanced styling classes
                prose_classes = await prose_container.get_attribute('class') if prose_container else ""
                has_enhanced_prose = 'prose-lg' in prose_classes or 'prose-gray' in prose_classes
                
                # Check for raw markdown content (should not be present)
                page_content = await page.text_content('body')
                has_raw_markdown = '```' in page_content and 'javascript' in page_content.lower()
                
                # Check for loading and error states
                loading_indicator = await page.query_selector('[data-testid="loading"]')
                error_message = await page.query_selector('[data-testid="error"]')
                
                # Check navigation elements
                back_button = await page.query_selector('button:has-text("Back")')
                module_link = await page.query_selector('a[href*="/learning-path/"]')
                
                # Test markdown rendering quality
                markdown_quality = {
                    'headers_styled': len(h1_elements) + len(h2_elements) + len(h3_elements) > 0,
                    'paragraphs_present': len(paragraph_elements) > 0,
                    'code_blocks_styled': len(code_blocks) > 0,
                    'proper_spacing': has_enhanced_prose
                }
                
                return {
                    'module_id': lesson_info['module_id'],
                    'module_name': lesson_info['module_name'],
                    'lesson_slug': lesson_info['lesson_slug'],
                    'lesson_title': lesson_info['lesson_title'],
                    'expected_title': lesson_info['lesson_title'],
                    'actual_title': title_text,
                    'url': lesson_url,
                    
                    # Core functionality
                    'loads_successfully': lesson_title is not None,
                    'title_matches': lesson_info['lesson_title'].lower() in title_text.lower(),
                    
                    # Typography and styling
                    'has_prose_container': has_prose_styling,
                    'has_enhanced_prose': has_enhanced_prose,
                    'prose_classes': prose_classes,
                    
                    # Content analysis
                    'element_counts': {
                        'h1': len(h1_elements),
                        'h2': len(h2_elements),
                        'h3': len(h3_elements),
                        'paragraphs': len(paragraph_elements),
                        'code_blocks': len(code_blocks)
                    },
                    
                    # Quality indicators
                    'markdown_quality': markdown_quality,
                    'has_raw_markdown': has_raw_markdown,
                    'has_navigation': back_button is not None and module_link is not None,
                    'has_loading_state': loading_indicator is not None,
                    'has_error_handling': error_message is not None,
                    
                    'success': True,
                    'timestamp': datetime.now().isoformat()
                }
                
            except Exception as e:
                return {
                    'module_id': lesson_info['module_id'],
                    'lesson_slug': lesson_info['lesson_slug'],
                    'url': lesson_url,
                    'error': str(e),
                    'success': False,
                    'timestamp': datetime.now().isoformat()
                }
            finally:
                await browser.close()
    
    async def run_comprehensive_test(self):
        """Run comprehensive tests on selected lessons"""
        if not self.navigation_map:
            print("No navigation map available!")
            return []
        
        # Select test lessons
        test_lessons = self.select_test_lessons(lessons_per_module=3)
        
        print(f"Testing {len(test_lessons)} lessons across {len(self.navigation_map)} modules")
        print(f"Using {self.max_workers} parallel workers")
        
        # Create semaphore to limit concurrent browsers
        semaphore = asyncio.Semaphore(self.max_workers)
        
        async def test_with_semaphore(lesson_info):
            async with semaphore:
                return await self.test_single_lesson(lesson_info)
        
        # Run all tests in parallel
        tasks = [test_with_semaphore(lesson) for lesson in test_lessons]
        self.results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return self.results
    
    def generate_comprehensive_report(self):
        """Generate detailed quality and performance report"""
        duration = time.time() - self.start_time
        
        successful_tests = [r for r in self.results if isinstance(r, dict) and r.get('success', False)]
        failed_tests = [r for r in self.results if not isinstance(r, dict) or not r.get('success', False)]
        
        # Typography and styling analysis
        prose_containers = sum(1 for r in successful_tests if r.get('has_prose_container', False))
        enhanced_prose = sum(1 for r in successful_tests if r.get('has_enhanced_prose', False))
        proper_navigation = sum(1 for r in successful_tests if r.get('has_navigation', False))
        clean_rendering = sum(1 for r in successful_tests if not r.get('has_raw_markdown', True))
        
        # Content quality analysis
        quality_scores = []
        for result in successful_tests:
            if 'markdown_quality' in result:
                quality = result['markdown_quality']
                score = sum([
                    quality.get('headers_styled', False),
                    quality.get('paragraphs_present', False),
                    quality.get('code_blocks_styled', False),
                    quality.get('proper_spacing', False)
                ]) / 4 * 100
                quality_scores.append(score)
        
        avg_quality_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        
        # Module-wise breakdown
        module_results = {}
        for result in successful_tests:
            module_id = result.get('module_id', 'unknown')
            if module_id not in module_results:
                module_results[module_id] = {
                    'module_name': result.get('module_name', ''),
                    'tests': 0,
                    'typography_success': 0,
                    'navigation_success': 0,
                    'rendering_success': 0
                }
            
            stats = module_results[module_id]
            stats['tests'] += 1
            if result.get('has_prose_container', False):
                stats['typography_success'] += 1
            if result.get('has_navigation', False):
                stats['navigation_success'] += 1
            if not result.get('has_raw_markdown', True):
                stats['rendering_success'] += 1
        
        report = {
            'test_summary': {
                'total_lessons_tested': len(self.results),
                'successful_tests': len(successful_tests),
                'failed_tests': len(failed_tests),
                'test_duration_seconds': round(duration, 2),
                'lessons_per_second': round(len(self.results) / duration, 2),
                'success_rate': round((len(successful_tests) / len(self.results)) * 100, 1) if self.results else 0
            },
            
            'enhancement_quality': {
                'typography_implementation': {
                    'lessons_with_prose_container': prose_containers,
                    'lessons_with_enhanced_prose': enhanced_prose,
                    'typography_success_rate': round((prose_containers / len(successful_tests)) * 100, 1) if successful_tests else 0,
                    'enhancement_success_rate': round((enhanced_prose / len(successful_tests)) * 100, 1) if successful_tests else 0
                },
                'rendering_quality': {
                    'clean_markdown_rendering': clean_rendering,
                    'proper_navigation': proper_navigation,
                    'rendering_success_rate': round((clean_rendering / len(successful_tests)) * 100, 1) if successful_tests else 0,
                    'navigation_success_rate': round((proper_navigation / len(successful_tests)) * 100, 1) if successful_tests else 0
                },
                'overall_quality_score': round(avg_quality_score, 1)
            },
            
            'performance_metrics': {
                'parallel_workers': self.max_workers,
                'parallel_efficiency': round((len(self.results) / self.max_workers) / duration, 2),
                'avg_lesson_test_time': round(duration / len(self.results), 2),
                'system_optimization': '10-core/20-thread optimized'
            },
            
            'module_breakdown': module_results,
            'detailed_results': self.results,
            'timestamp': datetime.now().isoformat()
        }
        
        return report

async def main():
    """Main test execution"""
    print("=" * 80)
    print("FINAL COMPREHENSIVE LESSON ENHANCEMENT TEST")
    print("Testing Typography, Navigation, and Markdown Rendering")
    print("Optimized for 10-core/20-thread/32GB RAM system")
    print("=" * 80)
    
    tester = ComprehensiveLessonTester(max_workers=15)
    
    try:
        # Run comprehensive tests
        results = await tester.run_comprehensive_test()
        
        if not results:
            print("No results to analyze!")
            return
        
        # Generate report
        report = tester.generate_comprehensive_report()
        
        # Save report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"final_lesson_enhancement_report_{timestamp}.json"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        # Print comprehensive summary
        print("\n" + "=" * 80)
        print("COMPREHENSIVE TEST RESULTS")
        print("=" * 80)
        
        summary = report['test_summary']
        typography = report['enhancement_quality']['typography_implementation']
        rendering = report['enhancement_quality']['rendering_quality']
        performance = report['performance_metrics']
        
        print(f"OVERALL RESULTS:")
        print(f"  Tests Run: {summary['successful_tests']}/{summary['total_lessons_tested']}")
        print(f"  Success Rate: {summary['success_rate']}%")
        print(f"  Duration: {summary['test_duration_seconds']}s")
        print(f"  Speed: {summary['lessons_per_second']} lessons/sec")
        
        print(f"\nTYPOGRAPHY ENHANCEMENTS:")
        print(f"  Prose Containers: {typography['lessons_with_prose_container']} lessons ({typography['typography_success_rate']}%)")
        print(f"  Enhanced Styling: {typography['lessons_with_enhanced_prose']} lessons ({typography['enhancement_success_rate']}%)")
        
        print(f"\nRENDERING QUALITY:")
        print(f"  Clean Rendering: {rendering['clean_markdown_rendering']} lessons ({rendering['rendering_success_rate']}%)")
        print(f"  Proper Navigation: {rendering['proper_navigation']} lessons ({rendering['navigation_success_rate']}%)")
        print(f"  Overall Quality Score: {report['enhancement_quality']['overall_quality_score']}/100")
        
        print(f"\nPERFORMANCE:")
        print(f"  Parallel Workers: {performance['parallel_workers']}")
        print(f"  Efficiency: {performance['parallel_efficiency']}")
        print(f"  Avg Test Time: {performance['avg_lesson_test_time']}s/lesson")
        
        print(f"\nMODULE BREAKDOWN:")
        for module_id, stats in report['module_breakdown'].items():
            success_rate = round((stats['typography_success'] / stats['tests']) * 100, 1) if stats['tests'] > 0 else 0
            print(f"  {module_id}: {stats['typography_success']}/{stats['tests']} ({success_rate}%) - {stats['module_name']}")
        
        if summary['failed_tests'] > 0:
            print(f"\nFAILED TESTS: {summary['failed_tests']}")
            for result in tester.results:
                if not isinstance(result, dict) or not result.get('success', False):
                    if isinstance(result, dict):
                        print(f"  - {result.get('lesson_slug', 'Unknown')}: {result.get('error', 'Unknown error')}")
        
        print(f"\nDetailed report saved to: {report_file}")
        print("=" * 80)
        
        return report
        
    except Exception as e:
        print(f"Test execution failed: {e}")
        return None

if __name__ == "__main__":
    asyncio.run(main())