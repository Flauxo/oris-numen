import codecs

with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace('if (Math.random() < 0.15) {', 'if (Math.random() <= 1.0) { // TEST MODE: 100% probability')

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
