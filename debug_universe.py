import re

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Find the universe messages lang probability
idx = code.find('UniverseMessages')
print(code[max(0, idx-100):idx+400])
