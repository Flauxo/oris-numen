import json
import re

html_path = "index.html"
css_path = "css/style.css"
trans_path = "js/translations.js"

# 1. Update HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Change scroll indicator text to have data-i18n and change text
html_content = html_content.replace(
    '<div class="bounce-anim" style="font-weight: bold;">↓ Desliza hacia abajo ↓</div>',
    '<div class="bounce-anim" style="font-weight: bold;" data-i18n="guide.scroll">↓ Sigue leyendo ↓</div>'
)

# Change scroll indicator color from D4845A to 7B5EA7
html_content = html_content.replace(
    'color: #D4845A; pointer-events: none; transition: opacity 0.3s ease;',
    'color: #7B5EA7; pointer-events: none; transition: opacity 0.3s ease;'
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)


# 2. Update CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace(
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.3rem;
    color: #D4845A;""",
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.3rem;
    color: #7B5EA7;"""
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)


# 3. Update Translations
with open(trans_path, 'r', encoding='utf-8') as f:
    trans_content = f.read()

all_translations = {
    'es': {
        "btn.guide": "Instrucciones",
        "guide.title": "Guía para la<br>Canalización",
        "guide.step1.title": "Crea tu santuario:",
        "guide.step1.desc": "Busca un espacio en penumbra y silencio, resguardado de cualquier interferencia externa.",
        "guide.step2.title": "Consagra el tiempo:",
        "guide.step2.desc": "Reserva al menos 15 minutos de presencia plena para esta experiencia.",
        "guide.step3.title": "Silencia el mundo exterior:",
        "guide.step3.desc": "Activa el modo «no molestar» en tu dispositivo y desvincúlate de las distracciones cotidianas.",
        "guide.step4.title": "Apaga la luz de la pantalla:",
        "guide.step4.desc": "Deja que la visión física se atenúe para dar paso a la percepción interior.",
        "guide.step5.title": "Sostén la intención:",
        "guide.step5.desc": "Mantén tu mente y tu espíritu enfocados en el mensaje mientras permites que la frecuencia sonora resuene y abra el canal.",
        "guide.quote": '"El canal se abre cuando la intención es clara y el corazón está en silencio."',
        "guide.scroll": "↓ Sigue leyendo ↓"
    },
    'en': {
        "btn.guide": "Instructions",
        "guide.title": "Channeling<br>Guide",
        "guide.step1.title": "Create your sanctuary:",
        "guide.step1.desc": "Find a quiet, dimly lit space, shielded from any external interference.",
        "guide.step2.title": "Consecrate the time:",
        "guide.step2.desc": "Reserve at least 15 minutes of full presence for this experience.",
        "guide.step3.title": "Silence the outer world:",
        "guide.step3.desc": "Activate «do not disturb» mode on your device and disconnect from daily distractions.",
        "guide.step4.title": "Dim the screen light:",
        "guide.step4.desc": "Let your physical vision dim to make way for inner perception.",
        "guide.step5.title": "Hold the intention:",
        "guide.step5.desc": "Keep your mind and spirit focused on the message while allowing the sound frequency to resonate and open the channel.",
        "guide.quote": '"The channel opens when the intention is clear and the heart is silent."',
        "guide.scroll": "↓ Keep reading ↓"
    },
    'it': {
        "btn.guide": "Istruzioni",
        "guide.title": "Guida alla<br>Canalizzazione",
        "guide.step1.title": "Crea il tuo santuario:",
        "guide.step1.desc": "Trova uno spazio in penombra e silenzioso, al riparo da qualsiasi interferenza esterna.",
        "guide.step2.title": "Consacra il tempo:",
        "guide.step2.desc": "Riserva almeno 15 minuti di piena presenza per questa esperienza.",
        "guide.step3.title": "Silenzia il mondo esterno:",
        "guide.step3.desc": "Attiva la modalità «non disturbare» sul tuo dispositivo e distaccati dalle distrazioni quotidiane.",
        "guide.step4.title": "Spegni la luce dello schermo:",
        "guide.step4.desc": "Lascia che la visione fisica si attenui per far spazio alla percezione interiore.",
        "guide.step5.title": "Sostieni l'intenzione:",
        "guide.step5.desc": "Mantieni la tua mente e il tuo spirito concentrati sul messaggio mentre permetti alla frequenza sonora di risuonare e aprire il canale.",
        "guide.quote": '"Il canale si apre quando l\'intenzione è chiara e il cuore è in silenzio."',
        "guide.scroll": "↓ Continua a leggere ↓"
    },
    'fr': {
        "btn.guide": "Instructions",
        "guide.title": "Guide de<br>Canalisation",
        "guide.step1.title": "Créez votre sanctuaire :",
        "guide.step1.desc": "Trouvez un espace sombre et silencieux, à l'abri de toute interférence externe.",
        "guide.step2.title": "Consacrez le temps :",
        "guide.step2.desc": "Réservez au moins 15 minutes de pleine présence pour cette expérience.",
        "guide.step3.title": "Réduisez le monde extérieur au silence :",
        "guide.step3.desc": "Activez le mode « ne pas déranger » sur votre appareil et déconnectez-vous des distractions quotidiennes.",
        "guide.step4.title": "Éteignez la lumière de l'écran :",
        "guide.step4.desc": "Laissez la vision physique s'estomper pour faire place à la perception intérieure.",
        "guide.step5.title": "Maintenez l'intention :",
        "guide.step5.desc": "Gardez votre esprit concentré sur le message tout en permettant à la fréquence sonore de résonner et d'ouvrir le canal.",
        "guide.quote": '"Le canal s\'ouvre lorsque l\'intention est claire et le cœur est silencieux."',
        "guide.scroll": "↓ Continuez à lire ↓"
    },
    'pt': {
        "btn.guide": "Instruções",
        "guide.title": "Guia de<br>Canalização",
        "guide.step1.title": "Crie o seu santuário:",
        "guide.step1.desc": "Encontre um espaço na penumbra e silencioso, protegido de qualquer interferência externa.",
        "guide.step2.title": "Consagre o tempo:",
        "guide.step2.desc": "Reserve pelo menos 15 minutos de presença plena para esta experiência.",
        "guide.step3.title": "Silencie o mundo exterior:",
        "guide.step3.desc": "Ative o modo «não incomodar» no seu dispositivo e desconecte-se das distrações diárias.",
        "guide.step4.title": "Apague a luz do ecrã:",
        "guide.step4.desc": "Deixe a visão física atenuar para dar lugar à perceção interior.",
        "guide.step5.title": "Sustenha a intenção:",
        "guide.step5.desc": "Mantenha a sua mente e espírito focados na mensagem enquanto permite que a frequência sonora ressoe e abra o canal.",
        "guide.quote": '"O canal abre-se quando a intenção é clara e o coração está em silêncio."',
        "guide.scroll": "↓ Continue a ler ↓"
    },
    'de': {
        "btn.guide": "Anleitung",
        "guide.title": "Leitfaden zur<br>Kanalisierung",
        "guide.step1.title": "Erschaffe dein Heiligtum:",
        "guide.step1.desc": "Finde einen ruhigen, halbdunklen Raum, geschützt vor jeglicher äußeren Störung.",
        "guide.step2.title": "Weihe die Zeit:",
        "guide.step2.desc": "Reserviere mindestens 15 Minuten voller Präsenz für diese Erfahrung.",
        "guide.step3.title": "Bringe die Außenwelt zum Schweigen:",
        "guide.step3.desc": "Aktiviere den «Nicht stören»-Modus auf deinem Gerät und löse dich von alltäglichen Ablenkungen.",
        "guide.step4.title": "Schalte das Bildschirmlicht aus:",
        "guide.step4.desc": "Lass die physische Sicht nachlassen, um Platz für die innere Wahrnehmung zu machen.",
        "guide.step5.title": "Halte die Absicht:",
        "guide.step5.desc": "Halte deinen Geist und Seele auf die Botschaft fokussiert, während du zulässt, dass die Klangfrequenz mitschwingt und den Kanal öffnet.",
        "guide.quote": '"Der Kanal öffnet sich, wenn die Absicht klar ist und das Herz schweigt."',
        "guide.scroll": "↓ Weiterlesen ↓"
    }
}

