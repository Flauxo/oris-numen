import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    text = f.read()

def inject(lang, block):
    pattern = rf'("{lang}":\s*{{[^}}]*?)(\n\s*"history\.empty")'
    return re.sub(pattern, r'\1' + block + r'\2', text, flags=re.DOTALL)

en = '''
        "menu.evolution": "Spiritual Evolution",
        "evolution.title": "Spiritual Evolution",
        "evolution.explanation": "Every time you channel a message, your core develops a new geometric level, becoming more majestic and illuminated.",
        "evolution.count": "Number of channelings: {count}",'''

es = '''
        "menu.evolution": "Evolución espiritual",
        "evolution.title": "Evolución Espiritual",
        "evolution.explanation": "Cada vez que canalizas un mensaje, tu núcleo desarrolla un nuevo nivel geométrico, volviéndose más majestuoso e iluminado.",
        "evolution.count": "Número de canalizaciones: {count}",'''

it = '''
        "menu.evolution": "Evoluzione Spirituale",
        "evolution.title": "Evoluzione Spirituale",
        "evolution.explanation": "Ogni volta che canalizzi un messaggio, il tuo nucleo sviluppa un nuovo livello geometrico, diventando più maestoso e illuminato.",
        "evolution.count": "Numero di canalizzazioni: {count}",'''

la = '''
        "menu.evolution": "Evolutio Spiritualis",
        "evolution.title": "Evolutio Spiritualis",
        "evolution.explanation": "Quotiens nuntium transmittis, nucleus tuus novum gradum geometricum explicat, magis maiestuosus et illuminatus fieri.",
        "evolution.count": "Numerus transmissionum: {count}",'''

text = inject('en', en)
text = inject('es', es)
text = inject('it', it)
text = inject('la', la)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Translations added.")
