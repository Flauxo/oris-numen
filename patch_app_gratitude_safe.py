import codecs

with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add showSimulatedPushNotification method to App object
push_func = '''
    showSimulatedPushNotification() {
        const pushUI = document.getElementById('simulated-push-notification');
        const pushText = document.getElementById('push-notification-text');
        if (!pushUI || !pushText) return;
        
        // Random country
        const countries = ["Japón", "Corea del Sur", "Australia", "Italia", "Canadá", "Francia", "Reino Unido", "Alemania", "España", "México", "Colombia", "Brasil", "Argentina", "Chile", "Uruguay", "Perú", "Bolivia", "Ecuador", "Estados Unidos", "Nueva Zelanda"];
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        
        let msg = (typeof Translations !== 'undefined' && Translations[this.currentLang] && Translations[this.currentLang]['universe.push_notification']) || "Alguien en {country} ha encontrado consuelo en tu mensaje";
        msg = msg.replace("{country}", randomCountry);
        
        pushText.textContent = msg;
        
        // Show push
        pushUI.style.top = '20px';
        pushUI.style.opacity = '1';
        
        // Hide push after 5 seconds
        setTimeout(() => {
            pushUI.style.top = '-100px';
            pushUI.style.opacity = '0';
        }, 5000);
    },
    
    startUniverseSearch() {'''

content = content.replace('    startUniverseSearch() {', push_func, 1)


# 2. In initUniverseFeature, add event listener for gratitude
gratitude_listener = '''
        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude && textGratitudeSent) {
            btnSendGratitude.addEventListener('click', () => {
                btnSendGratitude.style.display = 'none';
                textGratitudeSent.style.display = 'block';
            });
        }
'''

content = content.replace('        if (btnAcceptUniverse) {', gratitude_listener + '\n        if (btnAcceptUniverse) {')


# 3. In showUniverseMessage, reset gratitude button state
reset_gratitude = '''
        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude) btnSendGratitude.style.display = 'block';
        if (textGratitudeSent) textGratitudeSent.style.display = 'none';
        
        if (!this.seenUniverseMessages) this.seenUniverseMessages = [];
'''
content = content.replace('        if (!this.seenUniverseMessages) this.seenUniverseMessages = [];', reset_gratitude)


# 4. In startUniverseSearch, add the 20-second push timeout (15% chance)
push_timeout = '''
        setTimeout(() => {
            if (Math.random() < 0.15) {
                this.showSimulatedPushNotification();
            }
        }, 20000);
        
        searchingContainer.style.display = 'flex';
'''
content = content.replace("        searchingContainer.style.display = 'flex';", push_timeout)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched app_v2.js")
