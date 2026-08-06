import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

with open('js/recordVideoCode.js', 'r', encoding='utf-8') as f:
    video_code = f.read()

video_code = video_code.replace("const loadingOverlay = document.getElementById('loading-overlay');\\n      loadingOverlay.classList.add('active');", "")
video_code = video_code.replace("loadingOverlay.classList.remove('active');", "")

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

# Add try...catch wrapping the entire function body!
func_body_start = video_code.find('{') + 1
func_body = video_code[func_body_start:].rsplit('}', 1)[0]
wrapped_body = '''
      try {''' + func_body + '''
      } catch (err) {
          console.error("Error generating video: ", err);
          const loadingContainer = document.getElementById('inline-loading-container');
          if (loadingContainer) loadingContainer.style.display = 'none';
          const optionsContainer = document.getElementById('download-options-container');
          if (optionsContainer) optionsContainer.style.display = 'flex';
          alert("Error generating video: " + err.message);
      }'''

video_code = video_code[:func_body_start] + wrapped_body + "\\n  },"

parts = content.rsplit("};\\n\\n// Initialize", 1)
content = parts[0] + ",\\n\\n" + video_code + "\\n};\\n\\n// Initialize" + parts[1]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("App patched carefully!")
