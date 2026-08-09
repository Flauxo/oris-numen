import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    code = f.read()

matches = re.findall(r'.{0,5}achievements\.unlocked_title.{0,60}', code)
for m in matches:
    print(repr(m))
