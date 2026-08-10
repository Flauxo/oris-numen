import base64
import os

# A 24x24 transparent PNG with a white circle
base64_png = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnCAoMExxJ+h1KAAAAw0lEQVQ4y2NgGAWjYBSMAlwAhYmRgUGBgYEh/v8/U1Kz/2cWZjYGRgYGAxL1E6s/Xp+RgYmBkYGDgeH/f4bz//9L2B+vL3h9BgYhBgYGZmI0jAJqAB3q32dgiP9/B+b8////f2J8/v/P4P///wxCDAwMzH+J9f3/P4P//zAwCP3/w8AgjOxzBnYGBgaGf2D9P4kI+5+BIYBBkYGB4R8DQ/z/f7B+U1Kz/z9zMLMxMDL8Y2Aw/P+f4T+xYf//HwWjYBTABQClX0Fm70hRtwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wOC0xMFQxMjoxOToyOCswMDowMDtE9aAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDgtMTBUMTI6MTk6MjgrMDA6MDA+02hRAAAAAElFTkSuQmCC"

# This is just a placeholder base64. Let me create a more reliable one.
# A tiny transparent PNG with a white dot in the center.
tiny_dot = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEVYdEVYdFNvZnR3YXJlAE1BQyBPUyBYIEFwcGxlIENvbXB1dGVyLCBJbmMuK2w1cQAAABl0RVh0Q3JlYXRpb24gVGltZQAwOC8xMC8yMDI25yY18QAAAClJREFUSIljYBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBQMFwAAUAAAx2z+UAAAAABJRU5ErkJggg=="

# Let's generate a proper circle using PIL if available, else fallback
try:
    from PIL import Image, ImageDraw
    img = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Draw a white circle
    draw.ellipse((10, 10, 38, 38), outline="white", width=4)
    # Draw an inner white circle
    draw.ellipse((18, 18, 30, 30), fill="white")
    
    os.makedirs('android/app/src/main/res/drawable', exist_ok=True)
    img.save('android/app/src/main/res/drawable/ic_notification.png')
    print("Created ic_notification.png using PIL")
except ImportError:
    # fallback to base64
    os.makedirs('android/app/src/main/res/drawable', exist_ok=True)
    with open('android/app/src/main/res/drawable/ic_notification.png', 'wb') as f:
        f.write(base64.b64decode(tiny_dot))
    print("Created fallback ic_notification.png")
