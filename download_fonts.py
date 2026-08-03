import urllib.request
import re
import os

css_url = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
fonts_dir = "css/fonts"
css_path = "css/fonts.css"

if not os.path.exists(fonts_dir):
    os.makedirs(fonts_dir)

req = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'})
with urllib.request.urlopen(req) as response:
    css_data = response.read().decode('utf-8')

url_regex = re.compile(r'url\((https://[^)]+)\)')
matches = url_regex.findall(css_data)

new_css_data = css_data
font_counter = 0

for font_url in matches:
    ext = ".woff2" # Google fonts usually serves woff2 for this user agent
    font_name = f"font_{font_counter}{ext}"
    font_path = os.path.join(fonts_dir, font_name)
    
    # Replace url in CSS
    new_css_data = new_css_data.replace(font_url, f"fonts/{font_name}")
    
    # Download font
    print(f"Downloading {font_name}...")
    urllib.request.urlretrieve(font_url, font_path)
    font_counter += 1

with open(css_path, "w", encoding='utf-8') as f:
    f.write(new_css_data)

print("Fonts downloaded successfully.")
