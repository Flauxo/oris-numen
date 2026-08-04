import os
from PIL import Image, ImageDraw

def create_icons(source_image_path):
    if not os.path.exists(source_image_path):
        print(f"Error: {source_image_path} not found.")
        return

    try:
        img = Image.open(source_image_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Android icon sizes
    sizes = {
        'mdpi': 48,
        'hdpi': 72,
        'xhdpi': 96,
        'xxhdpi': 144,
        'xxxhdpi': 192
    }

    base_res_path = os.path.join("android", "app", "src", "main", "res")

    for density, size in sizes.items():
        mipmap_dir = os.path.join(base_res_path, f"mipmap-{density}")
        os.makedirs(mipmap_dir, exist_ok=True)
        
        # 1. Square icon (ic_launcher.png)
        square_img = img.resize((size, size), Image.Resampling.LANCZOS)
        square_path = os.path.join(mipmap_dir, "ic_launcher.png")
        square_img.save(square_path, "PNG")
        
        # 2. Round icon (ic_launcher_round.png)
        # Create a circular mask
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        round_img = square_img.copy()
        round_img.putalpha(mask)
        
        round_path = os.path.join(mipmap_dir, "ic_launcher_round.png")
        round_img.save(round_path, "PNG")
        
        print(f"Generated {density} icons ({size}x{size})")

if __name__ == "__main__":
    create_icons("new_icon.png")
