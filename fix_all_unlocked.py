import re

# The translations only have 2 languages for unlocked_title (es and en).
# For it and la and zh, we need to add them manually.
# Let's find each language block and add the key there.

with open('js/translations.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add to Italian block
if '"achievements.unlocked": "Obiettivo Sbloccato"' not in code:
    code = code.replace(
        '"achievements.unlocked_title": "NUOVO TRAGUARDO!"',
        '"achievements.unlocked_title": "NUOVO TRAGUARDO!",\n        "achievements.unlocked": "Obiettivo Sbloccato"'
    )
    # fallback: find it block
    if '"achievements.unlocked": "Obiettivo Sbloccato"' not in code:
        code = re.sub(
            r'("it"\s*:\s*\{[^}]*?"achievements\.init\.title")',
            r'\1" fake ', # won't work this way
            code,
            flags=re.DOTALL
        )

# Simpler approach: just add after each language's "achievements.init.title" key
def add_unlocked_after_init(lang, translation, code):
    # Find the block for this lang and add the key after "achievements.init.title"
    pattern = r'("' + lang + r'"\s*:\s*\{[^\{]*?"achievements\.unlocked_title":\s*"[^"]*")'
    replacement = r'\1,\n        "achievements.unlocked": "' + translation + '"'
    new_code = re.sub(pattern, replacement, code, flags=re.DOTALL)
    return new_code

# Only add if not already there
if '"achievements.unlocked": "Obiettivo Sbloccato"' not in code:
    # Find the Italian section
    it_idx = code.find('"it":')
    if it_idx != -1:
        it_block_end = code.find('"la":', it_idx)
        it_block = code[it_idx:it_block_end]
        if '"achievements.unlocked"' not in it_block:
            # Insert after the last "achievements." key in the it block
            insert_after = '"achievements.humble.desc"'
            insert_pos = code.find(insert_after, it_idx)
            if insert_pos != -1:
                # find the end of that line
                line_end = code.find('\n', insert_pos)
                code = code[:line_end] + '\n        "achievements.unlocked": "Obiettivo Sbloccato",' + code[line_end:]

if '"achievements.unlocked": "Reserata Factum"' not in code:
    la_idx = code.find('"la":')
    if la_idx != -1:
        la_block_end = code.find('"zh":', la_idx)
        la_block = code[la_idx:la_block_end]
        if '"achievements.unlocked"' not in la_block:
            insert_after = '"achievements.humble.desc"'
            insert_pos = code.find(insert_after, la_idx)
            if insert_pos != -1:
                line_end = code.find('\n', insert_pos)
                code = code[:line_end] + '\n        "achievements.unlocked": "Reserata Factum",' + code[line_end:]

if '"achievements.unlocked": "\u89e3\u9501\u6210\u5c31"' not in code:
    zh_idx = code.find('"zh":')
    if zh_idx != -1:
        zh_block = code[zh_idx:]
        if '"achievements.unlocked"' not in zh_block[:zh_block.find('};')]:
            insert_after = '"achievements.humble.desc"'
            insert_pos = code.find(insert_after, zh_idx)
            if insert_pos != -1:
                line_end = code.find('\n', insert_pos)
                code = code[:line_end] + '\n        "achievements.unlocked": "\u89e3\u9501\u6210\u5c31",' + code[line_end:]

with open('js/translations.js', 'w', encoding='utf-8') as f:
    f.write(code)

# Verify
matches = re.findall(r'.{0,5}achievements\.unlocked[^_].{0,50}', code)
for m in matches:
    print(m.strip())
