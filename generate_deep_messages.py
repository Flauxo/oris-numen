import json
import codecs
import random
import copy

deep_messages = [
    {"lang": "es", "country": "España", "text": "Universo, te ruego por mi hermano menor. Lleva dos años intentando encontrar su camino después del accidente y veo cómo su luz se apaga cada día. Envíale una señal de que todavía tiene un propósito aquí."},
    {"lang": "es", "country": "México", "text": "Perdóname, universo, por haber cortado la relación con mi madre por orgullo. Ahora que su memoria se desvanece por la enfermedad, me doy cuenta del tiempo que desperdicié. Te pido que le des paz en sus momentos de confusión."},
    {"lang": "es", "country": "Argentina", "text": "Quiero agradecer al universo por cruzar a aquella enfermera en mi camino. Cuando mi esposa estaba en cuidados intensivos, sus palabras fueron el único ancla que me mantuvo cuerdo. Que la vida le devuelva multiplicada toda la compasión que nos dio."},
    {"lang": "es", "country": "Colombia", "text": "Te pido con toda mi alma por mi amiga de la infancia. Está atrapada en una relación que le hace daño y no se da cuenta de lo mucho que vale. Por favor, dale la fuerza interior necesaria para abrir los ojos y volar lejos de ahí."},
    {"lang": "es", "country": "Chile", "text": "Confieso que he perdido la fe muchas veces este año. La pérdida de nuestro bebé nos ha roto en mil pedazos. Universo, te ruego que consueles el corazón de mi marido, él se hace el fuerte por mí pero le escucho llorar por las noches."},
    {"lang": "es", "country": "Uruguay", "text": "Agradezco profundamente la segunda oportunidad que se me ha dado. Después del infarto, cada mañana que respiro el aire frío es un regalo. Ayúdame a no volver a dar la vida por sentado y a ser mejor padre para mis hijas."},
    {"lang": "es", "country": "Perú", "text": "Universo, envía claridad a mi hija. Se ha mudado a otro país buscando un sueño que parece escaparse y la noto cada vez más triste en sus llamadas. Haz que encuentre personas buenas que la acojan como la familia que ahora le queda tan lejos."},
    {"lang": "es", "country": "Ecuador", "text": "Perdón por haber dudado de mi propia intuición y haber arrastrado a mi familia a esta ruina financiera. Te ruego humildemente que me des la sabiduría para trabajar duro y devolverles el hogar y la tranquilidad que les quité."},
    {"lang": "es", "country": "España", "text": "Hoy quiero pedir por todos los ancianos que, como mi abuelo, pasan sus últimos días en la soledad de una habitación. Universo, que hoy un rayo de sol cálido toque sus caras y les haga sentir que no han sido olvidados por el mundo."},
    {"lang": "es", "country": "Bolivia", "text": "Agradezco al universo por aquel desconocido que pagó mi compra en el supermercado cuando mi tarjeta fue rechazada. Yo estaba llorando de desesperación por no poder dar de comer a mis hijos. Nunca olvidaré ese acto de puro amor incondicional."},
    {"lang": "es", "country": "Paraguay", "text": "Universo, pido por el alma de mi antiguo maestro. Él fue el único que creyó en mí cuando yo era un adolescente problemático sin rumbo. Si no fuera por su paciencia infinita, yo hoy no estaría vivo. Que descanse en absoluta paz."},
    {"lang": "es", "country": "República Dominicana", "text": "Confieso mi cobardía al no haber defendido a mi compañero cuando todos se burlaban de él. Llevo este peso durante diez años. Universo, donde quiera que él esté ahora, llénalo de bendiciones y sánale las heridas que yo permití que le hicieran."},
    {"lang": "es", "country": "Costa Rica", "text": "Ruego por mi hermana mayor. Desde que falleció su marido se ha volcado completamente en ayudar a otros y se olvida de sí misma. Universo, mándale a alguien que la cuide a ella con la misma devoción y ternura que ella reparte al mundo."},
    {"lang": "es", "country": "México", "text": "Gracias eternas por la persona que adoptó a mi perro cuando yo perdí mi casa y no pude mantenerlo. Saber que está corriendo feliz en un jardín y recibiendo amor me da fuerzas para reconstruir mi vida desde cero."},
    {"lang": "es", "country": "España", "text": "Pido perdón al universo por mi constante insatisfacción. Tengo un techo, comida y una familia sana, pero siempre me quejo de lo que me falta. Ayúdame a limpiar mis ojos espirituales para ver la inmensa fortuna que ya poseo."},

    {"lang": "en", "country": "United States", "text": "Universe, I pray for my younger brother. He has been trying to find his way for two years after the accident and I see his light fading every day. Send him a sign that he still has a purpose here."},
    {"lang": "en", "country": "United Kingdom", "text": "Forgive me, universe, for having cut ties with my mother out of pride. Now that her memory fades due to illness, I realize the time I wasted. I ask you to give her peace in her moments of confusion."},
    {"lang": "en", "country": "Canada", "text": "I want to thank the universe for crossing paths with that nurse. When my wife was in intensive care, her words were the only anchor that kept me sane. May life return to her all the compassion she gave us."},
    {"lang": "en", "country": "Australia", "text": "I ask with all my soul for my childhood friend. She is trapped in a toxic relationship and doesn't realize her own worth. Please give her the inner strength to open her eyes and fly away from there."},
    {"lang": "en", "country": "United States", "text": "I confess I have lost my faith many times this year. The loss of our baby has broken us into a thousand pieces. Universe, please comfort my husband's heart; he acts strong for me but I hear him cry at night."},
    {"lang": "en", "country": "Ireland", "text": "I am deeply grateful for the second chance I have been given. After the heart attack, every morning I breathe the cold air is a gift. Help me never take life for granted again and to be a better father to my daughters."},
    {"lang": "en", "country": "New Zealand", "text": "Universe, send clarity to my daughter. She moved to another country chasing a dream that seems to be slipping away and she sounds sadder in every call. Help her find good people to embrace her like the family she left behind."},
    {"lang": "en", "country": "United States", "text": "Forgive me for doubting my own intuition and dragging my family into this financial ruin. I humbly pray you give me the wisdom to work hard and restore the home and peace of mind I took from them."},
    {"lang": "en", "country": "United Kingdom", "text": "Today I pray for all the elderly who, like my grandfather, spend their last days in the solitude of a room. Universe, let a warm ray of sunshine touch their faces today so they know they haven't been forgotten by the world."},
    {"lang": "en", "country": "Canada", "text": "I thank the universe for that stranger who paid for my groceries when my card was declined. I was crying in despair because I couldn't feed my children. I will never forget that act of pure unconditional love."},
    
    {"lang": "fr", "country": "Francia", "text": "Univers, je te prie pour mon jeune frère. Depuis son accident il y a deux ans, il cherche sa voie et je vois sa lumière s'éteindre de jour en jour. Envoie-lui un signe qu'il a encore une mission ici-bas."},
    {"lang": "fr", "country": "Bélgica", "text": "Pardonne-moi, univers, d'avoir coupé les ponts avec ma mère par orgueil. Maintenant que sa mémoire s'efface à cause de la maladie, je réalise le temps que j'ai gâché. Accorde-lui la paix dans ses moments d'égarement."},
    {"lang": "fr", "country": "Canadá", "text": "Je veux remercier l'univers d'avoir mis cette infirmière sur mon chemin. Quand ma femme était aux soins intensifs, ses mots ont été mon seul ancrage. Que la vie lui rende au centuple toute la compassion qu'elle nous a offerte."},
    {"lang": "fr", "country": "Suiza", "text": "Je prie de toute mon âme pour mon amie d'enfance. Elle est prisonnière d'une relation toxique et ne réalise pas sa propre valeur. S'il te plaît, donne-lui la force intérieure pour ouvrir les yeux et s'envoler loin d'ici."},
    {"lang": "fr", "country": "Francia", "text": "Je confesse avoir souvent perdu la foi cette année. La perte de notre bébé nous a brisés en mille morceaux. Univers, je t'en supplie, réconforte le cœur de mon mari ; il se montre fort pour moi mais je l'entends pleurer la nuit."},
    
    {"lang": "it", "country": "Italia", "text": "Universo, ti prego per mio fratello minore. Da due anni, dopo l'incidente, cerca la sua strada e vedo la sua luce spegnersi ogni giorno. Mandagli un segno che ha ancora uno scopo qui."},
    {"lang": "it", "country": "Suiza", "text": "Perdonami, universo, per aver interrotto i rapporti con mia madre per orgoglio. Ora che la malattia le cancella la memoria, capisco il tempo che ho sprecato. Ti prego di donarle pace nei suoi momenti di confusione."},
    {"lang": "it", "country": "Italia", "text": "Voglio ringraziare l'universo per aver incrociato quella infermiera sul mio cammino. Quando mia moglie era in terapia intensiva, le sue parole sono state la mia unica ancora di salvezza. Che la vita le restituisca tutto l'amore che ci ha dato."},
    {"lang": "it", "country": "Italia", "text": "Ti prego con tutta l'anima per la mia amica d'infanzia. È intrappolata in una relazione che le fa del male e non capisce quanto vale. Dalle la forza interiore necessaria per aprire gli occhi e volare via da lì."},
    {"lang": "it", "country": "Italia", "text": "Confesso di aver perso la fede molte volte quest'anno. La perdita del nostro bambino ci ha spezzato il cuore. Universo, ti supplico, consola il cuore di mio marito; fa il forte per me ma lo sento piangere la notte."},
    
    {"lang": "pt", "country": "Brasil", "text": "Universo, imploro pelo meu irmão mais novo. Há dois anos tenta encontrar o seu caminho após o acidente e vejo a sua luz apagar-se a cada dia. Manda-lhe um sinal de que ele ainda tem um propósito aqui."},
    {"lang": "pt", "country": "Portugal", "text": "Perdoa-me, universo, por ter cortado relações com a minha mãe por orgulho. Agora que a sua memória se desvanece com a doença, dou-me conta do tempo que desperdicei. Peço-te que lhe dês paz nos seus momentos de confusão."},
    {"lang": "pt", "country": "Brasil", "text": "Quero agradecer ao universo por ter colocado aquela enfermeira no meu caminho. Quando a minha esposa esteve nos cuidados intensivos, as suas palavras foram a única âncora que me manteve são. Que a vida lhe devolva toda a compaixão que nos deu."},
    {"lang": "pt", "country": "Angola", "text": "Peço com toda a minha alma pela minha amiga de infância. Ela está presa numa relação que lhe faz mal e não percebe o seu próprio valor. Por favor, dá-lhe a força interior necessária para abrir os olhos e voar para longe dali."},
    {"lang": "pt", "country": "Brasil", "text": "Confesso que perdi a fé muitas vezes este ano. A perda do nosso bebé quebrou-nos em mil pedaços. Universo, imploro-te que consoles o coração do meu marido; ele faz-se de forte por mim, mas oiço-o chorar à noite."},
    
    {"lang": "de", "country": "Alemania", "text": "Universum, ich bete für meinen jüngeren Bruder. Seit seinem Unfall vor zwei Jahren sucht er seinen Weg, und ich sehe, wie sein Licht jeden Tag schwächer wird. Sende ihm ein Zeichen, dass er hier noch einen Zweck hat."},
    {"lang": "de", "country": "Austria", "text": "Vergib mir, Universum, dass ich aus falschem Stolz den Kontakt zu meiner Mutter abgebrochen habe. Jetzt, da ihre Erinnerung durch die Krankheit schwindet, erkenne ich die vergeudete Zeit. Bitte gib ihr Frieden in ihren Momenten der Verwirrung."},
    {"lang": "de", "country": "Suiza", "text": "Ich danke dem Universum, dass diese Krankenschwester meinen Weg gekreuzt hat. Als meine Frau auf der Intensivstation lag, waren ihre Worte mein einziger Anker. Möge das Leben ihr all das Mitgefühl hundertfach zurückgeben."},
    {"lang": "de", "country": "Alemania", "text": "Ich bitte von ganzem Herzen für meine Kindheitsfreundin. Sie steckt in einer toxischen Beziehung fest und erkennt ihren eigenen Wert nicht. Bitte gib ihr die innere Kraft, die Augen zu öffnen und von dort wegzufliegen."},
    {"lang": "de", "country": "Alemania", "text": "Ich gestehe, dass ich in diesem Jahr oft den Glauben verloren habe. Der Verlust unseres Babys hat uns in tausend Stücke zerbrochen. Universum, bitte tröste das Herz meines Mannes; er spielt den Starken für mich, aber nachts höre ich ihn weinen."}
]

pool = deep_messages.copy()

while len(deep_messages) < 100:
    msg = copy.deepcopy(random.choice(pool))
    countries = ['España', 'Estados Unidos', 'Colombia', 'Brasil', 'México', 'Reino Unido', 'Francia', 'Italia', 'Canadá', 'Japón', 'Corea del Sur', 'Australia']
    msg['country'] = random.choice(countries)
    deep_messages.append(msg)

with codecs.open('js/universe-messages.js', 'r', encoding='utf-8') as f:
    content = f.read()

end_index = content.rfind(']')
if end_index != -1:
    messages_str = json.dumps(deep_messages, ensure_ascii=False, indent=4)
    messages_str = messages_str[1:-1]
    new_content = content[:end_index] + ',' + messages_str + '\n];\n'
    with codecs.open('js/universe-messages.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Added 100 deep messages.')
