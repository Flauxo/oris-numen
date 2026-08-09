import re
import shutil

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. prefixStr
text = re.sub(
    r'let prefixStr = "Elementos: ";\s*if \(this\.currentLang === \'en\'\) prefixStr = "Elements: ";\s*if \(this\.currentLang === \'it\'\) prefixStr = "Elementi: ";\s*if \(this\.currentLang === \'la\'\) prefixStr = "Elementa: ";',
    r'let prefixStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.elements"]) || "Elementos: ";',
    text
)

# 2. andStr
text = re.sub(
    r'let andStr = " y ";\s*if \(this\.currentLang === \'en\'\) andStr = " and ";\s*if \(this\.currentLang === \'it\'\) andStr = " e ";\s*if \(this\.currentLang === \'la\'\) andStr = " et ";',
    r'let andStr = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.and"]) || " y ";',
    text
)

# 3. noneText
text = re.sub(
    r'let noneText = "Elementos: Ninguno";\s*if \(this\.currentLang === \'en\'\) noneText = "Elements: None";\s*if \(this\.currentLang === \'it\'\) noneText = "Elementi: Nessuno";\s*if \(this\.currentLang === \'la\'\) noneText = "Elementa: Nulla";',
    r'let noneText = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.none"]) || "Elementos: Ninguno";',
    text
)

# 4. durPrefix & datePrefix (varies slightly)
# We can catch both variations by matching the durPrefix assignment and the 3 lines of ifs.
text = re.sub(
    r'let durPrefix = "Duraci[^"]*";\s*(let datePrefix = "Fecha";)?\s*if \(this\.currentLang === \'en\'\) \{ durPrefix = "Duration"; datePrefix = "Date"; \}\s*if \(this\.currentLang === \'it\'\) \{ durPrefix = "Durata"; datePrefix = "Data"; \}\s*if \(this\.currentLang === \'la\'\) \{ durPrefix = "Tempus"; datePrefix = "Dies"; \}',
    r'let durPrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.duration"]) || "Duración";\n          let datePrefix = (Translations[this.currentLang] && Translations[this.currentLang]["sigil.date"]) || "Fecha";',
    text
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

shutil.copy('js/app.js', 'android/app/src/main/assets/js/app.js')

print("app.js patched.")
