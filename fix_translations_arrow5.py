import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '"btn.back"' in line:
        # replace everything after the colon with just the text
        if 'Back' in line:
            lines[i] = '        "btn.back": "&larr; Back",\n'
        elif 'Volver' in line:
            lines[i] = '        "btn.back": "&larr; Volver",\n'
        elif 'Indietro' in line:
            lines[i] = '        "btn.back": "&larr; Indietro",\n'
        elif 'Regressus' in line:
            lines[i] = '        "btn.back": "&larr; Regressus",\n'
        else:
            # For the chinese one or fallback
            lines[i] = '        "btn.back": "&larr; \\u8fd4\\u56de",\n'

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed translations with simple lines")
