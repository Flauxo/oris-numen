import json

with open('js/translations.js', 'r', encoding='utf-8') as f:
    text = f.read()

# English
en_p1 = '        "how_it_works.p1": "<strong>Science</strong> and <strong>spirituality</strong> find a <strong>meeting point</strong> in <strong>sound</strong>. <strong>Oris Numen</strong> uses principles of <strong>acoustic resonance</strong> and <strong>Brainwave Entrainment</strong> to enhance the intention of your message.",'
en_p2 = '        "how_it_works.p2": "When you are exposed to specific <strong>frequencies</strong> (like the <strong>Solfeggio</strong> tones), a phenomenon known as <em>frequency following response</em> occurs. Neuroacoustic <strong>studies</strong> suggest our <strong>brainwaves</strong> tend to synchronize with the rhythm of external sound stimuli.",'
en_p3 = '        "how_it_works.p3": "By <strong>aligning</strong> your <strong>mental</strong> state with <strong>frequencies</strong> associated with gratitude, relief, or healing, your message is emitted from a state of greater electromagnetic coherence. The visualization of the wave ensures the vibration permeates your text, acting as a catalyst toward the divine.",'

# Italian
it_p1 = '        "how_it_works.p1": "La <strong>scienza</strong> e la <strong>spiritualità</strong> trovano un punto di <strong>incontro</strong> nel <strong>suono</strong>. <strong>Oris Numen</strong> utilizza principi di <strong>risonanza acustica</strong> e <strong>Brainwave Entrainment</strong> per potenziare l\'intenzione del tuo messaggio.",'
it_p2 = '        "how_it_works.p2": "Quando ti esponi a <strong>frequenze</strong> specifiche (come i toni <strong>Solfeggio</strong>), si verifica un fenomeno noto come <em>risposta di inseguimento in frequenza</em>. Gli <strong>studi</strong> neuroacustici suggeriscono che le nostre <strong>onde</strong> <strong>cerebrali</strong> tendono a sincronizzarsi con il ritmo degli stimoli sonori esterni.",'
it_p3 = '        "how_it_works.p3": "<strong>Allineando</strong> il tuo stato <strong>mentale</strong> con <strong>frequenze</strong> associate alla gratitudine, al sollievo o alla guarigione, il tuo messaggio viene emesso da uno stato di maggiore coerenza elettromagnetica. La visualizzazione dell\'onda assicura che la vibrazione permei il tuo testo, agendo da catalizzatore verso il divino.",'

# Latin
la_p1 = '        "how_it_works.p1": "<strong>Scientia</strong> et <strong>spiritualitas</strong> in <strong>sono</strong> punctum <strong>unionis</strong> inveniunt. <strong>Oris Numen</strong> utitur principiis <strong>resonantiæ acousticæ</strong> et <strong>Brainwave Entrainment</strong> ad intentionem nuntii tui augendam.",'
la_p2 = '        "how_it_works.p2": "Cum certis <strong>frequentiis</strong> exponeris (sicut toni <strong>Solfeggio</strong>), accidit phaenomenon notum ut <em>responsio insecutionis frequentiae</em>. <strong>Studia</strong> neuroacoustica innuunt <strong>undas</strong> nostras <strong>cerebrales</strong> tendere ad synchronizandum cum rhythmo stimulorum sonorum externorum.",'
la_p3 = '        "how_it_works.p3": "<strong>Coaptando</strong> statum tuum <strong>mentalem</strong> cum <strong>frequentiis</strong> quae cum gratitudine, levamine vel sanatione sociantur, nuntius tuus ex statu maioris cohaerentiae electromagneticae emittitur. Visio undae efficit ut vibratio textum tuum pervadat, agens sicut catalysator ad divinum.",'

# Chinese
zh_p1_text = "<strong>科学</strong>和<strong>精神</strong>在<strong>声音</strong>中找到了一个<strong>交汇点</strong>。"
zh_p2_text = "当你暴露在特定的<strong>频率</strong>下时，会发生<strong>脑波</strong>同步。"
zh_p3_text = "通过使你的<strong>精神</strong>状态与感激或治愈等<strong>频率</strong><strong>保持一致</strong>，你的信息就会发出。"

zh_p1 = f'        "how_it_works.p1": {json.dumps(zh_p1_text, ensure_ascii=False)},'
zh_p2 = f'        "how_it_works.p2": {json.dumps(zh_p2_text, ensure_ascii=False)},'
zh_p3 = f'        "how_it_works.p3": {json.dumps(zh_p3_text, ensure_ascii=False)},'

import re

def replace_p(text, lang, p1, p2, p3):
    block_match = re.search(r'(' + lang + r':\s*\{)(.*?)(\n\s*\})', text, re.DOTALL)
    if block_match:
        block = block_match.group(2)
        block = re.sub(r'"how_it_works\.p1":.*', p1, block)
        block = re.sub(r'"how_it_works\.p2":.*', p2, block)
        block = re.sub(r'"how_it_works\.p3":.*', p3, block)
        return text[:block_match.start(2)] + block + text[block_match.end(2):]
    return text

text = replace_p(text, 'en', en_p1, en_p2, en_p3)
text = replace_p(text, 'it', it_p1, it_p2, it_p3)
text = replace_p(text, 'la', la_p1, la_p2, la_p3)
text = replace_p(text, 'zh', zh_p1, zh_p2, zh_p3)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(text)

import shutil
shutil.copy('js/translations.js', 'android/app/src/main/assets/js/translations.js')
print("All languages patched.")
