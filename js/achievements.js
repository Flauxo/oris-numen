/**
 * Oris Numen - Achievements System
 */

const ACHIEVEMENTS_DATA = [
    {
        id: "init",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, 
        color: "#D4B85A"
    },
    {
        id: "early",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        color: "#D4B85A"
    },
    {
        id: "night",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
        color: "#7B5EA7"
    },
    {
        id: "fifty",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        color: "#D4845A"
    },
    {
        id: "moon",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        color: "#5A8BB5"
    },
    {
        id: "alchemist",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><line x1="5.52" y1="16h12.96"/></svg>`,
        color: "#997A9E"
    },
    {
        id: "compassive",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        color: "#5A8BB5"
    },
    {
        id: "grateful",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        color: "#D4B85A"
    },
    {
        id: "sincere",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg>`,
        color: "#D4845A"
    },
    {
        id: "humble",
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        color: "#7B5EA7"
    }
];

class AchievementSystem {
    constructor() {
        this.unlocked = this.loadAchievements();
        this.initialized = false;
    }

    loadAchievements() {
        const saved = localStorage.getItem('oris_achievements');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing achievements:", e);
                return [];
            }
        }
        return [];
    }

    saveAchievements() {
        localStorage.setItem('oris_achievements', JSON.stringify(this.unlocked));
    }

    getHistory() {
        const historyData = localStorage.getItem('oris_history');
        if (historyData) {
            try {
                return JSON.parse(historyData);
            } catch (e) {
                console.error("Error parsing history in achievements:", e);
                return [];
            }
        }
        return [];
    }

    check(channelingData, history) {
        let newlyUnlocked = [];
        
        const unlock = (id) => {
            if (!this.unlocked.includes(id)) {
                this.unlocked.push(id);
                newlyUnlocked.push(id);
            }
        };

        // 1. El Iniciado (First channeling)
        if (history.length >= 1) unlock('init');

        // 2. El Madrugador (Between 5:00 and 6:00 AM)
        const date = new Date();
        const hour = date.getHours();
        if (hour === 5) unlock('early');

        // 3. El Noctámbulo (Between 00:00 and 1:00 AM)
        if (hour === 0) unlock('night');

        // 4. El Perseverante (50 channelings)
        if (history.length >= 50) unlock('fifty');

        // 5. El Magnético (New moon - Approximation based on date)
        const day = date.getDate();
        if (day === 1 || day === 15) unlock('moon');

        // 6. El Alquimista (4 elements used)
        if (channelingData && channelingData.elements && channelingData.elements.length >= 4) {
            unlock('alchemist');
        }

        // Count frequencies
        let counts = { humilis: 0, revelatio: 0, absolutio: 0, gratia: 0 };
        history.forEach(item => {
            if (counts[item.type] !== undefined) counts[item.type]++;
        });

        // 7. El Compasivo (10 in Absolutio)
        if (counts.absolutio >= 10) unlock('compassive');
        
        // 8. El Agradecido (10 in Gratia)
        if (counts.gratia >= 10) unlock('grateful');

        // 9. El Sincero (10 in Revelatio)
        if (counts.revelatio >= 10) unlock('sincere');

        // 10. El Humilde (10 in Humilis)
        if (counts.humilis >= 10) unlock('humble');

        if (newlyUnlocked.length > 0) {
            this.saveAchievements();
            this.renderAchievementsGrid(); // Update the UI
            this.showNotification(newlyUnlocked[0]); // Show notification for the first one
        }

        return newlyUnlocked;
    }

    renderAchievementsGrid() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = ''; // Clear

        ACHIEVEMENTS_DATA.forEach(ach => {
            const isUnlocked = this.unlocked.includes(ach.id);
            const titleStr = \`achievements.\${ach.id}.title\`;
            const descStr = \`achievements.\${ach.id}.desc\`;

            const card = document.createElement('div');
            card.className = \`achievement-card \${isUnlocked ? 'unlocked' : 'locked'}\`;
            
            const iconColor = isUnlocked ? ach.color : '#888888';

            card.innerHTML = \`
                <div class="achievement-icon" style="color: \${iconColor};">
                    \${ach.icon}
                </div>
                <div class="achievement-info">
                    <h4 class="achievement-title" data-i18n="\${titleStr}">\${titleStr}</h4>
                    <p class="achievement-desc" data-i18n="\${descStr}">\${descStr}</p>
                </div>
            \`;
            grid.appendChild(card);
        });

        if (typeof window.translateApp === 'function') {
            window.translateApp();
        }
    }

    showNotification(achievementId) {
        const notif = document.getElementById('achievement-unlocked-notification');
        const nameEl = document.getElementById('achievement-notif-name');
        if (!notif || !nameEl) return;

        const lang = localStorage.getItem('oris_lang') || 'es';
        let name = \`achievements.\${achievementId}.title\`;
        
        if (window.translations && window.translations[lang] && window.translations[lang]['achievements'] && window.translations[lang]['achievements'][achievementId]) {
            name = window.translations[lang]['achievements'][achievementId].title;
        } else {
             nameEl.setAttribute('data-i18n', \`achievements.\${achievementId}.title\`);
        }

        nameEl.textContent = name;
        
        notif.style.display = 'flex';
        
        // Auto hide after 6 seconds
        setTimeout(() => {
            notif.style.display = 'none';
        }, 6000);
    }
}

// Global instance
window.achievementSystem = new AchievementSystem();

document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem.renderAchievementsGrid();
    
    // Bind overlay buttons
    const btnOpen = document.getElementById('menu-item-achievements');
    const btnClose = document.getElementById('btn-close-achievements');
    const overlay = document.getElementById('achievements-overlay');
    const backdrop = document.getElementById('achievements-backdrop');

    if (btnOpen && overlay) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Re-render to ensure state is fresh
            window.achievementSystem.renderAchievementsGrid();

            // Close sidebar
            const sidebar = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('active');

            overlay.classList.add('active');
        });
    }

    if (btnClose && overlay) {
        btnClose.addEventListener('click', () => overlay.classList.remove('active'));
    }
    
    if (backdrop && overlay) {
        backdrop.addEventListener('click', () => overlay.classList.remove('active'));
    }
});
