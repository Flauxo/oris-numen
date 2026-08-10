import codecs
import re

old_btn = r'<button id="btn-send-gratitude" style="background: transparent; border: 1px solid var\(--color-text-primary\); color: var\(--color-text-primary\); padding: 8px 16px; border-radius: 4px; font-family: var\(--font-sans\); cursor: pointer; transition: all 0\.3s; margin-bottom: 5px;" data-i18n="universe\.send_gratitude">Enviar Gratitud</button>'
new_btn = '<button id="btn-send-gratitude" class="btn-cancel" data-i18n="universe.send_gratitude" style="font-family: var(--font-sans); font-weight: 600; padding: 12px 32px; width: 100%; transition: opacity 0.2s ease; margin-bottom: 15px;">Enviar Gratitud</button>'

for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(old_btn, new_btn, content)
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {file_path}")
