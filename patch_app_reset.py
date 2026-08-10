import codecs

with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

old_reset = '''        searchingText.style.display = 'block';
        searchingText.style.opacity = '1';'''

new_reset = '''        searchingText.style.display = 'block';
        searchingText.style.opacity = '1';
        let searchingMsg = (typeof Translations !== 'undefined' && Translations[this.currentLang] && Translations[this.currentLang]['universe.searching']) || "Buscando canalización...";
        searchingText.textContent = searchingMsg;'''

js_content = js_content.replace(old_reset, new_reset)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Patched app_v2.js for reset")
