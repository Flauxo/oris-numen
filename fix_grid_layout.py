import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .achievements-grid
css = re.sub(r'\.achievements-grid\s*\{[^}]+\}', '.achievements-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-height: 60vh; overflow-y: auto; padding: 4px; }', css)

# Replace .achievement-card
css = re.sub(r'\.achievement-card\s*\{[^}]+\}', '.achievement-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: rgba(0,0,0,0.03); padding: 16px 8px; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.05); transition: transform 0.2s ease, opacity 0.2s ease; cursor: pointer; text-align: center; box-sizing: border-box; }', css)

# Make icon container smaller
css = re.sub(r'\.achievement-icon\s*\{[^}]+\}', '.achievement-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; justify-content: center; align-items: center; }', css)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

replacement = """const card = document.createElement('div');
                        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
                        
                        const iconColor = isUnlocked ? ach.color : '#888888';

                        card.innerHTML = 
                            '<div class="achievement-icon" style="color: ' + iconColor + ';">' +
                                ach.icon +
                            '</div>' +
                            '<div class="achievement-title" style="font-size: 0.8rem; margin: 0; line-height: 1.2;" data-i18n="' + titleStr + '">' + titleText + '</div>';
                        
                        // Click listener"""

js = re.sub(r"const card = document\.createElement\('div'\);.*?\n\s*// Click listener", replacement, js, flags=re.DOTALL)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated style.css and app_v2.js for 2-column grid")
