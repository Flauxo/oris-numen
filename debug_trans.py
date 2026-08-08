import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    code = f.read()

matches = re.findall(r'.{0,20}achievements\.unlocked.{0,60}', code)
for m in matches:
    print(repr(m))
