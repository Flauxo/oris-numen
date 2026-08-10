import codecs

gratitude_ui = '''
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 15px; margin-top: 5px;">
                        <button id="btn-send-gratitude" style="background: transparent; border: 1px solid var(--color-text-primary); color: var(--color-text-primary); padding: 8px 16px; border-radius: 4px; font-family: var(--font-sans); cursor: pointer; transition: all 0.3s; margin-bottom: 5px;" data-i18n="universe.send_gratitude">Enviar Gratitud</button>
                        <p id="text-gratitude-sent" style="display: none; font-family: var(--font-sans); font-size: 0.9rem; color: var(--color-text-muted); margin: 0; margin-bottom: 5px;" data-i18n="universe.gratitude_sent">Gratitud enviada</p>
                    </div>
'''

push_ui = '''
        <!-- Simulated Push Notification -->
        <div id="simulated-push-notification" style="position: fixed; top: -100px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: var(--color-bg-elevated, #2a2a2a); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); padding: 15px; display: flex; align-items: center; z-index: 10000; transition: top 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0; pointer-events: none;">
            <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--color-text-primary); display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style="flex: 1;">
                <p style="margin: 0; font-family: var(--font-serif); font-weight: bold; color: var(--color-text-primary); font-size: 0.95rem;">Oris Numen</p>
                <p id="push-notification-text" style="margin: 5px 0 0 0; font-family: var(--font-sans); color: var(--color-text-secondary); font-size: 0.85rem; line-height: 1.3;"></p>
            </div>
        </div>
'''

for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Insert Gratitude UI before btn-universe-close
    content = content.replace('<button id="btn-universe-close"', gratitude_ui + '                    <button id="btn-universe-close"')
    
    # Insert Push UI just before </body>
    if '<!-- Scripts -->' in content:
        content = content.replace('<!-- Scripts -->', push_ui + '\n    <!-- Scripts -->')
    else:
        content = content.replace('</body>', push_ui + '\n</body>')
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {file_path}")
