import codecs
import re

old_text = r'<p id="text-gratitude-sent" style="display: none; font-family: var\(--font-sans\); font-size: 0\.9rem; color: var\(--color-text-muted\); margin: 0; margin-top: 8px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>'
new_text = '<p id="text-gratitude-sent" style="display: none; opacity: 0; transition: opacity 0.5s ease; font-family: var(--font-sans); font-size: 1.1rem; color: var(--color-text-primary); margin: 0; margin-top: 8px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>'

for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(old_text, new_text, content)
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {file_path}")
