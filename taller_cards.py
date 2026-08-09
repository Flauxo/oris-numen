import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make icon slightly bigger
css = re.sub(
    r'\.achievement-icon\s*\{[^}]+\}',
    '.achievement-icon { width: 40px; height: 40px; flex-shrink: 0; display: flex; justify-content: center; align-items: center; margin-bottom: 4px; position: relative; }',
    css
)

# Restore some gap to the grid
css = re.sub(
    r'\.achievements-grid\s*\{[^}]+\}',
    '.achievements-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 88vh; overflow-y: hidden; padding: 4px; }',
    css
)

# Make the card taller and more spacious
css = re.sub(
    r'\.achievement-card\s*\{[^}]+\}',
    '.achievement-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: transparent; padding: 14px 6px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08); transition: transform 0.2s ease, opacity 0.2s ease; cursor: pointer; text-align: center; box-sizing: border-box; position: relative; height: 100%; }',
    css
)

# Make the modal card explicitly stretch
css = re.sub(
    r'\.achievements-modal\s*\{[^}]+\}',
    '.achievements-modal { max-width: 500px; width: 95%; max-height: 98vh; padding: 16px; height: 95vh; display: flex; flex-direction: column; }',
    css
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated style.css for taller cards")
