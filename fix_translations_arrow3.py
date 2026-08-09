import re

with open('js/translations.js', 'r', encoding='utf-8', errors='replace') as f:
    js = f.read()

# Replace completely the value of btn.back for all languages
js = re.sub(r'"btn\.back": ".*?(Back)"', '"btn.back": "&larr; Back"', js)
js = re.sub(r'"btn\.back": ".*?(Volver)"', '"btn.back": "&larr; Volver"', js)
js = re.sub(r'"btn\.back": ".*?(Indietro)"', '"btn.back": "&larr; Indietro"', js)
js = re.sub(r'"btn\.back": ".*?(Regressus)"', '"btn.back": "&larr; Regressus"', js)
js = re.sub(r'"btn\.back": ".*?(u2190 \u8fd4\u56de)"', '"btn.back": "&larr; \\u8fd4\\u56de"', js)

# Also fix the fallback
js = re.sub(r'"btn\.back": "&larr;  .*?"', '"btn.back": "&larr; Volver"', js)
js = re.sub(r'"btn\.back": ".*?\u8fd4\u56de"', '"btn.back": "&larr; \\u8fd4\\u56de"', js)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed translations arrow completely")
