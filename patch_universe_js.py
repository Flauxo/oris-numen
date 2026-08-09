import os

js_code = """
    // --- Universe Feature ---
    initUniverseFeature() {
        const btnUniverseMessage = document.getElementById('btn-universe-message');
        const modalUniverse = document.getElementById('universe-modal-overlay');
        const btnCloseUniverseModal = document.getElementById('btn-close-universe-modal');
        const btnAcceptUniverse = document.getElementById('btn-accept-universe');
        const searchingContainer = document.getElementById('universe-searching-container');
        const receivedContainer = document.getElementById('universe-received-container');
        const searchingText = document.getElementById('universe-searching-text');
        const foundText = document.getElementById('universe-found-text');
        const btnUniverseClose = document.getElementById('btn-universe-close');
        
        if (btnUniverseMessage) {
            btnUniverseMessage.style.display = 'block'; // Make it visible when on success screen
            btnUniverseMessage.addEventListener('click', () => {
                modalUniverse.classList.add('show');
            });
        }
        
        if (btnCloseUniverseModal) {
            btnCloseUniverseModal.addEventListener('click', () => {
                modalUniverse.classList.remove('show');
            });
        }
        
        const backdrop = modalUniverse ? modalUniverse.querySelector('.overlay-backdrop') : null;
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                modalUniverse.classList.remove('show');
            });
        }
        
        if (btnAcceptUniverse) {
            btnAcceptUniverse.addEventListener('click', () => {
                if (!navigator.onLine) {
                    this.showWarning(this.getText('universe.no_internet') || "Se necesita conexión a internet.");
                    return;
                }
                modalUniverse.classList.remove('show');
                this.startUniverseSearch();
            });
        }
        
        if (btnUniverseClose) {
            btnUniverseClose.addEventListener('click', () => {
                receivedContainer.style.opacity = '0';
                setTimeout(() => {
                    receivedContainer.style.display = 'none';
                    // Go home after closing
                    this.goHome();
                }, 500);
            });
        }
    },
    
    startUniverseSearch() {
        const searchingContainer = document.getElementById('universe-searching-container');
        const searchingText = document.getElementById('universe-searching-text');
        const foundText = document.getElementById('universe-found-text');
        
        searchingContainer.style.display = 'flex';
        setTimeout(() => {
            searchingContainer.style.opacity = '1';
        }, 10);
        
        searchingText.style.display = 'block';
        searchingText.style.opacity = '1';
        foundText.style.display = 'none';
        foundText.style.opacity = '0';
        
        const randomSeconds = Math.floor(Math.random() * (37 - 5 + 1)) + 5;
        
        setTimeout(() => {
            searchingText.style.opacity = '0';
            setTimeout(() => {
                searchingText.style.display = 'none';
                foundText.style.display = 'block';
                setTimeout(() => {
                    foundText.style.opacity = '1';
                }, 50);
                
                setTimeout(() => {
                    this.showUniverseMessage();
                }, 2000);
            }, 500);
        }, randomSeconds * 1000);
    },
    
    showUniverseMessage() {
        const searchingContainer = document.getElementById('universe-searching-container');
        const receivedContainer = document.getElementById('universe-received-container');
        const msgCountry = document.getElementById('universe-msg-country');
        const msgDetails = document.getElementById('universe-msg-details');
        const msgText = document.getElementById('universe-msg-text');
        
        // Select message
        let targetLang = this.currentLang;
        if (Math.random() > 0.30) {
            // Pick a random language that is NOT the current one (if possible) or just any random
            const langs = [...new Set(universeMessages.map(m => m.lang))];
            const otherLangs = langs.filter(l => l !== targetLang);
            if (otherLangs.length > 0) {
                targetLang = otherLangs[Math.floor(Math.random() * otherLangs.length)];
            }
        }
        
        const matchingMessages = universeMessages.filter(m => m.lang === targetLang);
        const randomMsg = matchingMessages.length > 0 
            ? matchingMessages[Math.floor(Math.random() * matchingMessages.length)]
            : universeMessages[Math.floor(Math.random() * universeMessages.length)];
            
        // Populate
        msgCountry.textContent = randomMsg.country || 'Desconocido';
        msgText.textContent = randomMsg.text;
        
        // Details
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
        
        const freqName = this.currentFrequency ? this.currentFrequency.name : 'Humilis';
        const els = [];
        if (document.getElementById('check-aire') && document.getElementById('check-aire').checked) els.push(this.getText('elements.aire'));
        if (document.getElementById('check-tierra') && document.getElementById('check-tierra').checked) els.push(this.getText('elements.tierra'));
        if (document.getElementById('check-agua') && document.getElementById('check-agua').checked) els.push(this.getText('elements.agua'));
        if (document.getElementById('check-fuego') && document.getElementById('check-fuego').checked) els.push(this.getText('elements.fuego'));
        
        let elStr = els.length > 0 ? els.join(', ') : this.getText('history.none') || 'Ninguno';
        
        msgDetails.innerHTML = `Color: ${freqName} | ${elStr} | ${timeStr} ${dateStr}`;
        
        // Show
        searchingContainer.style.opacity = '0';
        setTimeout(() => {
            searchingContainer.style.display = 'none';
            receivedContainer.style.display = 'flex';
            setTimeout(() => {
                receivedContainer.style.opacity = '1';
            }, 50);
        }, 1000);
    }
"""

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before the last closing brace of OrisApp
idx = content.rfind('};')
if idx != -1:
    content = content[:idx] + ",\n" + js_code + "\n" + content[idx:]
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("app.js patched.")
else:
    print("Could not find end of OrisApp.")

