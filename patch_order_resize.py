import codecs
import re

# 1. Update HTML
old_html = r'''                    <div style="display: flex; flex-direction: column; align-items: stretch; width: 100%; gap: 12px; margin-top: 12px;">
                        <button id="btn-universe-close" class="btn-home" data-i18n="universe.close">Cerrar</button>
                        <div style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <button id="btn-send-gratitude" class="btn-cancel" data-i18n="universe.send_gratitude" style="font-family: var\(--font-sans\); font-weight: 600; padding: 12px 32px; width: 100%; transition: opacity 0\.2s ease;">Enviar Gratitud</button>
                            <p id="text-gratitude-sent" style="display: none; opacity: 0; transition: opacity 0\.5s ease; font-family: var\(--font-sans\); font-size: 1\.1rem; color: var\(--color-text-primary\); margin: 0; margin-top: 8px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>
                        </div>
                    </div>'''

new_html = '''                    <div style="display: flex; flex-direction: column; align-items: stretch; width: 100%; gap: 12px; margin-top: 12px;">
                        <div style="position: relative; width: 100%; display: flex; align-items: center; justify-content: center;">
                            <button id="btn-send-gratitude" class="btn-cancel" data-i18n="universe.send_gratitude" style="font-family: var(--font-sans); font-weight: 600; padding: 12px 32px; width: 100%; transition: opacity 0.5s ease;">Enviar Gratitud</button>
                            <p id="text-gratitude-sent" style="position: absolute; display: none; opacity: 0; transition: opacity 0.5s ease; font-family: var(--font-sans); font-size: 1.1rem; color: var(--color-text-primary); margin: 0; pointer-events: none;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>
                        </div>
                        <button id="btn-universe-close" class="btn-home" data-i18n="universe.close">Cerrar</button>
                    </div>'''

for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(old_html, new_html, content)
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update JS
with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Update click listener
old_js_listener = '''            btnSendGratitude.addEventListener('click', () => {
                btnSendGratitude.style.display = 'none';
                textGratitudeSent.style.display = 'block';
                // Trigger reflow
                void textGratitudeSent.offsetWidth;
                textGratitudeSent.style.opacity = '1';
                
                // Fade out after 2 seconds
                setTimeout(() => {
                    textGratitudeSent.style.opacity = '0';
                    // Hide completely after transition (0.5s)
                    setTimeout(() => {
                        textGratitudeSent.style.display = 'none';
                    }, 500);
                }, 2000);
            });'''

new_js_listener = '''            btnSendGratitude.addEventListener('click', () => {
                btnSendGratitude.style.opacity = '0';
                btnSendGratitude.style.pointerEvents = 'none';
                textGratitudeSent.style.display = 'block';
                // Trigger reflow
                void textGratitudeSent.offsetWidth;
                textGratitudeSent.style.opacity = '1';
                
                // Fade out after 2 seconds
                setTimeout(() => {
                    textGratitudeSent.style.opacity = '0';
                    // Hide completely after transition (0.5s)
                    setTimeout(() => {
                        textGratitudeSent.style.display = 'none';
                    }, 500);
                }, 2000);
            });'''

js_content = js_content.replace(old_js_listener, new_js_listener)

# Update reset logic in showUniverseMessage
old_js_reset = '''        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude) btnSendGratitude.style.display = 'block';
        if (textGratitudeSent) {
            textGratitudeSent.style.opacity = '0';
            textGratitudeSent.style.display = 'none';
        }'''

new_js_reset = '''        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude) {
            btnSendGratitude.style.opacity = '1';
            btnSendGratitude.style.pointerEvents = 'auto';
        }
        if (textGratitudeSent) {
            textGratitudeSent.style.opacity = '0';
            textGratitudeSent.style.display = 'none';
        }'''

js_content = js_content.replace(old_js_reset, new_js_reset)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
