import os
from PIL import Image

img_path = r'C:\Users\Kivan\.gemini\antigravity\brain\126eca1c-e8ad-4ece-81c3-8f7fa7428734\.user_uploaded\media_1786184833916.jpg'
img = Image.open(img_path)
width, height = img.size

# 2 cols, 5 rows
col_w = width / 2.0
row_h = height / 5.0

# We want to crop just the icon part. The cell is 312x204.
# The icon is in the upper middle.
# Let's define a crop box relative to the cell center-top.
# Icon width approx 160, height approx 140.
icon_w = 160
icon_h = 160
offset_y = 15  # from top of the cell

out_dir = os.path.join('android', 'app', 'src', 'main', 'assets', 'img', 'achievements')
os.makedirs(out_dir, exist_ok=True)
# also save to local folder for web testing
local_dir = os.path.join('assets', 'img', 'achievements')
os.makedirs(local_dir, exist_ok=True)

ids = [
    "init", "early",
    "night", "fifty",
    "moon", "alchemist",
    "compassive", "grateful",
    "sincere", "humble"
]

idx = 0
for r in range(5):
    for c in range(2):
        x0 = c * col_w
        y0 = r * row_h
        
        # Center of the column
        cx = x0 + col_w / 2.0
        
        box = (
            int(cx - icon_w/2),
            int(y0 + offset_y),
            int(cx + icon_w/2),
            int(y0 + offset_y + icon_h)
        )
        
        icon_img = img.crop(box)
        
        # We can also make the white background transparent using some threshold if we wanted to,
        # but since the app background is off-white (#FAF8F5), keeping it as JPG or PNG with bg is fine.
        # But wait! The card in the app has a transparent background `background: transparent`.
        # If we save as PNG, it will have the white/off-white background from the image. 
        # We can apply a blend mode in CSS like `mix-blend-mode: multiply` to make the white background disappear!
        
        file_name = f"{ids[idx]}.png"
        icon_img.save(os.path.join(out_dir, file_name))
        icon_img.save(os.path.join(local_dir, file_name))
        
        idx += 1

print("Successfully cropped and saved 10 icons.")
