  recordSigilVideo(text, freq, isEvil, activeElementsSet) {
      try {
          const loadingContainer = document.getElementById('inline-loading-container');
          const optionsContainer = document.getElementById('download-options-container');
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      const fps = 30;
      const durationSec = 10;
      const totalFrames = fps * durationSec;
      
      const stream = canvas.captureStream(fps);
      
      const destNode = OrisAudio.ctx.createMediaStreamDestination();
      const videoGain = OrisAudio.ctx.createGain();
      videoGain.gain.setValueAtTime(0, OrisAudio.ctx.currentTime);
      videoGain.gain.linearRampToValueAtTime(1, OrisAudio.ctx.currentTime + 1.2);
      OrisAudio.masterGain.connect(videoGain);
      videoGain.connect(destNode);
      const audioTracks = destNode.stream.getAudioTracks();
      if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
      }
      
      OrisAudio.startFrequencyPad(freq.audioHz || freq.hz);
      const elsArray = Array.from(activeElementsSet || this.activeElements);
      elsArray.forEach(el => OrisAudio.startElementNoise(el));
      
      setTimeout(() => {
          videoGain.gain.linearRampToValueAtTime(0, OrisAudio.ctx.currentTime + 1.2);
      }, 8300);
      setTimeout(() => {
          OrisAudio.stopAll();
      }, 9500);
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) mimeType = 'video/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
      const chunks = [];
      mediaRecorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
          if (loadingContainer) loadingContainer.style.display = 'none';
          if (optionsContainer) optionsContainer.style.display = 'flex';
          
          OrisAudio.masterGain.disconnect(videoGain);
          videoGain.disconnect();
          
          const blob = new Blob(chunks, { type: mimeType });
          const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';
          const dateStr = new Date().toLocaleDateString('en-CA').replace(/\//g, '-');
          const fileName = `OrisNumen-Sigil-${dateStr}.${ext}`;
          
          if (window.AndroidInterface && window.AndroidInterface.saveVideoBase64) {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                  const successMsg = Translations[this.currentLang]['success.video_saved'] || "Video guardado en Galería";
                  const errorMsg = Translations[this.currentLang]['error.video_saved'] || "Error al guardar video";
                  window.AndroidInterface.saveVideoBase64(reader.result, fileName, successMsg, errorMsg);
              };
          } else {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              link.click();
              URL.revokeObjectURL(url);
          }
      };

      mediaRecorder.start();
      
      let frame = 0;
      const renderFrame = () => {
          if (frame >= totalFrames) {
              mediaRecorder.stop();
              return;
          }
          
          const t = frame / totalFrames;
          
          ctx.fillStyle = isEvil ? '#110000' : '#0B0B0B';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          let titleAlpha = Math.min(1.0, t / 0.2);
          ctx.globalAlpha = titleAlpha;
          ctx.textAlign = 'center';
          ctx.font = '300 120px "Cormorant Garamond", serif';
          ctx.fillStyle = isEvil ? '#CC0000' : '#FFFFFF';
          ctx.fillText("ORIS NUMEN", canvas.width / 2, 220);
          
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#777777';
          const canvasSubtitle = Translations[this.currentLang]['success.share_channeling'] || "Comparte tu canalización";
          ctx.fillText(canvasSubtitle, canvas.width / 2, 300);
          ctx.globalAlpha = 1.0;
          
          const sigilProgress = Math.min(1.0, t / 0.8);
          if (typeof SigilGenerator !== 'undefined') {
              SigilGenerator.draw(ctx, canvas.width / 2, 670, 300, text, freq.color, isEvil, sigilProgress);
          }
          
          let yPos = 1040;
          
          let dataAlpha = Math.max(0, Math.min(1.0, (t - 0.3) / 0.2));
          ctx.globalAlpha = dataAlpha;
          const prayerType = (Translations[this.currentLang][`card.${this.currentFrequency}.desc`] || "Canalización Espiritual").toUpperCase();
          ctx.font = '500 38px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#990000' : '#4A4A4A';
          ctx.fillText(prayerType, canvas.width / 2, yPos);
          yPos += 60;
          
          ctx.font = '700 55px "Inter", sans-serif';
          ctx.fillStyle = freq.color;
          ctx.fillText(`${freq.name} (${freq.hz || freq.audioHz} Hz)`, canvas.width / 2, yPos);
          yPos += 75;
          
          if (elsArray.length > 0) {
              const elementColors = { 'aire': '#5CE1E6', 'agua': '#0057FF', 'fuego': '#FF3131', 'tierra': '#7ED957' };
              let prefixStr = "Elementos: ";
              if (this.currentLang === 'en') prefixStr = "Elements: ";
              if (this.currentLang === 'it') prefixStr = "Elementi: ";
              if (this.currentLang === 'la') prefixStr = "Elementa: ";
              const prefixW = ctx.measureText(prefixStr).width;
              let totalWidth = prefixW;
              const parts = [];
              for (let i = 0; i < elsArray.length; i++) {
                  const el = elsArray[i];
                  let elText = (Translations[this.currentLang][`elements.${el}`] || el).toLowerCase();
                  if (i < elsArray.length - 1) {
                      let andStr = " y ";
                      if (this.currentLang === 'en') andStr = " and ";
                      if (this.currentLang === 'it') andStr = " e ";
                      if (this.currentLang === 'la') andStr = " et ";
                      elText += andStr;
                  }
                  const w = ctx.measureText(elText).width;
                  parts.push({ text: elText, color: elementColors[el] || '#666', width: w });
                  totalWidth += w;
              }
              let currentX = canvas.width / 2 - totalWidth / 2;
              ctx.textAlign = 'left';
              ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
              ctx.fillText(prefixStr, currentX, yPos);
              currentX += prefixW;
              for (const p of parts) {
                  ctx.fillStyle = p.color;
                  ctx.fillText(p.text, currentX, yPos);
                  currentX += p.width;
              }
              ctx.textAlign = 'center';
          } else {
              ctx.font = '700 35px "Inter", sans-serif';
              ctx.fillStyle = '#6A6A6A';
              let noneText = "Elementos: Ninguno";
              if (this.currentLang === 'en') noneText = "Elements: None";
              if (this.currentLang === 'it') noneText = "Elementi: Nessuno";
              if (this.currentLang === 'la') noneText = "Elementa: Nulla";
              ctx.fillText(noneText, canvas.width / 2, yPos);
          }
          yPos += 65;
          
          ctx.font = '400 35px "Inter", sans-serif';
          ctx.fillStyle = isEvil ? '#660000' : '#6A6A6A';
          const timeStr = ChannelTimer.formatTime(ChannelTimer.duration);
          const dateStr = new Date().toLocaleDateString(this.currentLang);
          let durPrefix = "Duración"; let datePrefix = "Fecha";
          if (this.currentLang === 'en') { durPrefix = "Duration"; datePrefix = "Date"; }
          if (this.currentLang === 'it') { durPrefix = "Durata"; datePrefix = "Data"; }
          if (this.currentLang === 'la') { durPrefix = "Tempus"; datePrefix = "Dies"; }
          ctx.fillText(`${durPrefix}: ${timeStr}       ${datePrefix}: ${dateStr}`, canvas.width / 2, yPos);
          yPos += 65;
          
          ctx.strokeStyle = isEvil ? '#440000' : '#CCCCCC';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 400, yPos);
          ctx.lineTo(canvas.width / 2 + 400, yPos);
          ctx.stroke();
          yPos += 120;
          
          let explAlpha = Math.max(0, Math.min(1.0, (t - 0.6) / 0.2));
          ctx.globalAlpha = explAlpha;
          ctx.font = 'italic 50px "Cormorant Garamond", serif';
          ctx.fillStyle = isEvil ? '#550000' : '#333333';
          const explText = Translations[this.currentLang]['success.sigil_explanation'] || "";
          
          const wrapTextJustified = (context, text, x, y, maxWidth, lineHeight) => {
              context.textAlign = 'left';
              const paragraphs = text.split('\n');
              const regularFont = 'italic 50px "Cormorant Garamond", serif';
              const boldFont = 'bold italic 50px "Cormorant Garamond", serif';
              for (const p of paragraphs) {
                  const words = p.split(' ');
                  const lines = [];
                  let currentLine = [];
                  let currentWidth = 0;
                  for (let w of words) {
                      let isBold = false;
                      if (w.startsWith('**') && w.endsWith('**')) {
                          isBold = true;
                          w = w.substring(2, w.length - 2);
                      }
                      context.font = isBold ? boldFont : regularFont;
                      const wordWidth = context.measureText(w).width;
                      if (currentWidth + wordWidth + (currentLine.length * 10) > maxWidth && currentLine.length > 0) {
                          lines.push(currentLine);
                          currentLine = [];
                          currentWidth = 0;
                      }
                      currentLine.push({ text: w, bold: isBold, width: wordWidth });
                      currentWidth += wordWidth;
                  }
                  if (currentLine.length > 0) lines.push(currentLine);
                  for (let j = 0; j < lines.length; j++) {
                      const lineWords = lines[j];
                      if (j === lines.length - 1 || lineWords.length === 1) {
                          let currentX = x;
                          for (let i = 0; i < lineWords.length; i++) {
                              context.font = lineWords[i].bold ? boldFont : regularFont;
                              context.fillText(lineWords[i].text, currentX, y);
                              currentX += lineWords[i].width + context.measureText(" ").width;
                          }
                      } else {
                          const totalTextWidth = lineWords.reduce((sum, w) => sum + w.width, 0);
                          const spaceRemaining = maxWidth - totalTextWidth;
                          const spaceWidth = spaceRemaining / (lineWords.length - 1);
                          let currentX = x;
                          for (let i = 0; i < lineWords.length; i++) {
                              context.font = lineWords[i].bold ? boldFont : regularFont;
                              context.fillText(lineWords[i].text, currentX, y);
                              currentX += lineWords[i].width + spaceWidth;
                          }
                      }
                      y += lineHeight;
                  }
              }
              context.textAlign = 'center';
          };
          wrapTextJustified(ctx, explText, canvas.width / 2 - 425, yPos, 850, 60);
          
          ctx.globalAlpha = 1.0;
          
          frame++;
          requestAnimationFrame(renderFrame);
      };
      
      renderFrame();
      } catch (err) {
          console.error("Error generating video: ", err);
          const loadingContainer = document.getElementById('inline-loading-container');
          if (loadingContainer) loadingContainer.style.display = 'none';
          const optionsContainer = document.getElementById('download-options-container');
          if (optionsContainer) optionsContainer.style.display = 'flex';
          alert("Error generating video: " + err.message);
      }
  }
