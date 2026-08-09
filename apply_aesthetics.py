import re

# 1. Update translations.js
with open('js/translations.js', 'r', encoding='utf-8') as f:
    t = f.read()

# Replace Spanish desc
t = re.sub(r'"achievements\.desc": "Sigue el camino del devoto.*?"', '"achievements.desc": "Cada arquetipo que despiertas, te acerca más a tu esencia divina."', t)

# Replace English desc (approximate)
t = re.sub(r'"achievements\.desc": "Follow the path of the devotee.*?"', '"achievements.desc": "Each archetype you awaken brings you closer to your divine essence."', t)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(t)

# 2. Update style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Unhide description and style it
desc_css = """.achievements-desc {
    text-align: center;
    color: rgba(0,0,0,0.5);
    font-size: 0.85rem;
    margin: 16px auto 24px auto;
    font-family: var(--font-sans);
    line-height: 1.4;
    max-width: 80%;
    position: relative;
}
.achievements-desc::before {
    content: '';
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 1px;
    background: rgba(0,0,0,0.1);
}"""
css = re.sub(r'\.achievements-desc\s*\{[^}]+\}', desc_css, css)

# Style cards
card_css = """.achievement-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    background: transparent;
    padding: 16px 8px 12px 8px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    transition: transform 0.2s ease, opacity 0.2s ease;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    position: relative;
}
.achievement-title {
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: rgba(0,0,0,0.7);
    font-weight: 500;
    margin: 0;
}
.achievement-divider {
    width: 30px;
    height: 1px;
    background: rgba(0,0,0,0.1);
    margin-top: 2px;
}
.achievement-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    position: relative;
}
.achievement-icon svg {
    width: 100%;
    height: 100%;
    filter: url(#handdrawn);
}"""
css = re.sub(r'\.achievement-card\s*\{[^}]+\}', card_css, css)
css = re.sub(r'\.achievement-icon\s*\{[^}]+\}', '', css)
css = re.sub(r'\.achievement-title\s*\{[^}]+\}', '', css)
# Append because we removed them
css += "\n" + card_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 3. Update app_v2.js
with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add SVG filter and modify innerHTML of card
# First, add the SVG filter to the modal container if it doesn't exist, or just inject it dynamically
card_html = """'<div class="achievement-icon" style="color: ' + iconColor + ';">' +
                                ach.icon +
                                '<!-- Sparkles -->' +
                                '<svg style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none;" viewBox="0 0 48 48">' +
                                    '<path d="M10,15 Q12,12 15,10 Q12,8 10,5 Q8,8 5,10 Q8,12 10,15" fill="' + iconColor + '" opacity="0.4" transform="scale(0.5) translate(5, 5)" />' +
                                    '<path d="M38,20 Q40,17 43,15 Q40,13 38,10 Q36,13 33,15 Q36,17 38,20" fill="' + iconColor + '" opacity="0.3" transform="scale(0.4) translate(40, 20)" />' +
                                    '<path d="M15,40 Q17,37 20,35 Q17,33 15,30 Q13,33 10,35 Q13,37 15,40" fill="' + iconColor + '" opacity="0.3" transform="scale(0.3) translate(20, 70)" />' +
                                '</svg>' +
                            '</div>' +
                            '<div class="achievement-title" data-i18n="' + titleStr + '">' + titleText + '</div>' +
                            '<div class="achievement-divider"></div>';"""

js = re.sub(r'\'<div class="achievement-icon".*?\'</div>\';', card_html, js, flags=re.DOTALL)

# Inject the SVG filter definition at the start of openAchievementsCard if not present
filter_svg = """
            if (!document.getElementById('handdrawn-filter')) {
                const svgFilter = document.createElement('div');
                svgFilter.innerHTML = '<svg width="0" height="0" id="handdrawn-filter" style="position:absolute;z-index:-1;"><filter id="handdrawn" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap><feBlend in="SourceGraphic" in2="displaced" mode="multiply"></feBlend></filter></svg>';
                document.body.appendChild(svgFilter);
            }
"""
if "handdrawn-filter" not in js:
    js = js.replace("openAchievementsCard() {", "openAchievementsCard() {" + filter_svg)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Applied hand-drawn aesthetic updates!")
