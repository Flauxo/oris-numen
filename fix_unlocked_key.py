import re

# Fix translations.js - add the correct key "achievements.unlocked" to all languages
with open('js/translations.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

result = []
for line in lines:
    result.append(line)
    # After the unlocked_title line for each language, add the "achievements.unlocked" key
    if '"achievements.unlocked_title": "¡NUEVO LOGRO!"' in line:
        result.append('        "achievements.unlocked": "Logro Desbloqueado",\n')
    elif '"achievements.unlocked_title": "NEW ACHIEVEMENT!"' in line:
        result.append('        "achievements.unlocked": "Achievement Unlocked",\n')
    elif 'NUOVO TRAGUARDO' in line or 'achievements.unlocked_title": "NUOVO' in line:
        result.append('        "achievements.unlocked": "Obiettivo Sbloccato",\n')
    elif 'FACTUM RESERATUM' in line or 'achievements.unlocked_title": "FACTUM' in line:
        result.append('        "achievements.unlocked": "Reserata Factum",\n')

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.writelines(result)

# Also fix the JS code to look for the right key
with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make sure the notification uses the right key
js = js.replace("Translations[OrisApp.currentLang]['achievements.unlocked']", 
                 "Translations[OrisApp.currentLang]['achievements.unlocked']")

# Also check the key being used in showUnlockNotification
print("Key used in toast:", "'achievements.unlocked'" in js)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Done - added 'achievements.unlocked' keys to translations")

# Verify
with open('js/translations.js', 'r', encoding='utf-8') as f:
    code = f.read()
import re
matches = re.findall(r'.{0,20}achievements\.unlocked[^_].{0,40}', code)
for m in matches:
    print(m)
