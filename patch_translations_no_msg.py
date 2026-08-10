import codecs
import re

with codecs.open('js/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'en': '"universe.no_messages": "We have not found available messages",',
    'es': '"universe.no_messages": "No hemos encontrado mensajes disponibles",',
    'it': '"universe.no_messages": "Non abbiamo trovato messaggi disponibili",',
    'la': '"universe.no_messages": "Nulla nuntia praesto invenimus",',
    'zh': '"universe.no_messages": "没有找到可用的信息",',
    'ja': '"universe.no_messages": "利用可能なメッセージが見つかりませんでした",',
    'ko': '"universe.no_messages": "사용 가능한 메시지를 찾을 수 없습니다",',
    'ru': '"universe.no_messages": "Мы не нашли доступных сообщений",',
    'fr': '"universe.no_messages": "Nous n\'avons trouvé aucun message disponible",',
    'de': '"universe.no_messages": "Wir haben keine verfügbaren Nachrichten gefunden",',
    'ar': '"universe.no_messages": "لم نعثر على رسائل متاحة",',
    'hi': '"universe.no_messages": "हमें कोई उपलब्ध संदेश नहीं मिला",',
    'pt': '"universe.no_messages": "Não encontramos mensagens disponíveis",',
    'bn': '"universe.no_messages": "আমরা কোন উপলব্ধ বার্তা পাইনি",',
    'ur': '"universe.no_messages": "ہمیں کوئی دستیاب پیغامات نہیں ملے",',
    'id': '"universe.no_messages": "Kami tidak menemukan pesan yang tersedia",'
}

for lang, translation_str in translations.items():
    pattern = f'("{lang}": {{)'
    if lang in content:
        content = re.sub(pattern, f'\\1\n        {translation_str}', content, count=1)

with codecs.open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Translations added")
