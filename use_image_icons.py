import re

# Update app_v2.js
with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

def replace_icon(m):
    key = m.group(1)
    img_tag = f'<img src="img/achievements/{key}.png" class="achievement-icon-img" alt="{key}">'
    return f'{{ id: "{key}", icon: \'{img_tag}\', color: {m.group(2)} }}'

# Currently ACHIEVEMENTS_DATA has SVG code inside icon field
js = re.sub(r'\{\s*id:\s*"([^"]+)",\s*icon:\s*\'<svg.*?</svg>\',\s*color:\s*([^}]+)\}', replace_icon, js, flags=re.DOTALL)
js = re.sub(r'\{\s*id:\s*"([^"]+)",\s*icon:\s*"<svg.*?</svg>",\s*color:\s*([^}]+)\}', replace_icon, js, flags=re.DOTALL)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Update style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_css = """
.achievement-icon-img {
    width: 120%;
    height: 120%;
    object-fit: contain;
    mix-blend-mode: multiply;
    transition: filter 0.3s ease;
}

.locked .achievement-icon-img {
    filter: grayscale(100%) opacity(0.2) contrast(1.5);
}

.unlocked .achievement-icon-img {
    filter: none;
}
"""
css += new_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated js and css for image icons")
