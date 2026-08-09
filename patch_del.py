import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("wrapper.className = 'history-item';", "wrapper.className = 'history-item';\n          wrapper.setAttribute('data-id', item.id);")

old_del = '''  deleteHistoryItem(id) {
      try {
          let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
          history = history.filter(item => item.id !== id);
          localStorage.setItem('oris_history', JSON.stringify(history));
          this.renderHistory();
      } catch (e) {}
  },'''

new_del = '''  deleteHistoryItem(id) {
      try {
          const el = document.querySelector(`.history-item[data-id="${id}"]`);
          if (el) {
              try { OrisAudio.playEvilSound(); } catch (e) {}
              el.style.animation = 'dissolve-anim-fast 1s forwards';
              setTimeout(() => {
                  let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
                  history = history.filter(item => item.id !== id);
                  localStorage.setItem('oris_history', JSON.stringify(history));
                  this.renderHistory();
              }, 1000);
          } else {
              let history = JSON.parse(localStorage.getItem('oris_history') || '[]');
              history = history.filter(item => item.id !== id);
              localStorage.setItem('oris_history', JSON.stringify(history));
              this.renderHistory();
          }
      } catch (e) {}
  },'''

content = content.replace(old_del, new_del)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done patching.")
