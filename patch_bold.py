import re
import shutil

# 1. Update translations.js (only for Spanish, since the request is specifically about Spanish words)
with open('js/translations.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace in Spanish block
# Find the Spanish block
es_block_match = re.search(r'(es:\s*\{)(.*?)(\n\s*\})', text, re.DOTALL)
if es_block_match:
    es_block = es_block_match.group(2)
    
    es_block = re.sub(
        r'"how_it_works\.p1":.*',
        r'"how_it_works.p1": "La <strong>ciencia</strong> y la <strong>espiritualidad</strong> encuentran un punto de <strong>unión</strong> en el <strong>sonido</strong>. <strong>Oris Numen</strong> utiliza principios de <strong>resonancia acústica</strong> y <strong>Brainwave Entrainment</strong> para potenciar la intención de tu mensaje.",',
        es_block
    )
    es_block = re.sub(
        r'"how_it_works\.p2":.*',
        r'"how_it_works.p2": "Cuando te expones a <strong>frecuencias</strong> específicas (como los tonos <strong>Solfeggio</strong>), se produce un fenómeno conocido como <em>respuesta de seguimiento de frecuencia</em>. <strong>Estudios</strong> neuroacústicos sugieren que nuestras <strong>ondas</strong> <strong>cerebrales</strong> tienden a sincronizarse con el ritmo del estímulo sonoro externo.",',
        es_block
    )
    es_block = re.sub(
        r'"how_it_works\.p3":.*',
        r'"how_it_works.p3": "Al <strong>alinear</strong> tu estado <strong>mental</strong> con <strong>frecuencias</strong> asociadas a la gratitud, el alivio o la sanación, tu mensaje se emite desde un estado de mayor coherencia electromagnética. La visualización de la onda asegura que la vibración impregne tu texto actuando como un catalizador hacia lo divino.",',
        es_block
    )
    
    text = text[:es_block_match.start(2)] + es_block + text[es_block_match.end(2):]

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(text)
    
# 2. Update index.html fallback text
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(
    r'<p data-i18n="how_it_works\.p1" data-i18n-html="true">.*?</p>',
    r'<p data-i18n="how_it_works.p1" data-i18n-html="true">La <strong>ciencia</strong> y la <strong>espiritualidad</strong> encuentran un punto de <strong>unión</strong> en el <strong>sonido</strong>. <strong>Oris Numen</strong> utiliza principios de <strong>resonancia acústica</strong> y <strong>Brainwave Entrainment</strong> para potenciar la intención de tu mensaje.</p>',
    html
)
html = re.sub(
    r'<p data-i18n="how_it_works\.p2" data-i18n-html="true">.*?</p>',
    r'<p data-i18n="how_it_works.p2" data-i18n-html="true">Cuando te expones a <strong>frecuencias</strong> específicas (como los tonos <strong>Solfeggio</strong>), se produce un fenómeno conocido como <em>respuesta de seguimiento de frecuencia</em>. <strong>Estudios</strong> neuroacústicos sugieren que nuestras <strong>ondas</strong> <strong>cerebrales</strong> tienden a sincronizarse con el ritmo del estímulo sonoro externo.</p>',
    html
)
html = re.sub(
    r'<p data-i18n="how_it_works\.p3">.*?</p>',
    r'<p data-i18n="how_it_works.p3" data-i18n-html="true">Al <strong>alinear</strong> tu estado <strong>mental</strong> con <strong>frecuencias</strong> asociadas a la gratitud, el alivio o la sanación, tu mensaje se emite desde un estado de mayor coherencia electromagnética. La visualización de la onda asegura que la vibración impregne tu texto actuando como un catalizador hacia lo divino.</p>',
    html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

shutil.copy('js/translations.js', 'android/app/src/main/assets/js/translations.js')
shutil.copy('index.html', 'android/app/src/main/assets/index.html')
print("Patched.")
