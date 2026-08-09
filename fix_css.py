with open('css/style.css', 'rb') as f:
    content = f.read()

# Try decoding as utf-8, ignore errors
text = content.decode('utf-8', 'ignore')

# Remove the broken keyframes at the end by finding the last valid rule
idx = text.rfind('::-webkit-scrollbar-thumb')
if idx != -1:
    idx2 = text.find('}', idx)
    if idx2 != -1:
        text = text[:idx2+1] + '\n\n@keyframes spin {\n  100% { transform: rotate(360deg); }\n}\n'

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(text)

print("CSS fixed")
