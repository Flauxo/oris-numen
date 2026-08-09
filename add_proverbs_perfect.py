import io

# All 10 proverbs per frequency, for all 5 languages
proverbs_10 = {
    'en': {
        "humilis": [
            "In weakness, we find our greatest strength before the divine.",
            "He who asks with a sincere heart has already been heard.",
            "There is no small plea when the faith that raises it is immense.",
            "Prayer is the invisible bridge that connects the ground with the sky.",
            "Speak from the emptiness of your being, so that grace may fill it.",
            "In the silence of your plea, the universe conspires to answer.",
            "Kneeling the ego is the first step to standing in light.",
            "A whispered wish is louder than a shouted demand.",
            "Empty your hands so the divine may fill them.",
            "Your humility is the fertile soil where miracles bloom."
        ],
        "revelatio": [
            "The truth will set you free, for there is no shadow that can resist the light.",
            "Baring the soul is the first step toward its true healing.",
            "That which you confess ceases to be a weight and becomes wisdom.",
            "In the vulnerability of confession lies the purest courage.",
            "Naming your fears in the silence is to strip them of their power.",
            "To speak your hidden truth is to break the chains of the past.",
            "Every secret brought to light becomes a stepping stone.",
            "The mirror of the soul only reflects clearly when wiped clean.",
            "A naked spirit fears no darkness.",
            "What you conceal controls you; what you reveal frees you."
        ],
        "absolutio": [
            "To forgive is to release a prisoner and discover that the prisoner was you.",
            "Water erases the stain, but forgiveness renews the whole spirit.",
            "He who seeks mercy has already begun to purify his path.",
            "Where error abounds, the grace that redeems everything superabounds.",
            "Release the burden of guilt; the dawn does not punish the night.",
            "Washing away the past makes room for the dawn.",
            "The purest heart is one that knows how to forgive itself.",
            "Release the anchor, and the tide will carry you home.",
            "Absolution is not erasing the mistake, but rewriting the future.",
            "Grace descends when the heavy stones of guilt are dropped."
        ],
        "gratia": [
            "A grateful heart is the most sublime altar to receive blessings.",
            "To give thanks is to recognize that life itself is an undeserved gift.",
            "In gratitude, what we have becomes enough and multiplies.",
            "Joy is the natural echo of a spirit that knows how to be grateful.",
            "Praising the light is the best way to ensure we never lack it.",
            "Gratitude turns what we have into more than enough.",
            "The universe echoes back the praises you send it.",
            "A thankful spirit is a magnet for divine favor.",
            "Count your blessings, and you will forget your sorrows.",
            "To appreciate the small things is to invite the great ones."
        ],
        "pazuzu": [
            "The darkness is not the absence of light, but the presence of an older, hungrier force.",
            "He who invokes the abyss soon finds the abyss smiling back.",
            "The price of forbidden knowledge is always paid in pieces of your own soul.",
            "The strongest chains are not made of iron, but of the unspeakable desires you just released.",
            "You fed the black fire, now don't be surprised when the shadows call you by name.",
            "A curse spoken in anger binds the speaker as much as the target.",
            "The venom you unleash poisons the river you drink from.",
            "Shadows lengthen when you turn your back on the light.",
            "To invoke ruin is to invite chaos into your own sanctuary.",
            "The price of forbidden power is always paid in fragments of the soul."
        ]
    },
    'es': {
        "humilis": [
            "En la debilidad, encontramos nuestra mayor fortaleza ante lo divino.",
            "El que pide con un corazón sincero, ya ha sido escuchado.",
            "No hay ruego pequeño cuando la fe que lo eleva es inmensa.",
            "La plegaria es el puente invisible que une el suelo con el cielo.",
            "Habla desde el vacío de tu ser, para que la gracia pueda llenarlo.",
            "En el silencio de tu súplica, el universo conspira para responder.",
            "Arrodillar el ego es el primer paso para erguirse en la luz.",
            "Un deseo susurrado es más fuerte que una exigencia gritada.",
            "Vacía tus manos para que lo divino pueda llenarlas.",
            "Tu humildad es la tierra fértil donde florecen los milagros."
        ],
        "revelatio": [
            "La verdad te hará libre, pues no hay sombra que resista a la luz.",
            "Desnudar el alma es el primer paso hacia su verdadera sanación.",
            "Aquello que confiesas deja de ser un peso y se convierte en sabiduría.",
            "En la vulnerabilidad de la confesión reside la valentía más pura.",
            "Nombrar tus miedos en el silencio es despojarlos de su poder.",
            "Hablar tu verdad oculta es romper las cadenas del pasado.",
            "Todo secreto sacado a la luz se convierte en un peldaño.",
            "El espejo del alma solo refleja con claridad cuando se limpia.",
            "Un espíritu desnudo no teme a la oscuridad.",
            "Lo que ocultas te controla; lo que revelas te libera."
        ],
        "absolutio": [
            "Perdonar es liberar a un prisionero y descubrir que el prisionero eras tú.",
            "El agua borra la mancha, pero el perdón renueva el espíritu entero.",
            "Aquel que busca misericordia ya ha comenzado a purificar su camino.",
            "Donde abunda el error, sobreabunda la gracia que todo lo redime.",
            "Suelta el peso de la culpa; el amanecer no castiga a la noche.",
            "Lavar el pasado deja espacio para el amanecer.",
            "El corazón más puro es aquel que sabe perdonarse a sí mismo.",
            "Suelta el ancla, y la marea te llevará a casa.",
            "La absolución no borra el error, sino que reescribe el futuro.",
            "La gracia desciende cuando se sueltan las pesadas piedras de la culpa."
        ],
        "gratia": [
            "Un corazón agradecido es el altar más sublime para recibir bendiciones.",
            "Dar las gracias es reconocer que la vida misma es un regalo inmerecido.",
            "En la gratitud, lo que tenemos se vuelve suficiente y se multiplica.",
            "La alegría es el eco natural de un espíritu que sabe agradecer.",
            "Alabar la luz es la mejor forma de asegurar que nunca nos falte.",
            "La gratitud convierte lo que tenemos en más que suficiente.",
            "El universo devuelve como eco las alabanzas que le envías.",
            "Un espíritu agradecido es un imán para el favor divino.",
            "Cuenta tus bendiciones, y olvidarás tus penas.",
            "Apreciar las cosas pequeñas es invitar a las grandes."
        ],
        "pazuzu": [
            "La oscuridad no es la ausencia de luz, sino la presencia de una fuerza más antigua y hambrienta.",
            "Aquel que invoca al abismo, pronto descubre que el abismo le devuelve la mirada con una sonrisa.",
            "El precio del conocimiento prohibido siempre se paga con pedazos de tu propia alma.",
            "Las cadenas más fuertes no son de hierro, sino de los deseos inconfesables que acabas de liberar.",
            "Has alimentado al fuego negro, ahora no te sorprendas cuando las sombras te llamen por tu nombre.",
            "Una maldición dicha con ira ata a quien la pronuncia igual que al blanco.",
            "El veneno que desatas envenena el río del que bebes.",
            "Las sombras se alargan cuando das la espalda a la luz.",
            "Invocar la ruina es invitar al caos a tu propio santuario.",
            "El precio del poder prohibido siempre se paga en fragmentos del alma."
        ]
    },
    'it': {
        "humilis": [
            "Nella debolezza, troviamo la nostra più grande forza davanti al divino.",
            "Colui che chiede con cuore sincero è già stato ascoltato.",
            "Non c'è supplica troppo piccola quando la fede che la solleva è immensa.",
            "La preghiera è il ponte invisibile che unisce la terra al cielo.",
            "Parla dal vuoto del tuo essere, affinché la grazia possa riempirlo.",
            "Nel silenzio della tua supplica, l'universo cospira per rispondere.",
            "Inchinare l'ego è il primo passo per ergersi nella luce.",
            "Un desiderio sussurrato è più forte di una richiesta gridata.",
            "Vuota le tue mani affinché il divino possa riempirle.",
            "La tua umiltà è il terreno fertile in cui sbocciano i miracoli."
        ],
        "revelatio": [
            "La verità ti renderà libero, poiché non c'è ombra che possa resistere alla luce.",
            "Mettere a nudo l'anima è il primo passo verso la sua vera guarigione.",
            "Ciò che confessi cessa di essere un peso e diventa saggezza.",
            "Nella vulnerabilità della confessione risiede il coraggio più puro.",
            "Dare un nome alle tue paure nel silenzio è privarle del loro potere.",
            "Esprimere la tua verità nascosta significa spezzare le catene del passato.",
            "Ogni segreto portato alla luce diventa un trampolino di lancio.",
            "Lo specchio dell'anima riflette chiaramente solo quando viene pulito.",
            "Uno spirito nudo non teme alcuna oscurità.",
            "Ciò che nascondi ti controlla; ciò che riveli ti libera."
        ],
        "absolutio": [
            "Perdonare è liberare un prigionero e scoprire che il prigionero eri tu.",
            "L'acqua cancella la macchia, ma il perdono rinnova l'intero spirito.",
            "Colui che cerca misericordia ha già iniziato a purificare il suo cammino.",
            "Dove abbonda l'errore, sovrabbonda la grazia che tutto redime.",
            "Lascia andare il peso della colpa; l'alba non punisce la notte.",
            "Lavare via il passato fa spazio all'alba.",
            "Il cuore più puro è quello che sa perdonare se stesso.",
            "Rilascia l'ancora e la marea ti porterà a casa.",
            "L'assoluzione non è cancellare l'errore, ma riscrivere il futuro.",
            "La grazia scende quando si abbandonano le pesanti pietre del senso di colpa."
        ],
        "gratia": [
            "Un cuore grato è l'altare più sublime per ricevere benedizioni.",
            "Rendere grazie è riconoscere che la vita stessa è un dono immeritato.",
            "Nella gratitudine, ciò che abbiamo diventa sufficiente e si moltiplica.",
            "La gioia è l'eco naturale di uno spirito che sa essere grato.",
            "Lodare la luce è il modo migliore per assicurarsi che non ci manchi mai.",
            "La gratitudine trasforma ciò che abbiamo in più che sufficiente.",
            "L'universo riecheggia le lodi che gli invii.",
            "Uno spirito grato è una calamita per il favore divino.",
            "Conta le tue benedizioni e dimenticherai i tuoi dolori.",
            "Apprezzare le piccole cose significa invitare quelle grandi."
        ],
        "pazuzu": [
            "L'oscurità non è l'assenza di luce, ma la presenza di una forza più antica e affamata.",
            "Chi invoca l'abisso scopre presto che l'abisso gli sorride di rimando.",
            "Il prezzo della conoscenza proibita si paga sempre con pezzi della propria anima.",
            "Le catene più forti non sono fatte di ferro, ma degli indicibili desideri che hai appena liberato.",
            "Hai nutrito il fuoco nero, ora non sorprenderti quando le ombre ti chiameranno per nome.",
            "Una maledizione detta con rabbia lega chi la pronuncia tanto quanto il bersaglio.",
            "Il veleno che scateni avvelena il fiume da cui bevi.",
            "Le ombre si allungano quando volti le spalle alla luce.",
            "Invocare la rovina è invitare il caos nel proprio santuario.",
            "Il prezzo del potere proibito si paga sempre in frammenti di anima."
        ]
    },
    'la': {
        "humilis": [
            "In infirmitate maximam fortitudinem coram divino invenimus.",
            "Qui sincero corde petit, iam exauditus est.",
            "Nulla est parva obsecratio cum fides quae eam tollit immensa sit.",
            "Precatio est pons invisibilis qui terram cum caelo iungit.",
            "Loquere ex inani tui esse, ut gratia id impleat.",
            "In silentio supplicationis tuae, universum conspirat ad respondendum.",
            "Ego inclinare primus gradus est ad in luce standum.",
            "Votum susurratum fortius est quam postulatio clamata.",
            "Vacua manus tuas ut divinum eas impleat.",
            "Humilitas tua est terra fertilis ubi miracula florent."
        ],
        "revelatio": [
            "Veritas liberabit vos, nam nulla est umbra quae luci resistere possit.",
            "Denudare animam est primus gradus ad eius veram sanationem.",
            "Id quod confiteris desinit esse pondus et fit sapientia.",
            "In vulnerabilitate confessionis inest fortitudo purissima.",
            "Timores tuos in silentio nominare est eos potestate sua exuere.",
            "Veritatem tuam occultam eloqui est vincula praeteriti frangere.",
            "Omne arcanum in lucem prolatum fit gradus.",
            "Speculum animae clare reflectit tantum cum tergitur.",
            "Spiritus nudus nullas tenebras timet.",
            "Quod celas te regit; quod revelas te liberat."
        ],
        "absolutio": [
            "Ignoscere est captivum liberare et deprehendere captivum te fuisse.",
            "Aqua maculam delet, sed venia totum spiritum renovat.",
            "Qui misericordiam quaerit, iam coepit viam suam purificare.",
            "Ubi abundat error, superabundat gratia quae omnia redimit.",
            "Dimitte onus culpae; aurora noctem non punit.",
            "Praeteritum abluere locum facit aurorae.",
            "Cor purissimum est id quod se ipsum ignoscere novit.",
            "Ancoram solve, et aestus te domum feret.",
            "Absolutio non est errorem delere, sed futurum rescribere.",
            "Gratia descendit cum graves lapides culpae demittuntur."
        ],
        "gratia": [
            "Cor gratum est altare sublimissimum ad benedictiones recipiendas.",
            "Gratias agere est agnoscere vitam ipsam donum immeritum esse.",
            "In gratitudine, quod habemus sufficit et multiplicatur.",
            "Gaudium est echo naturalis spiritus qui gratias agere novit.",
            "Lucem laudare est modus optimus ad cavendum ne unquam nobis desit.",
            "Gratitudo quod habemus in plus quam satis vertit.",
            "Universum laudes quas mittis remurmurat.",
            "Spiritus gratus est magnes favoris divini.",
            "Numera benedictiones tuas, et dolores oblivisceris.",
            "Parva aestimare est magna invitare."
        ],
        "pazuzu": [
            "Tenebrae non sunt absentia lucis, sed praesentia antiquioris et famelicioris virtutis.",
            "Qui abyssum invocat cito deprehendit abyssum ei arridere.",
            "Pretium scientiae prohibitae semper solvitur fragmentis propriae animae.",
            "Vincula fortissima non sunt ex ferro, sed ex ineffabilibus desideriis quae modo liberasti.",
            "Ignem atrum pavisti, nunc ne mireris cum umbrae te nomine tuo vocant.",
            "Maledictio in ira dicta loquentem aeque ac signum ligat.",
            "Venenum quod immittis flumen ex quo bibis inficit.",
            "Umbrae producuntur cum luci tergum vertis.",
            "Ruinam invocare est chaos in sanctuarium tuum invitare.",
            "Pretium potentiae vetitae semper fragmentis animae solvitur."
        ]
    },
    'zh': {
        "humilis": [
            "在软弱中，我们在神圣面前找到最大的力量。",
            "以真诚之心祈求的人，已经得到了回应。",
            "当升起请求的信仰无限时，没有渺小的请求。",
            "祈祷是连接地面与天空的无形桥梁。",
            "从你存在的空虚中说话，以便恩典能填满它。",
            "在您恳求的沉静中，宇宙正在合力回应。",
            "让自我下跪，是站在光明中的第一步。",
            "低语的愿望比大声的苛求更响亮。",
            "清空你的双手，让神圣来填满它们。",
            "你的谦卑是奇迹绽放的沃土。"
        ],
        "revelatio": [
            "真理会让你自由，因为没有阴影能抵挡光。",
            "敞开心扉是走向真正疗愈的第一步。",
            "你所坦白的，不再是重担，而会成为智慧。",
            "在坦白的脆弱中，蕴含着最纯粹的勇气。",
            "在沉默中说出你恐惧的名字，就是剥夺它们的力量。",
            "说出你隐藏的真相，就是打破过去的枷锁。",
            "每一个暴露在光天化日之下的秘密，都将成为垫脚石。",
            "灵魂的镜子只有在擦拭干净时才能清晰反射。",
            "赤裸的灵魂不惧怕任何黑暗。",
            "你隐藏的东西控制着你；你揭露的东西解放了你。"
        ],
        "absolutio": [
            "原谅就是释放囚犯，并发现那个囚犯就是你自己。",
            "水能洗去污渍，但宽恕能更新整个灵魂。",
            "寻求怜悯的人，已经开始净化自己的道路。",
            "在错误丰富的地方，救赎一切的恩典更丰富。",
            "放下内疚的重担；黎明不会惩罚黑夜。",
            "洗刷过去，为黎明腾出空间。",
            "最纯洁的心是懂得原谅自己的心。",
            "解开锚，潮水会带你回家。",
            "赦免不是抹去错误，而是重写未来。",
            "当沉重的罪恶之石被放下时，恩典就会降临。"
        ],
        "gratia": [
            "感恩的心是接受祝福的最崇高的祭坛。",
            "感恩就是承认生命本身就是一份不配得的礼物。",
            "在感恩中，我们拥有的就足够了，并且会成倍增加。",
            "快乐是懂得感恩的灵魂自然的本能回响。",
            "赞美光是确保我们永远不会缺少它的最好方法。",
            "感恩使我们拥有的变得绰绰有余。",
            "宇宙回应着你发送的赞美。",
            "感恩的精神是神圣恩宠的磁石。",
            "细数你的祝福，你就会忘记你的悲伤。",
            "欣赏小事，就是邀请大事降临。"
        ],
        "pazuzu": [
            "黑暗不是没有光，而是存在一种更古老、更饥渴的力量。",
            "召唤深渊的人很快就会发现深渊也在对他微笑。",
            "禁忌知识的代价总是用你自己灵魂的碎片来支付。",
            "最坚固的锁链不是铁做的，而是你刚刚释放的那些不可言说的欲望。",
            "你喂养了黑火，现在当阴影呼唤你的名字时，不要感到惊讶。",
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

langs = ['en', 'es', 'it', 'la', 'zh']

for lang in langs:
    # Find the target anchor for this language
    # Example: "sigil.download_app": "DOWNLOAD ORIS NUMEN",
    # (can have or not have a comma, can have different values)
    target = f'"sigil.download_app":\\s*"[^"]*"(?:,)?'
    
    # We want to replace the first occurrence of this in the specific language block.
    # To do this safely, we can just find it and replace it with itself + our new proverbs.
    
    # Since we don't know the exact order easily with regex, let's just do a string replace
    # We will find `"sigil.download_app":` and its value.
    import re
    # Find all occurrences of sigil.download_app
    matches = list(re.finditer(target, content))
    
    if len(matches) == 5:
        idx = langs.index(lang)
        match = matches[idx]
        
        anchor_text = content[match.start():match.end()]
        
        # Build the new proverbs
        new_proverbs = ""
        for freq, stmts in proverbs_10[lang].items():
            for i, stmt in enumerate(stmts):
                # Ensure no weird quotes
                stmt = stmt.replace('"', '\\"')
                new_proverbs += f'\n        "proverb.{freq}.{i}": "{stmt}",'
                
        # Inject right after the anchor
        if not anchor_text.endswith(','):
            anchor_text += ','
            
        replacement = anchor_text + new_proverbs
        content = content[:match.start()] + replacement + content[match.end():]
        
with io.open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done completely replacing all proverbs!")
