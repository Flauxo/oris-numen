import codecs
import re

with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace the random seconds logic
old_random_logic = '''        const randomSeconds = Math.floor(Math.random() * (37 - 5 + 1)) + 5;
        
        this.universeTimeoutId = setTimeout(() => {
            clearInterval(this.universeIntervalId);
            searchingContainer.style.opacity = '0';
            
            setTimeout(() => {
                searchingContainer.style.display = 'none';
                this.showUniverseMessage();
            }, 1000);
        }, randomSeconds * 1000);'''

new_random_logic = '''        const randomSeconds = Math.floor(Math.random() * (27 - 5 + 1)) + 5;
        
        this.universeTimeoutId = setTimeout(() => {
            clearInterval(this.universeIntervalId);
            
            if (randomSeconds === 27) {
                // Not found scenario
                let notFoundMsg = (typeof Translations !== 'undefined' && Translations[this.currentLang] && Translations[this.currentLang]['universe.no_messages']) || "No hemos encontrado mensajes disponibles";
                searchingText.textContent = notFoundMsg;
                if (spinner) spinner.style.display = 'none';
                const spinnerWrapper = document.getElementById('universe-spinner-wrapper');
                if (spinnerWrapper) spinnerWrapper.style.display = 'none';
                if (counterText) counterText.style.display = 'none';
                
                setTimeout(() => {
                    const modalUniverse = document.getElementById('modal-universe');
                    if (modalUniverse) modalUniverse.classList.remove('active');
                }, 3000);
            } else {
                searchingContainer.style.opacity = '0';
                setTimeout(() => {
                    searchingContainer.style.display = 'none';
                    this.showUniverseMessage();
                }, 1000);
            }
        }, randomSeconds * 1000);'''

js_content = js_content.replace(old_random_logic, new_random_logic)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Patched app_v2.js")
