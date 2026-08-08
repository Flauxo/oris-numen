import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Hide achievements-desc
css = re.sub(
    r'\.achievements-desc\s*\{[^}]+\}',
    '.achievements-desc { display: none !important; }',
    css
)

# Remove the handdrawn filter URL from icon if present
css = re.sub(r'filter:\s*url\(#handdrawn\);', '', css)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove sparkles
js = re.sub(r'\'<!-- Sparkles -->.*?\'</svg>\' \+', '', js, flags=re.DOTALL)

sigil_svg_base = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">'

icons = {
    "init": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><circle cx='12' cy='12' r='3'/><line x1='12' y1='1' x2='12' y2='23'/><line x1='1' y1='12' x2='23' y2='12'/></svg>",
    "early": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><polygon points='12 3 4 17 20 17 12 3'/><circle cx='12' cy='13' r='2'/></svg>",
    "night": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><polygon points='12 21 4 7 20 7 12 21'/><circle cx='12' cy='11' r='2'/></svg>",
    "fifty": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><polygon points='12 3 21 12 12 21 3 12 12 3'/><circle cx='12' cy='12' r='4'/></svg>",
    "moon": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><polygon points='12 3 4 17 20 17 12 3'/><polygon points='12 21 4 7 20 7 12 21'/></svg>",
    "alchemist": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><rect x='6' y='6' width='12' height='12'/><polygon points='12 4 5 18 19 18 12 4'/></svg>",
    "compassive": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><circle cx='12' cy='12' r='7'/><circle cx='12' cy='12' r='3'/><line x1='12' y1='1' x2='12' y2='23'/></svg>",
    "grateful": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><line x1='12' y1='1' x2='12' y2='23'/><line x1='1' y1='12' x2='23' y2='12'/><line x1='4.2' y1='4.2' x2='19.8' y2='19.8'/><line x1='19.8' y1='4.2' x2='4.2' y2='19.8'/></svg>",
    "sincere": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><path d='M3 12 Q12 2 21 12 Q12 22 3 12'/><circle cx='12' cy='12' r='3'/></svg>",
    "humble": f"{sigil_svg_base}<circle cx='12' cy='12' r='11'/><path d='M7 12 A 5 5 0 0 0 17 12'/><line x1='12' y1='12' x2='12' y2='23'/></svg>"
}

# Find the existing colors
for key, svg in icons.items():
    match = re.search(r'\{ id: "' + key + r'",.*?, color: "(#[0-9A-Fa-f]{6})" \}', js)
    color = match.group(1) if match else "#A2A2A2"
    js = re.sub(r'\{ id: "' + key + r'".*?\}', '{ id: "' + key + '", icon: \'' + svg + '\', color: "' + color + '" }', js, count=1)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated icons")
