import re
import codecs

with open('js/translations.js', 'r', encoding='utf-8', errors='replace') as f:
    js = f.read()

# Replace completely the value of btn.back for all languages
js = re.sub(r'"btn\.back": ".*?(Back)"', r'"btn.back": "&larr; Back"', js)
js = re.sub(r'"btn\.back": ".*?(Volver)"', r'"btn.back": "&larr; Volver"', js)
js = re.sub(r'"btn\.back": ".*?(Indietro)"', r'"btn.back": "&larr; Indietro"', js)
js = re.sub(r'"btn\.back": ".*?(Regressus)"', r'"btn.back": "&larr; Regressus"', js)

# for chinese, just replace it using standard replace
js = re.sub(r'"btn\.back": ".*?u2190.*?"', r'"btn.back": "&larr; \u8fd4\u56de"', js)

# Fallback for anything else
def fix(m):
    return r'"btn.back": "&larr; ' + m.group(1).replace('\ufffd', '').replace('', '').replace('&larr; ', '').strip() + '"'

js = re.sub(r'"btn\.back": "(.*?)"', fix, js)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed translations arrow completely")
