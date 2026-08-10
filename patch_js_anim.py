import codecs

old_js = '''            btnSendGratitude.addEventListener('click', () => {
                btnSendGratitude.style.display = 'none';
                textGratitudeSent.style.display = 'block';
            });'''
            
new_js = '''            btnSendGratitude.addEventListener('click', () => {
                btnSendGratitude.style.display = 'none';
                textGratitudeSent.style.display = 'block';
                // Trigger reflow
                void textGratitudeSent.offsetWidth;
                textGratitudeSent.style.opacity = '1';
                
                // Fade out after 2 seconds
                setTimeout(() => {
                    textGratitudeSent.style.opacity = '0';
                    // Hide completely after transition (0.5s)
                    setTimeout(() => {
                        textGratitudeSent.style.display = 'none';
                    }, 500);
                }, 2000);
            });'''

with codecs.open('js/app_v2.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(old_js, new_js)

# I should also ensure that when the universe message modal is opened, textGratitudeSent is reset properly (opacity 0, display none).
# In showUniverseMessage:
old_reset = '''        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude) btnSendGratitude.style.display = 'block';
        if (textGratitudeSent) textGratitudeSent.style.display = 'none';'''
        
new_reset = '''        const btnSendGratitude = document.getElementById('btn-send-gratitude');
        const textGratitudeSent = document.getElementById('text-gratitude-sent');
        if (btnSendGratitude) btnSendGratitude.style.display = 'block';
        if (textGratitudeSent) {
            textGratitudeSent.style.opacity = '0';
            textGratitudeSent.style.display = 'none';
        }'''

content = content.replace(old_reset, new_reset)

with codecs.open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched app_v2.js")
