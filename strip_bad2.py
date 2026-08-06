import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip the bad recordSigilVideo
match = re.search(r',\s*recordSigilVideo\(', content)
if match:
    content = content[:match.start()] + "\\n};\\n\\n// Initialize when DOM is ready\\ndocument.addEventListener('DOMContentLoaded', () => OrisApp.init());\\n"
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Stripped!")
else:
    print("Not found")
