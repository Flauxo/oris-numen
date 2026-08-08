import re
import codecs

with open('js/translations.js', 'r', encoding='utf-8', errors='replace') as f:
    js = f.read()

def replace_back(m):
    # m.group(1) is the translated text containing the weird arrow
    # we replace anything that is not a standard letter/space with &larr;
    text = m.group(1)
    text = re.sub(r'^[^\w\s]+', '&larr; ', text)
    # also hardcode it if it has unicode replacement char
    if '\ufffd' in text or '' in text:
        text = text.replace('\ufffd', '').replace('', '')
        if not text.startswith('&larr;'):
            text = '&larr; ' + text.strip()
            
    # if no arrow added, add it
    if '&larr;' not in text:
        text = '&larr; ' + text.strip()
    return f'"btn.back": "{text}"'

js = re.sub(r'"btn\.back"\s*:\s*"(.*?)"', replace_back, js)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed translations again")
