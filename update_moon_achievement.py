import re

# Update JS app_v2.js
with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

moon_icon_pattern = r'\{ id: "moon", icon: \'<svg[^>]+><circle cx="12" cy="12" r="10"/></svg>\', color: "#A2A2A2" \}'
new_icon = '{ id: "moon", icon: \'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>\', color: "#A2A2A2" }'

app_content = re.sub(moon_icon_pattern, new_icon, app_content)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(app_content)

# Update translations.js
with open('js/translations.js', 'r', encoding='utf-8') as f:
    trans_content = f.read()

fixes = {
    # ES
    r'"achievements\.moon\.title": "El Magnético"': '"achievements.moon.title": "El Dador"',
    r'"achievements\.moon\.desc": "Por canalizar durante la luna nueva\."': '"achievements.moon.desc": "Sello conseguido tras compartir nuestra app Oris Numen."',
    
    # EN
    r'"achievements\.moon\.title": "The Magnetic"': '"achievements.moon.title": "The Giver"',
    r'"achievements\.moon\.desc": "For channeling during a new moon\."': '"achievements.moon.desc": "Seal obtained after sharing our app Oris Numen."',
}

for pattern, replacement in fixes.items():
    trans_content = re.sub(pattern, replacement, trans_content)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(trans_content)

print("Updated moon achievement in JS and translations")
