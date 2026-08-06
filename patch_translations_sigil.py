import json
import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    text = f.read()

new_keys = {
    'en': {
        "sigil.elements": "Elements: ",
        "sigil.and": " and ",
        "sigil.none": "Elements: None",
        "sigil.duration": "Duration",
        "sigil.date": "Date"
    },
    'es': {
        "sigil.elements": "Elementos: ",
        "sigil.and": " y ",
        "sigil.none": "Elementos: Ninguno",
        "sigil.duration": "Duración",
        "sigil.date": "Fecha"
    },
    'it': {
        "sigil.elements": "Elementi: ",
        "sigil.and": " e ",
        "sigil.none": "Elementi: Nessuno",
        "sigil.duration": "Durata",
        "sigil.date": "Data"
    },
    'la': {
        "sigil.elements": "Elementa: ",
        "sigil.and": " et ",
        "sigil.none": "Elementa: Nulla",
        "sigil.duration": "Tempus",
        "sigil.date": "Dies"
    },
    'zh': {
        "sigil.elements": "元素：",
        "sigil.and": " 和 ",
        "sigil.none": "元素：无",
        "sigil.duration": "持续时间",
        "sigil.date": "日期"
    }
}

for lang, keys in new_keys.items():
    # Find the language block
    pattern = r'(' + lang + r':\s*\{)(.*?)(\n\s*\})'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        block = match.group(2)
        # Check if keys are already added
        if '"sigil.elements"' not in block:
            new_lines = ""
            for k, v in keys.items():
                new_lines += f'\n        "{k}": {json.dumps(v, ensure_ascii=False)},'
            
            # Ensure the block ends with a comma if it doesn't have one
            if not block.strip().endswith(','):
                block += ','
                
            block += new_lines
            text = text[:match.start(2)] + block + text[match.end(2):]

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("translations.js patched.")
