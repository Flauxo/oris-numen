import re

with open('js/universe-messages.js', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'\"lang\"\s*:\s*\"es\",\s*\"country\"\s*:\s*\"([^\"]+)\",\s*\"text\"\s*:\s*\"(.*?)\"', content, re.IGNORECASE)
matches2 = re.findall(r'lang\s*:\s*\'es\',\s*country\s*:\s*\'([^\']+)\',\s*text\s*:\s*\'(.*?)\'', content, re.IGNORECASE)

all_matches = matches + matches2

with open('es_messages.md', 'w', encoding='utf-8') as f:
    f.write(\"# Mensajes del Universo en Español\n\n\")
    for m in all_matches:
        f.write(f\"- **{m[0]}**: {m[1]}\n\")
print(f'Found {len(all_matches)} messages.')
