import re

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace any single quotes inside the icon strings with double quotes
# A quick way is just to find ACHIEVEMENTS_DATA and fix it.
def fix_svg_quotes(match):
    full_block = match.group(0)
    # find lines like: { id: "init", icon: '<svg ... >', color: "#D4B85A" }
    def fix_line(line_match):
        pre = line_match.group(1)
        svg_content = line_match.group(2)
        post = line_match.group(3)
        # replace single quotes inside svg_content with double quotes
        svg_content = svg_content.replace("'", '"')
        return f"{pre}'{svg_content}'{post}"
    
    fixed_block = re.sub(r'(\{ id: "[^"]+", icon: )\'(.*?)\'(, color: "[^"]+" \})', fix_line, full_block)
    return fixed_block

js = re.sub(r'const ACHIEVEMENTS_DATA = \[.*?\];', fix_svg_quotes, js, flags=re.DOTALL)

with open('js/app_v2.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Fixed quotes in JS")
