import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Hide description
css = re.sub(
    r'\.achievements-desc\s*\{[^}]+\}',
    '.achievements-desc { display: none; }',
    css
)

# Expand grid height, reduce gap
css = re.sub(
    r'\.achievements-grid\s*\{[^}]+\}',
    '.achievements-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; max-height: 85vh; overflow-y: auto; padding: 2px; }',
    css
)

# Expand modal to fit
css = re.sub(
    r'\.achievements-modal\s*\{[^}]+\}',
    '.achievements-modal { max-width: 500px; width: 95%; max-height: 96vh; padding: 12px; }',
    css
)

# Compact the cards
css = re.sub(
    r'\.achievement-card\s*\{[^}]+\}',
    '.achievement-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: rgba(0,0,0,0.03); padding: 8px 4px; border-radius: var(--radius-md); border: 1px solid rgba(0,0,0,0.05); transition: transform 0.2s ease, opacity 0.2s ease; cursor: pointer; text-align: center; box-sizing: border-box; }',
    css
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated style.css")
