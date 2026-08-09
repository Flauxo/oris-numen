import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Shrink the icon size from 48px to 32px
css = re.sub(
    r'\.achievement-icon\s*\{[^}]+\}',
    '.achievement-icon { width: 32px; height: 32px; flex-shrink: 0; display: flex; justify-content: center; align-items: center; margin-bottom: 2px; position: relative; }',
    css
)

# Shrink the grid gaps
css = re.sub(
    r'\.achievements-grid\s*\{[^}]+\}',
    '.achievements-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; max-height: 90vh; overflow-y: hidden; padding: 2px; }',
    css
)

# Compact the cards further
css = re.sub(
    r'\.achievement-card\s*\{[^}]+\}',
    '.achievement-card { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 2px; background: transparent; padding: 6px 4px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); transition: transform 0.2s ease, opacity 0.2s ease; cursor: pointer; text-align: center; box-sizing: border-box; position: relative; }',
    css
)

# Make the title text slightly smaller
css = re.sub(
    r'\.achievement-title\s*\{[^}]+\}',
    '.achievement-title { font-family: var(--font-serif); font-size: 0.85rem; color: rgba(0,0,0,0.7); font-weight: 500; margin: 0; line-height: 1.1; }',
    css
)

# Ensure the modal is large enough but tight on padding
css = re.sub(
    r'\.achievements-modal\s*\{[^}]+\}',
    '.achievements-modal { max-width: 500px; width: 95%; max-height: 98vh; padding: 12px; }',
    css
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated style.css for no scroll")
