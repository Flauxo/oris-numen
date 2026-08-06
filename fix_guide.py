import json
import re

html_path = "index.html"
css_path = "css/style.css"
js_path = "js/app.js"

# 1. UPDATE HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the modal-body guide-body with the new styled one
old_body_start = '<div class="modal-body guide-body" style="text-align: left;">'
old_body_end = '</div>\n              </div>\n        </div>'

# Extract the block to replace
start_idx = html_content.find(old_body_start)
end_idx = html_content.find(old_body_end, start_idx) + len('</div>\n              </div>')

new_body = """<div class="modal-body guide-body" style="text-align: left;">
                      <div class="guide-item">
                          <div class="guide-number" style="color: #7B5EA7;">1.</div>
                          <div class="guide-text">
                              <h4 data-i18n="guide.step1.title" style="color: #333;">Crea tu santuario:</h4>
                              <p data-i18n="guide.step1.desc" style="color: #666;">Busca un espacio en penumbra y silencio, resguardado de cualquier interferencia externa.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #D4845A;">2.</div>
                          <div class="guide-text">
                              <h4 data-i18n="guide.step2.title" style="color: #333;">Consagra el tiempo:</h4>
                              <p data-i18n="guide.step2.desc" style="color: #666;">Reserva al menos 15 minutos de presencia plena para esta experiencia.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #5A8BB5;">3.</div>
                          <div class="guide-text">
                              <h4 data-i18n="guide.step3.title" style="color: #333;">Silencia el mundo exterior:</h4>
                              <p data-i18n="guide.step3.desc" style="color: #666;">Activa el modo «no molestar» en tu dispositivo y desvincúlate de las distracciones cotidianas.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #D4B85A;">4.</div>
                          <div class="guide-text">
                              <h4 data-i18n="guide.step4.title" style="color: #333;">Apaga la luz de la pantalla:</h4>
                              <p data-i18n="guide.step4.desc" style="color: #666;">Deja que la visión física se atenúe para dar paso a la percepción interior.</p>
                          </div>
                      </div>
                      <div class="guide-item">
                          <div class="guide-number" style="color: #ff3333;">5.</div>
                          <div class="guide-text">
                              <h4 data-i18n="guide.step5.title" style="color: #333;">Sostén la intención:</h4>
                              <p data-i18n="guide.step5.desc" style="color: #666;">Mantén tu mente y tu espíritu enfocados en el mensaje mientras permites que la frecuencia sonora resuene y abra el canal.</p>
                          </div>
                      </div>
                      
                      <div class="guide-footer">
                          <p data-i18n="guide.quote">"El canal se abre cuando la intención es clara y el corazón está en silencio."</p>
                      </div>
                      
                      <div id="guide-scroll-indicator" style="position: sticky; bottom: -10px; text-align: center; color: #D4845A; pointer-events: none; transition: opacity 0.3s ease; opacity: 0; background: linear-gradient(transparent, var(--color-bg-card) 50%); padding-top: 30px; margin-top: -20px;">
                          <div class="bounce-anim" style="font-weight: bold;">↓ Desliza hacia abajo ↓</div>
                      </div>
                  </div>
              </div>"""

if start_idx != -1:
    html_content = html_content[:start_idx] + new_body + html_content[end_idx:]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)


# 2. UPDATE CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Change guide-text border to black
css_content = css_content.replace('border-left: 1px solid currentColor;', 'border-left: 1px solid #000;')

# Change guide-footer color to orange and increase size
css_content = css_content.replace(
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.1rem;
    color: #7B5EA7;""",
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.3rem;
    color: #D4845A;"""
)

# Add bounce animation class if not exists
if '.bounce-anim' not in css_content:
    css_content += """
.bounce-anim {
    animation: bounce 1.5s infinite;
}
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
}
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)


# 3. UPDATE APP.JS
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

old_show_guide = """  showGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.add('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },"""

new_show_guide = """  showGuideCard() {
      const overlay = document.getElementById('guide-overlay');
      if (overlay) {
          overlay.classList.add('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
          
          const modal = overlay.querySelector('.guide-modal');
          const indicator = document.getElementById('guide-scroll-indicator');
          if (modal && indicator) {
              setTimeout(() => {
                  if (modal.scrollHeight > modal.clientHeight + 10) {
                      indicator.style.opacity = '1';
                      modal.onscroll = () => {
                          if (modal.scrollTop + modal.clientHeight >= modal.scrollHeight - 20) {
                              indicator.style.opacity = '0';
                          } else {
                              indicator.style.opacity = '1';
                          }
                      };
                  } else {
                      indicator.style.display = 'none';
                  }
              }, 300);
          }
      }
  },"""

if old_show_guide in js_content:
    js_content = js_content.replace(old_show_guide, new_show_guide)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

print("DONE")