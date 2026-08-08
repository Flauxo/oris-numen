import re

# Fix back arrow in HTML
with open('index_v2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace any literal left arrow (←) or mangled chars if possible, but let's just replace ← with &larr;
html = html.replace('←', '&larr;')
# Sometimes it might be another character like ⬅ or 🔙. Let's just replace ← for now.
# Or if it got mangled to something like 'â†' due to encoding.
html = html.replace('â†', '&larr;')

with open('index_v2.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Fix timeout in JS
with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# The original code has: setTimeout(() => { ... }, 4000); for the toast removal.
# I need to change 4000 to 2500.
js = js.replace('}, 4000);', '}, 2500);')

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed back arrow and reduced timeout")
