import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

# I will append "achievements.unlocked" to the achievements object of each language
js = re.sub(r'("es"\s*:\s*\{.*?)(?="achievements\.init\.title")', r'\1"achievements.unlocked": "Logro Desbloqueado",\n        ', js, flags=re.DOTALL)
js = re.sub(r'("en"\s*:\s*\{.*?)(?="achievements\.init\.title")', r'\1"achievements.unlocked": "Achievement Unlocked",\n        ', js, flags=re.DOTALL)
js = re.sub(r'("it"\s*:\s*\{.*?)(?="achievements\.init\.title")', r'\1"achievements.unlocked": "Obiettivo Sbloccato",\n        ', js, flags=re.DOTALL)
js = re.sub(r'("la"\s*:\s*\{.*?)(?="achievements\.init\.title")', r'\1"achievements.unlocked": "Reserata Factum",\n        ', js, flags=re.DOTALL)
js = re.sub(r'("zh"\s*:\s*\{.*?)(?="achievements\.init\.title")', r'\1"achievements.unlocked": "\\u89e3\\u9501\\u6210\\u5c31",\n        ', js, flags=re.DOTALL)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Added achievements.unlocked to all languages")
