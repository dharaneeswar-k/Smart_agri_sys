import os
import re

def remove_c_style_comments(text):
    # 1. Remove block comments /* ... */
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    # 2. Remove single line comments // ... but avoid http://
    text = re.sub(r'(?<!:)//.*', '', text)
    return text

def remove_comments(content, file_extension):
    """
    Removes comments from the given content based on file extension.
    """
    if file_extension in ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.java', '.c', '.cpp', '.php']:
        content = remove_c_style_comments(content)
        
    elif file_extension in ['.html', '.xml']:
        # 1. Remove HTML comments <!-- ... -->
        content = re.sub(r'<!--[\s\S]*?-->', '', content)
        
        # 2. Remove comments from <script> blocks
        def clean_script(match):
            opentag = match.group(1)
            body = match.group(2)
            closetag = match.group(3)
            return opentag + remove_c_style_comments(body) + closetag
            
        content = re.sub(r'(<script[^>]*>)([\s\S]*?)(</script>)', clean_script, content, flags=re.IGNORECASE)
        
        # 3. Remove comments from <style> blocks
        def clean_style(match):
            opentag = match.group(1)
            body = match.group(2)
            closetag = match.group(3)
            return opentag + remove_c_style_comments(body) + closetag
            
        content = re.sub(r'(<style[^>]*>)([\s\S]*?)(</style>)', clean_style, content, flags=re.IGNORECASE)
        
    elif file_extension in ['.py', '.rb', '.pl', '.sh', '.yaml', '.yml']:
        # Remove hash comments # ...
        content = re.sub(r'#.*', '', content)
        
    return content

def clean_file(file_path):
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    
    supported_extensions = [
        '.js', '.css', '.html', '.py', '.java', '.php', '.c', '.cpp', '.rb', '.pl', '.sh', '.xml', '.yaml', '.yml', '.ts', '.jsx', '.tsx'
    ]
    
    if ext not in supported_extensions:
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = remove_comments(content, ext)
        
        # Remove empty lines that might have been left behind
        lines = [line for line in new_content.splitlines() if line.strip()]
        new_content = '\n'.join(lines) + '\n' # Ensure single newline at end

        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned: {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    root_dir = os.getcwd()
    
    # Directories to exclude
    exclude_dirs = {'.git', 'node_modules', 'venv', 'env', '__pycache__', '.vscode', '.idea', 'dist', 'build', '.gemini'}
    
    print(f"Starting cleanup in: {root_dir}")
    print("This will remove comments from source files.")
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Modify dirnames in-place to skip excluded directories
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        
        for filename in filenames:
            # Skip the script itself
            if filename == 'remove_comments.py':
                continue
                
            file_path = os.path.join(dirpath, filename)
            clean_file(file_path)

    print("Cleanup complete.")

if __name__ == "__main__":
    main()
