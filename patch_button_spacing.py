import codecs
import re

old_block = r'''                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 15px; margin-top: 5px;">
                        <button id="btn-send-gratitude" class="btn-cancel" data-i18n="universe.send_gratitude" style="font-family: var\(--font-sans\); font-weight: 600; padding: 12px 32px; width: 100%; transition: opacity 0\.2s ease; margin-bottom: 15px;">Enviar Gratitud</button>
                        <p id="text-gratitude-sent" style="display: none; font-family: var\(--font-sans\); font-size: 0\.9rem; color: var\(--color-text-muted\); margin: 0; margin-bottom: 5px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>
                    </div>
                    <button id="btn-universe-close" class="btn-home" style="width: 100%; margin-top: 10px;" data-i18n="universe.close">Cerrar</button>'''

new_block = '''                    <div style="display: flex; flex-direction: column; align-items: stretch; width: 100%; gap: 12px; margin-top: 12px;">
                        <button id="btn-universe-close" class="btn-home" data-i18n="universe.close">Cerrar</button>
                        <div style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <button id="btn-send-gratitude" class="btn-cancel" data-i18n="universe.send_gratitude" style="font-family: var(--font-sans); font-weight: 600; padding: 12px 32px; width: 100%; transition: opacity 0.2s ease;">Enviar Gratitud</button>
                            <p id="text-gratitude-sent" style="display: none; font-family: var(--font-sans); font-size: 0.9rem; color: var(--color-text-muted); margin: 0; margin-top: 8px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>
                        </div>
                    </div>'''

for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(old_block, new_block, content)
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {file_path}")
