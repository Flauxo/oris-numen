import codecs
import re

# 1. Update HTML files
push_ui_regex = re.compile(r'\s*<!-- Simulated Push Notification -->.*?</div>\s*</div>', re.DOTALL)
for file_path in ['index.html', 'index_v2.html']:
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = push_ui_regex.sub('\n', content)
    
    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched HTML: {file_path}")


# 2. Update app_v2.js
with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Remove the showSimulatedPushNotification function
func_regex = re.compile(r'\s*showSimulatedPushNotification\(\)\s*\{.*?\},\s*startUniverseSearch\(\)\s*\{', re.DOTALL)
js_content = func_regex.sub('\n    startUniverseSearch() {', js_content)

# Update the logic inside startUniverseSearch
old_timeout = '''        setTimeout(() => {
            if (Math.random() < 0.15) {
                this.showSimulatedPushNotification();
            }
        }, 20000);'''
        
new_logic = '''        if (Math.random() < 0.15) {
            const countries = ["Japón", "Corea del Sur", "Australia", "Italia", "Canadá", "Francia", "Reino Unido", "Alemania", "España", "México", "Colombia", "Brasil", "Argentina", "Chile", "Uruguay", "Perú", "Bolivia", "Ecuador", "Estados Unidos", "Nueva Zelanda"];
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            let msg = (typeof Translations !== 'undefined' && Translations[this.currentLang] && Translations[this.currentLang]['universe.push_notification']) || "Alguien en {country} ha encontrado consuelo en tu mensaje";
            msg = msg.replace("{country}", randomCountry);
            
            if (window.AndroidInterface && typeof AndroidInterface.scheduleGratitudeNotification === 'function') {
                AndroidInterface.scheduleGratitudeNotification(msg);
            }
        }'''

js_content = js_content.replace(old_timeout, new_logic)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Patched app_v2.js")
