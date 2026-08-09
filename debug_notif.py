import re

with open('js/app_v2.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('showUnlockNotification')
print(code[idx:idx+800])
