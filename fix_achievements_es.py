import re

def fix_text():
    with open('js/translations.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # We will just do direct replace for the known issues in the Spanish achievements section.
    # The previous script might have messed up the encoding by reading utf-8 as latin-1 or similar.
    # Let's fix the specific words in the achievements.
    
    fixes = {
        "\\xA1": "¡",
        "\\xE1": "á",
        "\\xE9": "é",
        "\\xED": "í",
        "\\xF3": "ó",
        "\\xFA": "ú",
        "\\xF1": "ñ",
        "\\xBF": "¿",
        "Ã¡": "á",
        "Ã©": "é",
        "Ã³": "ó",
        "Ã­": "í",
        "Ãº": "ú",
        "Ã±": "ñ",
        "Â¡": "¡",
        "Â¿": "¿",
        "Noctámbulo": "Noctámbulo", # just in case
    }
    
    # Also let's try to just find all occurrences of "menu.achievements": "Logros"
    # and replace the broken characters in that block.
    
    # Wait, the easiest is to do a targeted replace for the known lines in Spanish.
    content = content.replace('"achievements.unlocked_title": "¡NUEVO LOGRO!"', '"achievements.unlocked_title": "¡NUEVO LOGRO!"')
    # Actually, I'll just write a script that decodes mojibake if present
    # Or just replace the exact broken substrings.
    content = content.replace("Ã¡", "á").replace("Ã©", "é").replace("Ã³", "ó").replace("Ã­", "í").replace("Ãº", "ú").replace("Ã±", "ñ").replace("Â¡", "¡").replace("Â¿", "¿").replace("Â«", "«").replace("Â»", "»")
    
    # Let's also fix the ones with unicode escapes if they were literally written like that
    content = content.replace("\\xA1NUEVO", "¡NUEVO").replace("Noct\\xE1mbulo", "Noctámbulo").replace("Magn\\xE9tico", "Magnético").replace("canalizaci\\xF3n", "canalización")
    
    with open('js/translations.js', 'w', encoding='utf-8') as f:
        f.write(content)
        
fix_text()
