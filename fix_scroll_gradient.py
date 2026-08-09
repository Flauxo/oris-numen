import json

html_path = "index.html"

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

old_style = 'id="guide-scroll-indicator" style="position: sticky; bottom: -10px; text-align: center; color: #7B5EA7; pointer-events: none; transition: opacity 0.3s ease; opacity: 0; background: linear-gradient(transparent, var(--color-bg-card) 50%); padding-top: 30px; margin-top: -20px;"'
new_style = 'id="guide-scroll-indicator" style="position: sticky; bottom: -25px; margin-left: -24px; margin-right: -24px; text-align: center; color: #7B5EA7; pointer-events: none; transition: opacity 0.3s ease; opacity: 0; background: linear-gradient(to bottom, transparent 0%, var(--color-bg-card) 40%, var(--color-bg-card) 100%); padding-top: 40px; padding-bottom: 25px; margin-top: -30px; border-radius: 0 0 var(--radius-lg) var(--radius-lg);"'

if old_style in html_content:
    html_content = html_content.replace(old_style, new_style)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("DONE")
else:
    print("NOT FOUND")