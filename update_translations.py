import re

path = 'js/translations.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def repl_text1(match):
    p1 = match.group(1)
    p2 = match.group(2)
    p3 = match.group(3)
    
    if 'Aceptas enviar' in p2:
        return p1 + p2 + ' Por favor, este mensaje guárdalo en tu interior y no lo compartas.' + p3
    if 'You agree' in p2:
        return p1 + p2 + ' Please, keep this message inside you and do not share it.' + p3
    if 'Accetti di' in p2:
        return p1 + p2 + ' Per favore, conserva questo messaggio dentro di te e non condividerlo.' + p3
    if 'Assentiris' in p2:
        return p1 + p2 + ' Quaeso, hunc nuntium intus custodi nec eum communica.' + p3
    if '您同意' in p2:
        return p1 + p2 + ' 请将这条信息保存在您内心，不要分享。' + p3
    return match.group(0)

content = re.sub(r'("universe\.modal_text1":\s*")([^"]+)(")', repl_text1, content)

content = content.replace('"universe.found": "Found"', '"universe.found": "Message found"')
content = content.replace('"universe.found": "Encontrado"', '"universe.found": "Mensaje encontrado"')
content = content.replace('"universe.found": "Trovato"', '"universe.found": "Messaggio trovato"')
content = content.replace('"universe.found": "Inventus"', '"universe.found": "Nuntius inventus"')
content = content.replace('"universe.found": "已找到"', '"universe.found": "找到信息"')
content = content.replace('"universe.found": "找到"', '"universe.found": "找到信息"')
content = content.replace('"universe.found": "???"', '"universe.found": "找到信息"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
