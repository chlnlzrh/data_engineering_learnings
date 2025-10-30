import re
import os
from pathlib import Path

def extract_topics_with_modules():
    """Extract all topics with their module categories from training document"""
    
    topics_file = Path("C:/ai/data_engineering_learning/Data Training Topics.txt")
    
    with open(topics_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match module headers
    module_pattern = r'Module \d+: (.+?)(?=\n)'
    
    # Pattern to match topic lines with complexity
    topic_pattern = r'•\s+(.+?)\s+\[([FEIA-]+)\]'
    
    topics_data = []
    current_module = None
    
    lines = content.split('\n')
    
    for line in lines:
        # Check for module header
        module_match = re.match(module_pattern, line.strip())
        if module_match:
            current_module = module_match.group(1).strip()
            continue
            
        # Check for topic
        topic_match = re.match(topic_pattern, line.strip())
        if topic_match and current_module:
            topic_name = topic_match.group(1).strip()
            complexity = topic_match.group(2).strip()
            
            # Skip legend entries
            if topic_name.startswith('[') or 'Foundational' in topic_name or 'Intermediate' in topic_name:
                continue
                
            topics_data.append({
                'module': current_module,
                'topic': topic_name,
                'complexity': complexity,
                'filename': create_filename(current_module, topic_name)
            })
    
    return topics_data

def create_filename(module, topic):
    """Create standardized filename"""
    # Clean module name
    module_clean = re.sub(r'[^\w\s-]', '', module).strip()
    module_clean = re.sub(r'\s+', '-', module_clean)
    
    # Clean topic name  
    topic_clean = re.sub(r'[^\w\s-]', '', topic).strip()
    topic_clean = re.sub(r'\s+', '-', topic_clean)
    topic_clean = topic_clean.lower()
    
    return f"{module_clean}--{topic_clean}--2024-10-30.md"

def split_into_batches(topics, num_batches=20):
    """Split topics into balanced batches for parallel processing"""
    
    # Sort by complexity (F first, then I, A, E for faster processing)
    complexity_order = {'F': 1, 'F-I': 2, 'I': 3, 'I-A': 4, 'A': 5, 'A-E': 6, 'E': 7}
    
    topics_sorted = sorted(topics, key=lambda x: complexity_order.get(x['complexity'], 999))
    
    # Create balanced batches
    batch_size = len(topics_sorted) // num_batches
    remainder = len(topics_sorted) % num_batches
    
    batches = []
    start_idx = 0
    
    for i in range(num_batches):
        # Add one extra topic to first 'remainder' batches
        current_batch_size = batch_size + (1 if i < remainder else 0)
        end_idx = start_idx + current_batch_size
        
        batch = topics_sorted[start_idx:end_idx]
        batches.append(batch)
        start_idx = end_idx
    
    return batches

if __name__ == "__main__":
    # Extract all topics
    topics = extract_topics_with_modules()
    print(f"Extracted {len(topics)} topics")
    
    # Split into batches
    batches = split_into_batches(topics, 20)
    
    # Save batch files
    batch_dir = Path("C:/ai/data_engineering_learning/lessons/batch_processing")
    batch_dir.mkdir(exist_ok=True)
    
    for i, batch in enumerate(batches):
        batch_file = batch_dir / f"batch_{i+1:02d}.txt"
        with open(batch_file, 'w', encoding='utf-8') as f:
            for topic in batch:
                f.write(f"{topic['module']}|{topic['topic']}|{topic['complexity']}|{topic['filename']}\n")
        print(f"Batch {i+1}: {len(batch)} topics -> {batch_file}")
    
    print(f"\nTotal: {len(topics)} topics split into {len(batches)} batches")
    print("Ready for parallel processing!")