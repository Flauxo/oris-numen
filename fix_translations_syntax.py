import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The pattern looks for `{` followed by newline and `,` and removes the comma
# e.g. `{ \n,\n` -> `{ \n`
content = re.sub(r'\{\s*,\s*', '{\n', content)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations fixed.")
