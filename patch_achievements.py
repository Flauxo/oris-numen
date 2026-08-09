import sys

def patch_file():
    with open('js/app_v2.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace ACHIEVEMENTS_DATA
    import re
    new_data = '''                    const ACHIEVEMENTS_DATA = [
                        { id: "init", icon: "assets/images/Iniciado.png", color: "#D4B85A" },
                        { id: "early", icon: "assets/images/Madrugador.png", color: "#8E6DA3" },
                        { id: "night", icon: "assets/images/Nocturno.png", color: "#54789B" },
                        { id: "fifty", icon: "assets/images/Perseverante.png", color: "#C06C4C" },
                        { id: "moon", icon: "assets/images/Dador.png", color: "#A2A2A2" },
                        { id: "alchemist", icon: "assets/images/Alquimista.png", color: "#4E876A" },
                        { id: "compassive", icon: "assets/images/Compasivo.png", color: "#D4B85A" },
                        { id: "grateful", icon: "assets/images/Agradecido.png", color: "#8E6DA3" },
                        { id: "sincere", icon: "assets/images/Sincero.png", color: "#54789B" },
                        { id: "humble", icon: "assets/images/Humilde.png", color: "#C06C4C" }
                    ];'''
    
    pattern = r'const ACHIEVEMENTS_DATA = \[\s*\{ id: "init".+?\{ id: "humble".+?\}\s*\];'
    content = re.sub(pattern, new_data, content, flags=re.DOTALL)
    
    # 2. Replace card innerHTML
    old_card = '''                        card.innerHTML = 
                            '<div class="achievement-icon" style="color: ' + iconColor + ';">' +
                                ach.icon +
                                
                            '</div>' +'''
    new_card = '''                        card.innerHTML = 
                            '<div class="achievement-icon">' +
                                '<div style="-webkit-mask-image: url(\\'' + ach.icon + '\\'); mask-image: url(\\'' + ach.icon + '\\'); -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; background-color: ' + iconColor + '; width: 32px; height: 32px; margin: 0 auto;"></div>' +
                            '</div>' +'''
    content = content.replace(old_card, new_card)

    # 3. Replace popup icon
    old_popup = '''                            const iconContainer = document.getElementById('achievement-popup-icon');
                            iconContainer.innerHTML = ach.icon.replace('width="32" height="32"', 'width="36" height="36"');
                            iconContainer.style.color = iconColor;'''
    new_popup = '''                            const iconContainer = document.getElementById('achievement-popup-icon');
                            iconContainer.innerHTML = '<div style="-webkit-mask-image: url(\\'' + ach.icon + '\\'); mask-image: url(\\'' + ach.icon + '\\'); -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; background-color: ' + iconColor + '; width: 36px; height: 36px;"></div>';
                            iconContainer.style.color = iconColor;'''
    content = content.replace(old_popup, new_popup)

    with open('js/app_v2.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    patch_file()
