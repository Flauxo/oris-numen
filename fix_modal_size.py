import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix the modal height
css = re.sub(
    r'\.achievements-modal\s*\{[^}]+\}',
    '.achievements-modal { max-width: 500px; width: 95%; max-height: 98vh; padding: 12px; height: auto; display: flex; flex-direction: column; }',
    css
)

# Fix the grid height and overflow
css = re.sub(
    r'\.achievements-grid\s*\{[^}]+\}',
    '.achievements-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; height: auto; padding: 4px; overflow: visible; }',
    css
)

# Make the cards slightly smaller to ensure they fit in the auto height without going off screen
css = re.sub(
    r'\.achievement-card\s*\{[^}]+\}',
    '.achievement-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: transparent; padding: 10px 4px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08); transition: transform 0.2s ease, opacity 0.2s ease; cursor: pointer; text-align: center; box-sizing: border-box; position: relative; }',
    css
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated style.css for exact fit")
