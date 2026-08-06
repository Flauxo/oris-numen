import re
import io

proverbs = {
    'en': {
        "humilis": [
            "In the silence of your plea, the universe conspires to answer.",
            "Kneeling the ego is the first step to standing in light.",
            "A whispered wish is louder than a shouted demand.",
            "Empty your hands so the divine may fill them.",
            "Your humility is the fertile soil where miracles bloom."
        ],
        "revelatio": [
            "To speak your hidden truth is to break the chains of the past.",
            "Every secret brought to light becomes a stepping stone.",
            "The mirror of the soul only reflects clearly when wiped clean.",
            "A naked spirit fears no darkness.",
            "What you conceal controls you; what you reveal frees you."
        ],
        "absolutio": [
            "Washing away the past makes room for the dawn.",
            "The purest heart is one that knows how to forgive itself.",
            "Release the anchor, and the tide will carry you home.",
            "Absolution is not erasing the mistake, but rewriting the future.",
            "Grace descends when the heavy stones of guilt are dropped."
        ],
        "gratia": [
            "Gratitude turns what we have into more than enough.",
            "The universe echoes back the praises you send it.",
            "A thankful spirit is a magnet for divine favor.",
            "Count your blessings, and you will forget your sorrows.",
            "To appreciate the small things is to invite the great ones."
        ],
        "pazuzu": [
            "A curse spoken in anger binds the speaker as much as the target.",
            "The venom you unleash poisons the river you drink from.",
            "Shadows lengthen when you turn your back on the light.",
            "To invoke ruin is to invite chaos into your own sanctuary.",
            "The price of forbidden power is always paid in fragments of the soul."
        ]
    },
    'es': {
        "humilis": [
            "En el silencio de tu súplica, el universo conspira para responder.",
            "Arrodillar el ego es el primer paso para erguirse en la luz.",
            "Un deseo susurrado es más fuerte que una exigencia gritada.",
            "Vacía tus manos para que lo divino pueda llenarlas.",
            "Tu humildad es la tierra fértil donde florecen los milagros."
        ],
        "revelatio": [
            "Hablar tu verdad oculta es romper las cadenas del pasado.",
            "Todo secreto sacado a la luz se convierte en un peldaño.",
            "El espejo del alma solo refleja con claridad cuando se limpia.",
            "Un espíritu desnudo no teme a la oscuridad.",
            "Lo que ocultas te controla; lo que revelas te libera."
        ],
        "absolutio": [
            "Lavar el pasado deja espacio para el amanecer.",
            "El corazón más puro es aquel que sabe perdonarse a sí mismo.",
            "Suelta el ancla, y la marea te llevará a casa.",
            "La absolución no borra el error, sino que reescribe el futuro.",
            "La gracia desciende cuando se sueltan las pesadas piedras de la culpa."
        ],
        "gratia": [
            "La gratitud convierte lo que tenemos en más que suficiente.",
            "El universo devuelve como eco las alabanzas que le envías.",
            "Un espíritu agradecido es un imán para el favor divino.",
            "Cuenta tus bendiciones, y olvidarás tus penas.",
            "Apreciar las cosas pequeñas es invitar a las grandes."
        ],
        "pazuzu": [
            "Una maldición dicha con ira ata a quien la pronuncia igual que al blanco.",
            "El veneno que desatas envenena el río del que bebes.",
            "Las sombras se alargan cuando das la espalda a la luz.",
            "Invocar la ruina es invitar al caos a tu propio santuario.",
            "El precio del poder prohibido siempre se paga en fragmentos del alma."
        ]
    },
    'it': {
        "humilis": [
            "Nel silenzio della tua supplica, l'universo cospira per rispondere.",
            "Inchinare l'ego è il primo passo per ergersi nella luce.",
            "Un desiderio sussurrato è più forte di una richiesta gridata.",
            "Vuota le tue mani affinché il divino possa riempirle.",
            "La tua umiltà è il terreno fertile in cui sbocciano i miracoli."
        ],
        "revelatio": [
            "Esprimere la tua verità nascosta significa spezzare le catene del passato.",
            "Ogni segreto portato alla luce diventa un trampolino di lancio.",
            "Lo specchio dell'anima riflette chiaramente solo quando viene pulito.",
            "Uno spirito nudo non teme alcuna oscurità.",
            "Ciò che nascondi ti controlla; ciò che riveli ti libera."
        ],
        "absolutio": [
            "Lavare via il passato fa spazio all'alba.",
            "Il cuore più puro è quello che sa perdonare se stesso.",
            "Rilascia l'ancora e la marea ti porterà a casa.",
            "L'assoluzione non è cancellare l'errore, ma riscrivere il futuro.",
            "La grazia scende quando si abbandonano le pesanti pietre del senso di colpa."
        ],
        "gratia": [
            "La gratitudine trasforma ciò che abbiamo in più che sufficiente.",
            "L'universo riecheggia le lodi che gli invii.",
            "Uno spirito grato è una calamita per il favore divino.",
            "Conta le tue benedizioni e dimenticherai i tuoi dolori.",
            "Apprezzare le piccole cose significa invitare quelle grandi."
        ],
        "pazuzu": [
            "Una maledizione detta con rabbia lega chi la pronuncia tanto quanto il bersaglio.",
            "Il veleno che scateni avvelena il fiume da cui bevi.",
            "Le ombre si allungano quando volti le spalle alla luce.",
            "Invocare la rovina è invitare il caos nel proprio santuario.",
            "Il prezzo del potere proibito si paga sempre in frammenti di anima."
        ]
    },
    'la': {
        "humilis": [
            "In silentio supplicationis tuae, universum conspirat ad respondendum.",
            "Ego inclinare primus gradus est ad in luce standum.",
            "Votum susurratum fortius est quam postulatio clamata.",
            "Vacua manus tuas ut divinum eas impleat.",
            "Humilitas tua est terra fertilis ubi miracula florent."
        ],
        "revelatio": [
            "Veritatem tuam occultam eloqui est vincula praeteriti frangere.",
            "Omne arcanum in lucem prolatum fit gradus.",
            "Speculum animae clare reflectit tantum cum tergitur.",
            "Spiritus nudus nullas tenebras timet.",
            "Quod celas te regit; quod revelas te liberat."
        ],
        "absolutio": [
            "Praeteritum abluere locum facit aurorae.",
            "Cor purissimum est id quod se ipsum ignoscere novit.",
            "Ancoram solve, et aestus te domum feret.",
            "Absolutio non est errorem delere, sed futurum rescribere.",
            "Gratia descendit cum graves lapides culpae demittuntur."
        ],
        "gratia": [
            "Gratitudo quod habemus in plus quam satis vertit.",
            "Universum laudes quas mittis remurmurat.",
            "Spiritus gratus est magnes favoris divini.",
            "Numera benedictiones tuas, et dolores oblivisceris.",
            "Parva aestimare est magna invitare."
        ],
        "pazuzu": [
            "Maledictio in ira dicta loquentem aeque ac signum ligat.",
            "Venenum quod immittis flumen ex quo bibis inficit.",
            "Umbrae producuntur cum luci tergum vertis.",
            "Ruinam invocare est chaos in sanctuarium tuum invitare.",
            "Pretium potentiae vetitae semper fragmentis animae solvitur."
        ]
    },
    'zh': {
        "humilis": [
            "在您恳求的沉静中，宇宙正在合力回应。",
            "让自我下跪，是站在光明中的第一步。",
            "低语的愿望比大声的苛求更响亮。",
            "清空你的双手，让神圣来填满它们。",
            "你的谦卑是奇迹绽放的沃土。"
        ],
        "revelatio": [
            "说出你隐藏的真相，就是打破过去的枷锁。",
            "每一个暴露在光天化日之下的秘密，都将成为垫脚石。",
            "灵魂的镜子只有在擦拭干净时才能清晰反射。",
            "赤裸的灵魂不惧怕任何黑暗。",
            "你隐藏的东西控制着你；你揭露的东西解放了你。"
        ],
        "absolutio": [
            "洗刷过去，为黎明腾出空间。",
            "最纯洁的心是懂得原谅自己的心。",
            "解开锚，潮水会带你回家。",
            "赦免不是抹去错误，而是重写未来。",
            "当沉重的罪恶之石被放下时，恩典就会降临。"
        ],
        "gratia": [
            "感恩使我们拥有的变得绰绰有余。",
            "宇宙回应着你发送的赞美。",
            "感恩的精神是神圣恩宠的磁石。",
            "细数你的祝福，你就会忘记你的悲伤。",
            "欣赏小事，就是邀请大事降临。"
        ],
        "pazuzu": [
            "愤怒中说出的诅咒，既束缚了目标，也束缚了说话者。",
            "你释放的毒液会毒害你饮水的河流。",
            "当你背对光明时，阴影就会拉长。",
            "召唤毁灭，就是将混乱引入你自己的圣所。",
            "禁忌力量的代价，总是用灵魂的碎片来支付。"
        ]
    }
}

file_path = "C:\\Users\\Kivan\\.gemini\\antigravity\\scratch\\oris-numen\\js\\translations.js"

with io.open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

langs_order = ['en', 'es', 'it', 'la', 'zh']
freqs_order = ['humilis', 'revelatio', 'absolutio', 'gratia', 'pazuzu']

for freq in freqs_order:
    # Find all 5 matches for this frequency (one per language)
    pattern = f'("proverb\\.{freq}\\.4":\\s*"[^"]*"(?:,|))'
    matches = list(re.finditer(pattern, content))
    
    if len(matches) != 5:
        print(f"Error: Found {len(matches)} matches for {freq}, expected 5.")
        continue
        
    # We replace from right to left so indices don't shift
    for i in range(4, -1, -1):
        match = matches[i]
        lang = langs_order[i]
        
        new_lines = ""
        stmts = proverbs[lang][freq]
        for j, stmt in enumerate(stmts):
            idx = j + 5
            # append comma to all lines to be safe
            new_lines += f'\\n        "proverb.{freq}.{idx}": "{stmt}",'
            
        content = content[:match.end()] + new_lines + content[match.end():]

with io.open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done inserting proverbs correctly!")
