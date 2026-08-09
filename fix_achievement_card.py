import re

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the card creation logic.
# Look for: "const card = document.createElement('div');" up to "card.addEventListener('click'"
# and replace it with the correct classes and innerHTML.

replacement = """const card = document.createElement('div');
                        card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
                        
                        const iconColor = isUnlocked ? ach.color : '#888888';

                        card.innerHTML = 
                            '<div class="achievement-icon" style="color: ' + iconColor + ';">' +
                                ach.icon +
                            '</div>' +
                            '<div class="achievement-info">' +
                                '<h4 class="achievement-title" data-i18n="' + titleStr + '">' + titleText + '</h4>' +
                                '<p class="achievement-desc" data-i18n="' + descStr + '">' + descText + '</p>' +
                            '</div>';
                        
                        // Click listener"""

content = re.sub(r"const card = document\.createElement\('div'\);.*?\n\s*// Click listener", replacement, content, flags=re.DOTALL)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app_v2.js successfully")
