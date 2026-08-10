import codecs
import re

new_translations = {
    "es": {
        "universe.send_gratitude": "Enviar Gratitud",
        "universe.gratitude_sent": "Gratitud enviada",
        "universe.push_notification": "Alguien en {country} ha encontrado consuelo en tu mensaje"
    },
    "en": {
        "universe.send_gratitude": "Send Gratitude",
        "universe.gratitude_sent": "Gratitude sent",
        "universe.push_notification": "Someone in {country} found comfort in your message"
    },
    "fr": {
        "universe.send_gratitude": "Envoyer de la gratitude",
        "universe.gratitude_sent": "Gratitude envoyée",
        "universe.push_notification": "Quelqu'un en {country} a trouvé du réconfort dans votre message"
    },
    "it": {
        "universe.send_gratitude": "Invia Gratitudine",
        "universe.gratitude_sent": "Gratitudine inviata",
        "universe.push_notification": "Qualcuno in {country} ha trovato conforto nel tuo messaggio"
    },
    "pt": {
        "universe.send_gratitude": "Enviar Gratidão",
        "universe.gratitude_sent": "Gratidão enviada",
        "universe.push_notification": "Alguém em {country} encontrou conforto na sua mensagem"
    },
    "de": {
        "universe.send_gratitude": "Dankbarkeit senden",
        "universe.gratitude_sent": "Dankbarkeit gesendet",
        "universe.push_notification": "Jemand in {country} hat Trost in deiner Nachricht gefunden"
    },
    "jp": {
        "universe.send_gratitude": "感謝を送る",
        "universe.gratitude_sent": "感謝が送られました",
        "universe.push_notification": "{country} の誰かがあなたのメッセージに慰めを見出しました"
    },
    "zh": {
        "universe.send_gratitude": "发送感谢",
        "universe.gratitude_sent": "感谢已发送",
        "universe.push_notification": "{country} 的某个人在您的信息中找到了安慰"
    },
    "ru": {
        "universe.send_gratitude": "Отправить благодарность",
        "universe.gratitude_sent": "Благодарность отправлена",
        "universe.push_notification": "Кто-то в {country} нашел утешение в вашем сообщении"
    },
    "ko": {
        "universe.send_gratitude": "감사 보내기",
        "universe.gratitude_sent": "감사 보냄",
        "universe.push_notification": "{country}의 누군가가 당신의 메시지에서 위안을 찾았습니다"
    },
    "ar": {
        "universe.send_gratitude": "إرسال الامتنان",
        "universe.gratitude_sent": "تم إرسال الامتنان",
        "universe.push_notification": "شخص ما في {country} وجد الراحة في رسالتك"
    },
    "nl": {
        "universe.send_gratitude": "Dankbaarheid sturen",
        "universe.gratitude_sent": "Dankbaarheid verzonden",
        "universe.push_notification": "Iemand in {country} vond troost in je bericht"
    },
    "sv": {
        "universe.send_gratitude": "Skicka tacksamhet",
        "universe.gratitude_sent": "Tacksamhet skickad",
        "universe.push_notification": "Någon i {country} fann tröst i ditt meddelande"
    },
    "pl": {
        "universe.send_gratitude": "Wyślij wdzięczność",
        "universe.gratitude_sent": "Wdzięczność wysłana",
        "universe.push_notification": "Ktoś w {country} znalazł pocieszenie w twojej wiadomości"
    },
    "tr": {
        "universe.send_gratitude": "Şükran Gönder",
        "universe.gratitude_sent": "Şükran gönderildi",
        "universe.push_notification": "{country} ülkesinden biri mesajınızda teselli buldu"
    },
    "la": {
        "universe.send_gratitude": "Mitte Gratiam",
        "universe.gratitude_sent": "Gratia missa",
        "universe.push_notification": "Aliqui in {country} solatium in nuntio tuo invenit"
    }
}

with codecs.open('js/translations.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to insert these keys inside each language object.
# The structure is lang_code: { ... },
for lang, keys in new_translations.items():
    # Find the start of the language block
    # e.g., "es": { or es: {
    pattern = r'([\s\'\"]*'+lang+r'[\s\'\"]*\s*:\s*\{)'
    match = re.search(pattern, text)
    if match:
        insert_idx = match.end()
        # Create the string to insert
        insert_str = ""
        for k, v in keys.items():
            insert_str += f'\n        "{k}": "{v}",'
        text = text[:insert_idx] + insert_str + text[insert_idx:]

with codecs.open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Translations injected.")
