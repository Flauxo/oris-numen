import json
import re
import os
import shutil

html_path = "index.html"
css_path = "css/style.css"
js_path = "js/app.js"
trans_path = "js/translations.js"

# 1. Update index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Add button
if 'id="btn-guide"' not in html_content:
    btn_html = '                <button id="btn-guide" class="btn-back" style="left: auto; right: 16px;" data-i18n="btn.guide">Instrucciones</button>\n'
    html_content = html_content.replace(
        '<div class="freq-indicator-container">',
        btn_html + '                <div class="freq-indicator-container">'
    )

# Add modal overlay
modal_html = """
        <!-- Guide Overlay -->
        <div id="guide-overlay" class="overlay">
            <div class="overlay-backdrop" id="guide-backdrop"></div>
              <div class="modal-card guide-modal">
                  <div class="modal-header">
                      <h3 class="modal-title" style="color: #000000; font-family: var(--font-serif); font-size: 2.2rem; font-weight: 500; text-align: left; line-height: 1.1; margin-bottom: 24px;" data-i18n="guide.title">Guía para la<br>Canalización</h3>
                      <button id="btn-close-guide" class="btn-close-modal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                  </div>
                  
                  <div class="modal-body guide-body" style="text-align: left;">
                      <div class="guide-item">
                          <div class="guide-number" style="color: #9C8BB4;">1.</div>
                          <div class="guide-text" style="color: #9C8BB4;">
                              <h4 data-i18n="guide.step1.title" style="color: #333;">Crea tu santuario:</h4>
                              <p data-i18n="guide.step1.desc" style="color: #666;">Busca un espacio en penumbra y silencio, resguardado de cualquier interferencia externa.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #9C8BB4;">2.</div>
                          <div class="guide-text" style="color: #9C8BB4;">
                              <h4 data-i18n="guide.step2.title" style="color: #333;">Consagra el tiempo:</h4>
                              <p data-i18n="guide.step2.desc" style="color: #666;">Reserva al menos 15 minutos de presencia plena para esta experiencia.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #6C5C8A;">3.</div>
                          <div class="guide-text" style="color: #6C5C8A;">
                              <h4 data-i18n="guide.step3.title" style="color: #333;">Silencia el mundo exterior:</h4>
                              <p data-i18n="guide.step3.desc" style="color: #666;">Activa el modo «no molestar» en tu dispositivo y desvincúlate de las distracciones cotidianas.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #554477;">4.</div>
                          <div class="guide-text" style="color: #554477;">
                              <h4 data-i18n="guide.step4.title" style="color: #333;">Apaga la luz de la pantalla:</h4>
                              <p data-i18n="guide.step4.desc" style="color: #666;">Deja que la visión física se atenúe para dar paso a la percepción interior.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #332255;">5.</div>
                          <div class="guide-text" style="color: #332255;">
                              <h4 data-i18n="guide.step5.title" style="color: #333;">Sostén la intención:</h4>
                              <p data-i18n="guide.step5.desc" style="color: #666;">Mantén tu mente y tu espíritu enfocados en el mensaje mientras permites que la frecuencia sonora resuene y abra el canal.</p>
                          </div>
                      </div>
                      
                      <div class="guide-footer">
                          <p data-i18n="guide.quote">"El canal se abre cuando la intención es clara y el corazón está en silencio."</p>
                      </div>
                  </div>
              </div>
        </div>
"""
if 'id="guide-overlay"' not in html_content:
    html_content = html_content.replace(
        '<div id="evolution-overlay" class="overlay">',
        modal_html + '\n        <div id="evolution-overlay" class="overlay">'
    )

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)


# 2. Update style.css
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

if '.guide-modal' not in css_content:
    css_add = """
/* Guide Modal Styles */
.guide-modal {
    padding: 32px 24px;
}
.guide-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #EAE5DF;
}
.guide-item:last-of-type {
    border-bottom: none;
    margin-bottom: 16px;
    padding-bottom: 0;
}
.guide-number {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    font-weight: 500;
    width: 50px;
    flex-shrink: 0;
    text-align: center;
}
.guide-text {
    flex-grow: 1;
    padding-left: 16px;
    border-left: 1px solid currentColor;
}
.guide-text h4 {
    font-family: var(--font-sans);
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 6px;
}
.guide-text p {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    line-height: 1.4;
    margin: 0;
}
.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.1rem;
    color: #7B5EA7;
    margin-top: 32px;
    padding: 0 16px;
}
"""
    css_content += css_add
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)


# 3. Update app.js
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add event listeners for guide
js_injection = """
        const btnGuide = document.getElementById('btn-guide');
        if (btnGuide) btnGuide.addEventListener('click', () => this.showGuideCard());

        const btnCloseGuide = document.getElementById('btn-close-guide');
        if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => this.closeGuideCard());
        
        const guideBackdrop = document.getElementById('guide-backdrop');
        if (guideBackdrop) guideBackdrop.addEventListener('click', () => this.closeGuideCard());
"""
if 'btnGuide.addEventListener' not in js_content:
    js_content = js_content.replace(
        "const btnBack = document.getElementById('btn-back');",
        "const btnBack = document.getElementById('btn-back');\n" + js_injection
    )

js_methods = """
  showGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.add('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  closeGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },
"""
if 'showGuideCard()' not in js_content:
    js_content = js_content.replace(
        "  showEvolutionCard() {",
        js_methods + "\n  showEvolutionCard() {"
    )

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)


# 4. Update translations.js
# Read the file line by line
trans_lines = []
with open(trans_path, 'r', encoding='utf-8') as f:
    trans_lines = f.readlines()

langs = ['en', 'es', 'it', 'fr', 'pt', 'de']
translations = {
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
        "guide.quote": '"El canal se abre cuando la intención es clara y el corazón está en silencio."'
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
        "guide.quote": '"The channel opens when the intention is clear and the heart is silent."'
    },
    # Auto fill others with EN or ES placeholders for now to not crash
}

for lang in langs:
    if lang not in translations:
        translations[lang] = translations['en']

new_trans_lines = []
current_lang = None
for line in trans_lines:
    new_trans_lines.append(line)
    m = re.search(r"^\s*'([a-z]{2})':\s*\{", line)
    if m:
        current_lang = m.group(1)
        # Add the dictionary keys right after
        if current_lang in translations:
            for k, v in translations[current_lang].items():
                escaped_v = v.replace('"', '\\"').replace("\n", "\\n")
                new_trans_lines.append(f'        "{k}": "{escaped_v}",\n')

with open(trans_path, 'w', encoding='utf-8') as f:
    f.writelines(new_trans_lines)

print("DONE")