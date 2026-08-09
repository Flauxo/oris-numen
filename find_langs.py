with open('js/translations.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find all language blocks by looking for top-level keys
for i, line in enumerate(lines):
    if line.strip().startswith('"') and '":' in line and '{' in line and len(line.strip()) < 15:
        print(f'{i}: {line.rstrip()}')
    # Also find all humble.desc occurrences
    if 'humble.desc' in line or 'humble.title' in line:
        print(f'  humble at {i}: {line.rstrip()}')
