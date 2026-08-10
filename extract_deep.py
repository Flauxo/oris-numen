import codecs
import re

with codecs.open('generate_deep_messages.py', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\"lang\": \"es\", \"country\": \"(.*?)\", \"text\": \"(.*?)\"\}', text)

md_content = '# Nuevos Mensajes Profundos en Español\n\n'
for m in matches:
    md_content += f'- **{m[0]}**: {m[1]}\n'

with codecs.open('C:/Users/Kivan/.gemini/antigravity/brain/12cfd10f-b6b4-49f3-8c5f-79330e256c3e/mensajes_profundos_es.md', 'w', encoding='utf-8') as f:
    f.write(md_content)
