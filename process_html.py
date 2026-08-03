from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# Add script tag
scripts = soup.find_all('script')
if scripts:
    first_script = scripts[0]
    new_script = soup.new_tag('script', src='js/translations.js')
    first_script.insert_before(new_script)
    first_script.insert_before('\n    ')

# Map of elements to keys
mappings = [
    ('.splash-subtitle', 'splash.subtitle'),
    ('.home-subtitle', 'home.subtitle'),
    ('#sidebar-title', 'menu.title'),
    ('#menu-item-lang', 'menu.language'),
    ('#menu-item-how-it-works', 'menu.how_it_works'),
    ('#menu-item-upgrades', 'menu.upgrades'),
    ('#menu-item-testimonials', 'menu.testimonials'),
    ('#menu-item-about', 'menu.about'),
    
    ('.home-description p', 'home.desc'),
    
    ('.overlay-label:contains("Propósito")', 'freq.purpose'),
    ('.overlay-label:contains("Efecto")', 'freq.effect'),
    ('#btn-write', 'btn.write'),
    
    ('#btn-back', 'btn.back'),
    ('#btn-send', 'btn.send'),
    ('#message-input', 'write.placeholder', 'placeholder'),
    
    ('#channeling-label', 'channeling.label'),
    ('#channeling-sublabel', 'channeling.sublabel'),
    ('.channeling-info', 'channeling.info'),
    ('#btn-cancel', 'btn.cancel'),
    
    ('.success-title', 'success.title', 'html'),
    ('.success-subtitle', 'success.subtitle.divine'),
    ('#btn-home', 'btn.home'),
    
    ('#btn-confirm-text', 'write.confirm'),
    
    ('.title-about', 'about.title'),
    ('#about-overlay .modal-content p:nth-of-type(1)', 'about.p1'),
    ('#about-overlay .modal-content p:nth-of-type(2)', 'about.p2'),
    ('#about-overlay .modal-content p:nth-of-type(3)', 'about.p3'),
    
    ('.title-how-it-works', 'how_it_works.title'),
    ('#how-it-works-overlay .modal-content p:nth-of-type(1)', 'how_it_works.p1', 'html'),
    ('#how-it-works-overlay .modal-content p:nth-of-type(2)', 'how_it_works.p2', 'html'),
    ('#how-it-works-overlay .modal-content p:nth-of-type(3)', 'how_it_works.p3'),
    
    ('.title-testimonials', 'testimonials.title'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(1) .testimonial-text', 'testimonials.t1'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(1) .testimonial-location', 'testimonials.l1'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(3) .testimonial-text', 'testimonials.t2'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(3) .testimonial-location', 'testimonials.l2'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(5) .testimonial-text', 'testimonials.t3'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(5) .testimonial-location', 'testimonials.l3'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(7) .testimonial-text', 'testimonials.t4'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(7) .testimonial-location', 'testimonials.l4'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(9) .testimonial-text', 'testimonials.t5'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(9) .testimonial-location', 'testimonials.l5'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(11) .testimonial-text', 'testimonials.t6'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(11) .testimonial-location', 'testimonials.l6'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(13) .testimonial-text', 'testimonials.t7'),
    ('#testimonials-overlay .testimonial-item:nth-of-type(13) .testimonial-location', 'testimonials.l7'),
    
    ('.title-upgrades', 'upgrades.title'),
    ('#upgrades-overlay .modal-content p:nth-of-type(1)', 'upgrades.p1'),
    ('#upgrades-overlay .modal-content p:nth-of-type(2)', 'upgrades.p2'),
    ('#btn-unlock-upgrades', 'btn.unlock'),
    
    ('.evil-title', 'evil.title'),
    ('.evil-subtitle', 'evil.subtitle'),
    ('#evil-input', 'evil.placeholder', 'placeholder'),
    ('#btn-evil-channel', 'btn.evil'),
]

for mapping in mappings:
    selector = mapping[0]
    key = mapping[1]
    attr = mapping[2] if len(mapping) > 2 else 'text'
    
    if ':contains' in selector:
        # Custom handling for contains
        tag_name, text = selector.split(':contains("')
        text = text[:-2] # remove '")'
        els = [el for el in soup.select(tag_name) if text in el.text]
        for el in els:
            el['data-i18n'] = key
            if attr == 'placeholder':
                el['data-i18n-attr'] = 'placeholder'
            if attr == 'html':
                el['data-i18n-html'] = 'true'
    else:
        els = soup.select(selector)
        for el in els:
            el['data-i18n'] = key
            if attr == 'placeholder':
                el['data-i18n-attr'] = 'placeholder'
            if attr == 'html':
                el['data-i18n-html'] = 'true'

# Add data-i18n to cards
cards = soup.select('.message-card')
for card in cards:
    ctype = card['data-type']
    card.select_one('.card-desc')['data-i18n'] = f'card.{ctype}.desc'

# Also add data-lang attributes to the language buttons
lang_list = soup.select('#sidebar-lang-menu li a')
if len(lang_list) >= 4:
    lang_list[0]['data-lang'] = 'en'
    lang_list[1]['data-lang'] = 'es'
    lang_list[2]['data-lang'] = 'it'
    lang_list[3]['data-lang'] = 'la'

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
print("HTML processed.")
