import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the download modal logic with the inline links
target_success = '''
              setTimeout(() => {
                  linkDownload.classList.add('show');
              }, 1000); // Wait 1 second, then trigger CSS transition
              
              linkDownload.onclick = (e) => {
                  e.preventDefault();
                  this.downloadSigilImage(text, freq, isEvil, activeElementsCopy);
              };
'''

replacement_success = '''
              setTimeout(() => {
                  linkDownload.classList.add('show');
              }, 1000); // Wait 1 second, then trigger CSS transition
              
              const optionsContainer = document.getElementById('download-options-container');
              const loadingContainer = document.getElementById('inline-loading-container');
              
              if (optionsContainer) optionsContainer.style.display = 'none';
              if (loadingContainer) loadingContainer.style.display = 'none';
              
              linkDownload.onclick = (e) => {
                  e.preventDefault();
                  if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                  linkDownload.style.display = 'none';
                  if (optionsContainer) optionsContainer.style.display = 'flex';
              };
              
              const btnImg = document.getElementById('inline-download-image');
              if (btnImg) {
                  btnImg.onclick = (e) => {
                      e.preventDefault();
                      if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                      if (optionsContainer) optionsContainer.style.display = 'none';
                      this.downloadSigilImage(text, freq, isEvil, activeElementsCopy);
                  };
              }
              
              const btnVid = document.getElementById('inline-download-video');
              if (btnVid) {
                  btnVid.onclick = (e) => {
                      e.preventDefault();
                      if (OrisAudio.playButtonSound) OrisAudio.playButtonSound();
                      if (optionsContainer) optionsContainer.style.display = 'none';
                      if (loadingContainer) loadingContainer.style.display = 'block';
                      this.recordSigilVideo(text, freq, isEvil, activeElementsCopy);
                  };
              }
'''

content = content.replace(target_success.strip(), replacement_success.strip())

# 2. Add recordSigilVideo
with open('js/recordVideoCode.js', 'r', encoding='utf-8') as f:
    video_code = f.read()

# Fix video code to use inline loading and videoGain
video_code = video_code.replace("const loadingOverlay = document.getElementById('loading-overlay');\\n      loadingOverlay.classList.add('active');", "")
video_code = video_code.replace("loadingOverlay.classList.remove('active');", "")

# Replace audio node routing in video_code
target_audio = '''      const destNode = OrisAudio.ctx.createMediaStreamDestination();
      OrisAudio.masterGain.connect(destNode);'''
replacement_audio = '''      const destNode = OrisAudio.ctx.createMediaStreamDestination();
      const videoGain = OrisAudio.ctx.createGain();
      videoGain.gain.setValueAtTime(0, OrisAudio.ctx.currentTime);
      videoGain.gain.linearRampToValueAtTime(1, OrisAudio.ctx.currentTime + 1.2);
      OrisAudio.masterGain.connect(videoGain);
      videoGain.connect(destNode);'''
video_code = video_code.replace(target_audio, replacement_audio)

target_stop_audio = '''OrisAudio.masterGain.disconnect(destNode);'''
replacement_stop_audio = '''
          const loadingContainer = document.getElementById('inline-loading-container');
          if (loadingContainer) loadingContainer.style.display = 'none';
          
          const optionsContainer = document.getElementById('download-options-container');
          if (optionsContainer) optionsContainer.style.display = 'flex';
          
          OrisAudio.masterGain.disconnect(videoGain);
          videoGain.disconnect();
'''
video_code = video_code.replace(target_stop_audio, replacement_stop_audio.strip())

# Fade out before stop
target_settimeout = '''      setTimeout(() => {
          OrisAudio.stopAll();
      }, 9500);'''
replacement_settimeout = '''      setTimeout(() => {
          videoGain.gain.linearRampToValueAtTime(0, OrisAudio.ctx.currentTime + 1.2);
      }, 8300);
      setTimeout(() => {
          OrisAudio.stopAll();
      }, 9500);'''
video_code = video_code.replace(target_settimeout, replacement_settimeout)

# Handle catch errors
video_code_lines = video_code.split('\\n')
video_code_lines.insert(1, '      try {')
for i in range(2, len(video_code_lines)-1):
    video_code_lines[i] = '  ' + video_code_lines[i]

video_code_lines.insert(-1, '''      } catch (err) {
          console.error("Error generating video: ", err);
          const loadingContainer = document.getElementById('inline-loading-container');
          if (loadingContainer) loadingContainer.style.display = 'none';
          const optionsContainer = document.getElementById('download-options-container');
          if (optionsContainer) optionsContainer.style.display = 'flex';
          alert("Error generating video: " + err.message);
      }''')
video_code = '\\n'.join(video_code_lines)


# Insert before the last }; in app.js
content = re.sub(r'\\n};\\s*$', '\\n,\\n' + video_code + '\\n};\\n', content)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch complete")
