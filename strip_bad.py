with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split(",\\n\\n  recordSigilVideo(text, freq, isEvil, activeElementsSet) {")
if len(parts) > 1:
    content = parts[0] + "};\\n\\n// Initialize when DOM is ready\\ndocument.addEventListener('DOMContentLoaded', () => OrisApp.init());\\n"
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Stripped bad recordSigilVideo")
else:
    print("Could not find recordSigilVideo to strip")