lines = trans_content.split('\n')
new_lines = []
current_lang = None

for line in lines:
    m = re.search(r"^\s*'([a-z]{2})':\s*\{", line)
    if m:
        current_lang = m.group(1)
        new_lines.append(line)
        continue
    
    # Drop existing guide keys
    is_guide_key = False
    for k in ['btn.guide', 'guide.title', 'guide.step1.title', 'guide.step1.desc', 'guide.step2.title', 'guide.step2.desc', 'guide.step3.title', 'guide.step3.desc', 'guide.step4.title', 'guide.step4.desc', 'guide.step5.title', 'guide.step5.desc', 'guide.quote', 'guide.scroll']:
        if f'"{k}":' in line:
            is_guide_key = True
            break
            
    if is_guide_key:
        pass # Drop the line
    else:
        # Check if it's the end of the lang block
        if current_lang and re.match(r"^\s*\},", line) or re.match(r"^\s*\}", line):
            # Insert all translations for this lang
            if current_lang in all_translations:
                for k, v in all_translations[current_lang].items():
                    escaped_v = v.replace('"', '\\"').replace("\n", "\\n")
                    new_lines.append(f'        "{k}": "{escaped_v}",')
            new_lines.append(line)
            current_lang = None
        else:
            new_lines.append(line)

with open(trans_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("DONE")