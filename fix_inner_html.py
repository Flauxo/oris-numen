import re

with open('index_v2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The back button currently has:
# <button id="btn-back" class="btn-back" data-i18n="btn.back">&larr; Volver</button>
# We need to change it to:
# <button id="btn-back" class="btn-back" data-i18n="btn.back" data-i18n-html>&larr; Volver</button>

html = html.replace('data-i18n="btn.back"', 'data-i18n="btn.back" data-i18n-html')

with open('index_v2.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index_v2.html with data-i18n-html")
