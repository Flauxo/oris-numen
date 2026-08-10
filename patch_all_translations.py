import codecs
import re

with codecs.open('js/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
    'en': 'You agree to send your message to the universe anonymously and in exchange, the channeling of another soul will be returned to you. Keep these words inside you and do not share them.',
    'es': 'Aceptas enviar tu mensaje al universo de forma anónima y a cambio, se te devolverá la canalización de otra alma. Guarda estas palabras en tu interior y no las compartas.',
    'it': 'Accetti di inviare il tuo messaggio all\\'universo in modo anonimo e in cambio, ti verrà restituita la canalizzazione di un\\'altra anima. Custodisci queste parole dentro di te e non condividerle.',
    'la': 'Assentiris nuntium tuum ad universum occulte mittere, et vicissim canalizatio alterius animae tibi reddetur. Custodi haec verba in te nec ea communica.',
    'zh': '您同意匿名向宇宙发送您的信息，作为交换，另一个灵魂的通灵将返回给您。将这些话留在心里，不要分享。',
    'ja': 'あなたは自分のメッセージを匿名で宇宙に送ることに同意します。その代わりに、別の魂のチャネリングがあなたに返されます。これらの言葉を心の中に留め、共有しないでください。',
    'ko': '당신은 우주에 당신의 메시지를 익명으로 보내는 데 동의하며, 그 대가로 다른 영혼의 채널링이 당신에게 반환됩니다. 이 말들을 마음속에 간직하고 공유하지 마세요.',
    'ru': 'Вы соглашаетесь отправить свое сообщение во вселенную анонимно, и взамен вам будет возвращен ченнелинг другой души. Храните эти слова внутри себя и не делитесь ими.',
    'fr': 'Vous acceptez d\\'envoyer votre message à l\\'univers de manière anonyme et en échange, la canalisation d\\'une autre âme vous sera retournée. Gardez ces mots en vous et ne les partagez pas.',
    'de': 'Sie stimmen zu, Ihre Nachricht anonym an das Universum zu senden, und im Gegenzug wird Ihnen das Channeling einer anderen Seele zurückgegeben. Behalten Sie diese Worte in sich und teilen Sie sie nicht.',
    'ar': 'أنت توافق على إرسال رسالتك إلى الكون بشكل مجهول وفي المقابل، سيتم إرجاع توجيه روح أخرى إليك. احتفظ بهذه الكلمات بداخلك ولا تشاركها.',
    'hi': 'आप अपने संदेश को ब्रह्मांड में गुमनाम रूप से भेजने के लिए सहमत हैं और बदले में, एक और आत्मा की चैनलिंग आपको वापस कर दी जाएगी। इन शब्दों को अपने अंदर रखें और उन्हें साझा न करें।',
    'pt': 'Você concorda em enviar sua mensagem ao universo anonimamente e, em troca, a canalização de outra alma será devolvida a você. Guarde essas palavras dentro de você e não as compartilhe.',
    'bn': 'আপনি বেনামে আপনার বার্তাটি মহাবিশ্বে প্রেরণ করতে সম্মত হন এবং এর বিনিময়ে, অন্য একটি আত্মার চ্যানেলিং আপনার কাছে ফিরে আসবে। এই কথাগুলো নিজের মধ্যে রাখুন এবং শেয়ার করবেন না।',
    'ur': 'آپ اپنا پیغام کائنات کو گمنام طور پر بھیجنے پر راضی ہیں اور اس کے بدلے میں، کسی دوسری روح کی چینلنگ آپ کو واپس کر دی جائے گی۔ ان باتوں کو اپنے اندر رکھیں اور شیئر نہ کریں۔',
    'id': 'Anda setuju untuk mengirim pesan Anda ke alam semesta secara anonim dan sebagai gantinya, penyaluran jiwa lain akan dikembalikan kepada Anda. Simpan kata-kata ini di dalam diri Anda dan jangan membagikannya.'
}

for lang, text in translations.items():
    # Replace the text for each specific language block
    # A generic regex to replace the first modal_text1 after '"lang": {'
    pattern = re.compile(r'("' + lang + r'":\s*\{.*?"universe\.modal_text1":\s*")[^"]+(")', re.DOTALL)
    content = pattern.sub(r'\g<1>' + text + r'\g<2>', content, count=1)

with codecs.open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Translations patched.")
