import json
import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to extract the Translations object, parse it (or just use regex to insert keys at the end of each language block)
# Actually, it's easier to regex search for the start of the next block and insert before it.

langs = ['en', 'es', 'it', 'la', 'zh']

new_keys = {
    'en': {
        "universe.send_link": "Send your message to the universe",
        "universe.modal_title": "Send to the Universe",
        "universe.modal_text1": "You agree to send your message to the universe anonymously and in exchange receive a message from a user or a channeler of the application.",
        "universe.modal_text2": "Please, keep this message inside you and do not share it. We ask that you do not take screenshots of this section.",
        "universe.btn_accept": "Accept",
        "universe.searching": "Searching for channel...",
        "universe.found": "Found",
        "universe.close": "Close",
        "universe.from": "from",
        "universe.no_internet": "Internet connection is required."
    },
    'es': {
        "universe.send_link": "Envía tu mensaje al universo",
        "universe.modal_title": "Envío al Universo",
        "universe.modal_text1": "Aceptas enviar tu mensaje al universo de forma anónima y a cambio recibir un mensaje de un usuario o de un canalizador de la aplicación.",
        "universe.modal_text2": "Por favor, este mensaje guárdalo en tu interior y no lo compartas. Te pedimos que no hagas capturas de pantalla de esta sección.",
        "universe.btn_accept": "Aceptar",
        "universe.searching": "Buscando canalización...",
        "universe.found": "Encontrado",
        "universe.close": "Cerrar",
        "universe.from": "desde",
        "universe.no_internet": "Se necesita conexión a internet."
    },
    'it': {
        "universe.send_link": "Invia il tuo messaggio all'universo",
        "universe.modal_title": "Invio all'Universo",
        "universe.modal_text1": "Accetti di inviare il tuo messaggio all'universo in modo anonimo e in cambio di ricevere un messaggio da un utente o canalizzatore.",
        "universe.modal_text2": "Per favore, conserva questo messaggio dentro di te e non condividerlo. Ti chiediamo di non fare screenshot di questa sezione.",
        "universe.btn_accept": "Accettare",
        "universe.searching": "Ricerca canalizzazione...",
        "universe.found": "Trovato",
        "universe.close": "Chiudere",
        "universe.from": "da",
        "universe.no_internet": "È necessaria una connessione internet."
    },
    'la': {
        "universe.send_link": "Mitte nuntium tuum ad universum",
        "universe.modal_title": "Missio ad Universum",
        "universe.modal_text1": "Assentiris nuntium tuum ad universum mittere occulte et vicissim accipere nuntium ab alio utente.",
        "universe.modal_text2": "Quaeso, hunc nuntium intus custodi nec eum communica. Rogamus ne imagines huius sectionis capias.",
        "universe.btn_accept": "Accipere",
        "universe.searching": "Quaerens canalem...",
        "universe.found": "Inventus",
        "universe.close": "Claudere",
        "universe.from": "ab",
        "universe.no_internet": "Connexio retialis requiritur."
    },
    'zh': {
        "universe.send_link": "将您的信息发送给宇宙",
        "universe.modal_title": "发送给宇宙",
        "universe.modal_text1": "您同意匿名将您的信息发送给宇宙，作为交换，您将收到来自应用程序用户或通灵者的信息。",
        "universe.modal_text2": "请将此信息保留在您的内心，不要分享它。我们要求您不要截取此部分的屏幕截图。",
        "universe.btn_accept": "接受",
        "universe.searching": "正在寻找通灵...",
        "universe.found": "已找到",
        "universe.close": "关闭",
        "universe.from": "来自",
        "universe.no_internet": "需要互联网连接。"
    }
}

for lang, keys in new_keys.items():
    # Construct the string to insert
    insert_str = ",\n"
    for k, v in keys.items():
        insert_str += f'        "{k}": "{v}",\n'
    insert_str = insert_str.rstrip(',\n')
    
    # Find the block for the language
    # Look for "lang": { ... }
    pattern = re.compile(r'(\n\s+)' + lang + r':\s*\{')
    match = pattern.search(content)
    if match:
        start_idx = match.end()
        # insert right after the opening brace
        content = content[:start_idx] + "\n" + insert_str + "," + content[start_idx:]

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations updated successfully.")
