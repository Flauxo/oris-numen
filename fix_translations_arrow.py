import re

with open('js/translations.js', 'r', encoding='utf-8') as f:
    js = f.read()

# The corrupted char might be '\ufffd' or '' or something similar.
# Let's search for it in 'btn.back'
# Actually, I can just replace the whole line: "back": " Volver" or "back": " Back"
# Let's just do a regex replace for "back": ".*?(Volver|Back|Retour|Zur.*|Torna).*"
# or simply replace '' with '&larr;' globally, but it's safer to target the exact keys.

def fix_back(match):
    val = match.group(2)
    # remove any leading weird chars, keep the word
    word = re.sub(r'^[^\w\s]+', '', val).strip()
    return f'"{match.group(1)}": "&larr; {word}"'

js = re.sub(r'"(back)"\s*:\s*"(.*?)"', fix_back, js)
js = re.sub(r"'(back)'\s*:\s*'(.*?)'", fix_back, js)

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed translations.js back arrow")
