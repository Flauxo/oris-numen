import re

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Only append if it doesn't already exist
if 'window.achievementSystem = {' not in js:
    achievement_code = """
window.achievementSystem = {
    check: function(historyItem, history) {
        if (!historyItem || !history) return;
        
        let date = new Date(historyItem.date);
        let hours = date.getHours();
        
        // init: El Iniciado (first channeling)
        if (history.length === 1) {
            this.unlock('init');
        }
        
        // early: El Madrugador (5 AM - 8 AM)
        if (hours >= 5 && hours < 8) {
            this.unlock('early');
        }
        
        // night: El Noctámbulo (11 PM - 3 AM)
        if (hours >= 23 || hours < 3) {
            this.unlock('night');
        }
        
        // fifty: El Perseverante (50 channelings)
        if (history.length === 50) {
            this.unlock('fifty');
        }
        
        // alchemist: El Alquimista (4 elements used)
        if (historyItem.elements && historyItem.elements.length === 4) {
            this.unlock('alchemist');
        }
        
        // check specific words in text for other achievements
        if (historyItem.text) {
            let t = historyItem.text.toLowerCase();
            if (t.includes('compasi') || t.includes('amor') || t.includes('ayuda')) this.unlock('compassive');
            if (t.includes('gracia') || t.includes('agradec')) this.unlock('grateful');
            if (t.includes('sincer') || t.includes('verdad')) this.unlock('sincere');
            if (t.includes('humil') || t.includes('pequeñ')) this.unlock('humble');
        }
    },
    
    unlock: function(id) {
        let unlockedStr = localStorage.getItem('oris_achievements');
        let unlockedArray = [];
        if (unlockedStr) {
            try {
                unlockedArray = JSON.parse(unlockedStr);
            } catch(e) {}
        }
        
        if (!unlockedArray.includes(id)) {
            unlockedArray.push(id);
            localStorage.setItem('oris_achievements', JSON.stringify(unlockedArray));
            this.showUnlockNotification(id);
        }
    },
    
    showUnlockNotification: function(id) {
        // Find title
        let titleKey = 'achievements.' + id + '.title';
        let title = titleKey;
        if (typeof Translations !== 'undefined' && Translations[OrisApp.currentLang] && Translations[OrisApp.currentLang][titleKey]) {
            title = Translations[OrisApp.currentLang][titleKey];
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        toast.style.background = 'rgba(212, 184, 90, 0.95)';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '30px';
        toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        toast.style.fontFamily = 'serif';
        toast.style.zIndex = '99999';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        toast.style.textAlign = 'center';
        
        const unlockedText = (typeof Translations !== 'undefined' && Translations[OrisApp.currentLang] && Translations[OrisApp.currentLang]['achievements.unlocked']) 
                             ? Translations[OrisApp.currentLang]['achievements.unlocked'] 
                             : 'Logro Desbloqueado';
                             
        toast.innerHTML = '<div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">' + unlockedText + '</div>' +
                          '<div style="font-size: 1.1rem; font-weight: bold; margin-top: 4px;">' + title + '</div>';
                          
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        }, 4000);
    }
};
"""
    # Find the end of the file or insert it before OrisApp initialization.
    # It's best to append it at the end of the file.
    js = js + "\n" + achievement_code

    with open('js/app_v2.js', 'w', encoding='utf-8') as f:
        f.write(js)
    
    print("Injected achievementSystem into app_v2.js")
else:
    print("achievementSystem already exists!")
