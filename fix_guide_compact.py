import json
import re

html_path = "index.html"
css_path = "css/style.css"

# 1. Update HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Change title font-size and margin-bottom
html_content = html_content.replace(
    'font-size: 2.2rem; font-weight: 500; text-align: left; line-height: 1.1; margin-bottom: 24px;" data-i18n="guide.title">',
    'font-size: 1.8rem; font-weight: 500; text-align: left; line-height: 1.1; margin-bottom: 12px;" data-i18n="guide.title">'
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)


# 2. Update CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace(
    """.guide-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #EAE5DF;
}""",
    """.guide-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #EAE5DF;
}"""
)

css_content = css_content.replace(
    """.guide-item:last-of-type {
    border-bottom: none;
    margin-bottom: 16px;
    padding-bottom: 0;
}""",
    """.guide-item:last-of-type {
    border-bottom: none;
    margin-bottom: 8px;
    padding-bottom: 0;
}"""
)

css_content = css_content.replace(
    """.guide-number {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    font-weight: 500;
    width: 50px;
    flex-shrink: 0;
    text-align: center;
}""",
    """.guide-number {
    font-family: var(--font-serif);
    font-size: 1.8rem;
    font-weight: 500;
    width: 44px;
    flex-shrink: 0;
    text-align: center;
}"""
)

css_content = css_content.replace(
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.3rem;
    color: #7B5EA7;
    margin-top: 32px;""",
    """.guide-footer {
    text-align: center;
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.3rem;
    color: #7B5EA7;
    margin-top: 16px;"""
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("DONE")