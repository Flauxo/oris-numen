import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update saveToHistory
save_old = '''          localStorage.setItem('oris_history', JSON.stringify(history));
      } catch (e) {'''
save_new = '''          localStorage.setItem('oris_history', JSON.stringify(history));
          
          let totalChannelings = parseInt(localStorage.getItem('oris_total_channelings') || '0', 10);
          totalChannelings++;
          localStorage.setItem('oris_total_channelings', totalChannelings);
      } catch (e) {'''
text = text.replace(save_old, save_new)

# 2. Add evolution card logic after closeHistoryCard
hist_old = '''  closeHistoryCard() {
      const overlay = document.getElementById('history-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },'''

evol_new = '''  closeHistoryCard() {
      const overlay = document.getElementById('history-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
  },

  evolutionAnimId: null,

  openEvolutionCard() {
      const overlay = document.getElementById('evolution-overlay');
      if (overlay) {
          overlay.classList.add('active');
          if (typeof this.closeSidebar === 'function') this.closeSidebar();
          try { OrisAudio.playButtonSound(); } catch(e){}
          
          let totalChannelings = parseInt(localStorage.getItem('oris_total_channelings') || '0', 10);
          
          const t = Translations[this.currentLang] || Translations['en'];
          const countDisplay = document.getElementById('evolution-count-display');
          if (countDisplay) {
              const formatStr = t['evolution.count'] || "Número de canalizaciones: {count}";
              countDisplay.textContent = formatStr.replace('{count}', totalChannelings);
          }
          
          const canvas = document.getElementById('evolution-canvas');
          if (canvas) {
              this.drawEvolutionMandala(canvas, totalChannelings);
          }
      }
  },

  closeEvolutionCard() {
      const overlay = document.getElementById('evolution-overlay');
      if (overlay) {
          overlay.classList.remove('active');
          try { OrisAudio.playButtonSound(); } catch(e){}
      }
      if (this.evolutionAnimId) {
          cancelAnimationFrame(this.evolutionAnimId);
          this.evolutionAnimId = null;
      }
  },

  drawEvolutionMandala(canvas, count) {
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      let start = performance.now();
      
      // Colors from 4 frequencies: gold/beige, blue/cyan, purple/magenta, red/dark
      const colors = ['#D4AF37', '#00FFFF', '#8A2BE2', '#FF4500', '#F8EFE4', '#4169E1', '#FF00FF', '#8B0000'];
      
      const draw = () => {
          const now = performance.now();
          const elapsed = (now - start) / 1000;
          
          // Clear background
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Breathing pulse
          const pulse = 1.0 + 0.05 * Math.sin(elapsed * 2);
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(pulse, pulse);
          
          // Draw seed
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 20;
          ctx.fill();
          
          // Draw layers based on count
          const maxLayers = Math.min(count, 30); // Prevent infinity
          for (let i = 1; i <= maxLayers; i++) {
              ctx.save();
              // Randomish but deterministic properties per layer
              const layerColor = colors[(i * 7) % colors.length];
              const sides = 2 + (i % 8); // 2(line), 3(tri), 4(sq), etc
              const radius = 20 + i * 15;
              const rotationDir = (i % 2 === 0) ? 1 : -1;
              const rotationSpeed = 0.5 - (i * 0.01);
              
              ctx.rotate(elapsed * rotationSpeed * rotationDir + (i * 0.5));
              
              ctx.beginPath();
              if (sides === 2) {
                  ctx.arc(0, 0, radius, 0, Math.PI * 2);
              } else {
                  for (let s = 0; s < sides; s++) {
                      const angle = (s * Math.PI * 2) / sides;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      if (s === 0) ctx.moveTo(x, y);
                      else ctx.lineTo(x, y);
                  }
                  ctx.closePath();
              }
              
              ctx.strokeStyle = layerColor;
              ctx.lineWidth = 1.5;
              ctx.shadowColor = layerColor;
              ctx.shadowBlur = 10;
              ctx.stroke();
              
              // Draw nodes
              if (sides > 2) {
                  for (let s = 0; s < sides; s++) {
                      const angle = (s * Math.PI * 2) / sides;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      ctx.beginPath();
                      ctx.arc(x, y, 3, 0, Math.PI * 2);
                      ctx.fillStyle = layerColor;
                      ctx.fill();
                  }
              }
              ctx.restore();
          }
          
          ctx.restore();
          this.evolutionAnimId = requestAnimationFrame(draw);
      };
      
      if (this.evolutionAnimId) cancelAnimationFrame(this.evolutionAnimId);
      this.evolutionAnimId = requestAnimationFrame(draw);
  },'''
text = text.replace(hist_old, evol_new)

# 3. Add Event Listeners in initUI()
init_old = '''    const btnTestimonials = document.getElementById('menu-item-testimonials');
    if (btnTestimonials) {
        btnTestimonials.addEventListener('click', (e) => {
            e.preventDefault();
            this.openTestimonials();
        });
    }'''

init_new = '''    const btnTestimonials = document.getElementById('menu-item-testimonials');
    if (btnTestimonials) {
        btnTestimonials.addEventListener('click', (e) => {
            e.preventDefault();
            this.openTestimonials();
        });
    }

    const btnEvolution = document.getElementById('menu-item-evolution');
    if (btnEvolution) {
        btnEvolution.addEventListener('click', (e) => {
            e.preventDefault();
            this.openEvolutionCard();
        });
    }

    const btnCloseEvolution = document.getElementById('btn-close-evolution');
    if (btnCloseEvolution) {
        btnCloseEvolution.addEventListener('click', () => this.closeEvolutionCard());
    }'''
text = text.replace(init_old, init_new)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("app.js patched.")
