code = open('android/app/src/main/assets/js/translations.js', 'r', encoding='utf-8').read()
print('achievements.unlocked present:', 'achievements.unlocked' in code)
import re
matches = re.findall(r'.{0,20}achievements\.unlocked.{0,40}', code)
for m in matches:
    print(m)
