import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Print the line numbers near "achievements.humble.desc" for each language
for i, line in enumerate(lines):
    if 'achievements.humble.desc' in line or 'achievements.unlocked' in line:
        print(f'{i}: {line.rstrip()}')
