import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix NÚMERO
content = content.replace('N\xc3\u0161MERO', 'NÚMERO')

# Fix achievements in Spanish by regexing their keys
fixes = {
    r'"achievements\.desc":\s*".*?"': '"achievements.desc": "Sigue el camino del devoto y desbloquea los secretos de la canalización sonora. Cada logro es un paso hacia la numenosidad total."',
    r'"achievements\.unlocked_title":\s*".*?"': '"achievements.unlocked_title": "¡NUEVO LOGRO!"',
    r'"achievements\.init\.desc":\s*".*?"': '"achievements.init.desc": "Por realizar tu primera canalización."',
    r'"achievements\.early\.desc":\s*".*?"': '"achievements.early.desc": "Por canalizar entre las 5:00 y las 6:00 AM."',
    r'"achievements\.night\.title":\s*".*?"': '"achievements.night.title": "El Noctámbulo"',
    r'"achievements\.night\.desc":\s*".*?"': '"achievements.night.desc": "Por canalizar a medianoche (entre las 0:00 y la 1:00 AM)."',
    r'"achievements\.moon\.title":\s*".*?"': '"achievements.moon.title": "El Magnético"',
    r'"achievements\.moon\.desc":\s*".*?"': '"achievements.moon.desc": "Por canalizar durante la luna nueva."',
    r'"achievements\.compassive\.desc":\s*".*?"': '"achievements.compassive.desc": "Por canalizar 10 veces en la frecuencia Revelatio."',
    r'"achievements\.grateful\.desc":\s*".*?"': '"achievements.grateful.desc": "Por canalizar 10 veces en la frecuencia Gratia."',
    r'"achievements\.sincere\.desc":\s*".*?"': '"achievements.sincere.desc": "Por canalizar 10 veces en la frecuencia Absolutio."',
    r'"achievements\.humble\.desc":\s*".*?"': '"achievements.humble.desc": "Por canalizar 10 veces en la frecuencia Humilis."'
}

# The challenge is that these keys exist for other languages too!
# So we only want to replace them in the 'es' section.
# Let's split by 'es: {' and 'it: {' (or whatever comes after)
import re
es_start = content.find('es: {')
if es_start != -1:
    es_end = content.find('it: {', es_start)
    if es_end == -1:
        es_end = len(content)
        
    es_section = content[es_start:es_end]
    
    for pattern, replacement in fixes.items():
        es_section = re.sub(pattern, replacement, es_section)
        
    content = content[:es_start] + es_section + content[es_end:]

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Spanish translations!")
