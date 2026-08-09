import json
import codecs

new_messages = [
    # SPANISH - Funny & Typos & Teen
    {"lang": "es", "country": "España", "text": "alguien sabe si mi ex me va a desbloquear o me rindo ya? 😭"},
    {"lang": "es", "country": "México", "text": "weeeey ayer le dije mamá a la maestra de ingles q verguenza matame trgame tierra"},
    {"lang": "es", "country": "Argentina", "text": "universo si escuchas esto por favor q baje el precio de la birra 🙏"},
    {"lang": "es", "country": "Chile", "text": "wena po universo ojala aprobar matematicas pq no estudie nah ksjksjs"},
    {"lang": "es", "country": "Colombia", "text": "parce me comi el postre de mi hno y le heche la culpa al perro, ojala q no me descubran xq me matan"},
    {"lang": "es", "country": "España", "text": "aver universo aver si me mandas un novi@ q sea otaku y q huela bien es mucho pedir??"},
    {"lang": "es", "country": "Perú", "text": "pido perdon por robarme el wifi del vecino. la pass es 12345678 x si alguien le sirve"},
    {"lang": "es", "country": "México", "text": "kiero confesar k le di like a una foto de mi ex del 2018 sin kerer. adios vida social."},
    {"lang": "es", "country": "España", "text": "Si el karma existe q se lo lleve a mi profe de biologia. 0,2 decimas loco, 0,2 decimas me faltaban para aprobar."},
    {"lang": "es", "country": "Argentina", "text": "che universo me tiras un centro con la chica del kiosco? la amo ah"},
    {"lang": "es", "country": "España", "text": "Llevo 4 horas intentando hacer este puzzle de 1000 piezas y creo que falta una... universo por qué me odias."},
    {"lang": "es", "country": "Desconocido", "text": "soy la unica q piensa q los pinguinos tienen rodillas pero estan escondidas?"},
    {"lang": "es", "country": "Uruguay", "text": "perdón universo por dormir 14 hs seguidas, es q taba cansadito"},
    {"lang": "es", "country": "Chile", "text": "ctm hoy vi a alguien caerse en la calle y me rei mucho pido perdon porq despues me tropece yo xd karma"},
    {"lang": "es", "country": "Colombia", "text": "universo haz q mañana llueva pa no ir a entrenar xfa"},
    
    # SPANISH - Long stories
    {"lang": "es", "country": "España", "text": "No sé quién leerá esto, pero hoy ha sido un día rarísimo. Me he despertado, he ido al baño, me he lavado los dientes y resulta que había cogido el cepillo de mi compañero de piso, que tiene como 4 meses sin cambiarlo. Luego he ido a hacer café y le he puesto sal en vez de azúcar. Todo mal. Universo, dale reset a mi día por favor, necesito empezar de cero porque no estoy para estos trotes."},
    {"lang": "es", "country": "México", "text": "Te juro que no entiendo a los gatos. Mi gato tiene comida cara, juguetes caros, una cama que parece nube. Y qué hace? Se va a dormir en la caja del paquete de amazon que acaba de llegar, y para colmo la muerde y me escupe los pedazos. Lo amo pero esta loco. Ojala reencarnar en gato, la vdd."},
    {"lang": "es", "country": "Argentina", "text": "Ayer salí a comprar facturas y me cruce con un perrito en la calle. Lo acaricié y me siguió hasta mi casa. Mi vieja dijo que ni loca lo dejaba entrar, pero el perrito puso una cara tan triste que ahora duerme en mi cama y mi vieja le compró un chalequito polar. Ganamos."},
    
    # ENGLISH - Funny & Typos & Teen
    {"lang": "en", "country": "USA", "text": "if he doesnt text back in 5 mins im deleting his number entirely ok nvm he texted me"},
    {"lang": "en", "country": "UK", "text": "plss universe just let me pass this exam i literally opened the book for 10 mins yesterday"},
    {"lang": "en", "country": "Australia", "text": "i ate my roomates cheese and blamed the rats. we dont have rats. im so cooked."},
    {"lang": "en", "country": "Canada", "text": "why tf are mosquitos a thing?? universe explain urself pls"},
    {"lang": "en", "country": "USA", "text": "i accidental y liked his pic from 3 yrs ago.. do i move to nepal and become a monk or"},
    {"lang": "en", "country": "USA", "text": "can u send me like 1 million dollars? its for a school project thx"},
    {"lang": "en", "country": "UK", "text": "im sory mum for breaking ur fav vase when i was 8, i said it was the wind but it was my foot"},
    {"lang": "en", "country": "Ireland", "text": "universe drop me a sign if i should order pizza tonight. (im gonna order it anyway)"},
    {"lang": "en", "country": "USA", "text": "bruh why is everything so expensive now, air is gonna cost money next"},
    {"lang": "en", "country": "New Zealand", "text": "someone tell me why my cat stares at the blank wall for 3 hours every night? ghosts???"},
    {"lang": "en", "country": "USA", "text": "i rlly need a nap but i also need to finish this essay due in 10 mins. nap it is."},
    {"lang": "en", "country": "UK", "text": "forgive me universe i ate a whole tub of ice cream by myself and i feel no regret"},
    {"lang": "en", "country": "Canada", "text": "if aliens are real pls come pick me up i dont wanna do taxes anymore"},
    {"lang": "en", "country": "Australia", "text": "lol i tripped over my own feet in front of my crush. going to go evaporate now."},
    {"lang": "en", "country": "USA", "text": "pls let taylor swift notice me"},
    
    # ENGLISH - Long stories
    {"lang": "en", "country": "USA", "text": "Okay so basically I went to the store to get milk, right? And I see this guy who looks EXACTLY like my high school teacher. So I walk up to him, tap his shoulder, and shout 'MR. HENDERSON!'. The guy turns around, and it's literally just some 20-year-old dude in a sweater vest. He looked so scared. I just walked backward slowly into the produce aisle. I can never go back to that Walmart ever again."},
    {"lang": "en", "country": "UK", "text": "I really need to confess this somewhere. I have been watering my office plant for 6 months now. I talked to it, gave it sunlight, and even bought special fertilizer. Today, a leaf fell off and I picked it up... It's plastic. The whole plant is fake. I've been giving emotional support and fertilizer to a piece of plastic for half a year."},
    {"lang": "en", "country": "Canada", "text": "Universe, I just want to say thank you for dogs. Like, honestly, what did we do to deserve them? My dog just sneezed, looked surprised, and then brought me a sock. It's not even a clean sock. But I love him so much I might actually cry. That is all."},

    # FRENCH
    {"lang": "fr", "country": "France", "text": "j'ai faim mais la flemme de me lever. l'univers envoie moi une pizza stp."},
    {"lang": "fr", "country": "Belgique", "text": "pourkoi mon ex m'envoie un msg a 2h du mat? je reponds ou je bloque??"},
    {"lang": "fr", "country": "Suisse", "text": "pardon maman g cassé ton vase préféré et g accusé le chat... 😭"},
    {"lang": "fr", "country": "France", "text": "je veux juste un ptit ami ki aime les animes et les chats. univers tu meçoute?"},
    {"lang": "fr", "country": "Canada", "text": "est ce ke qqn sait si les pinguins ont des genoux?? c urgent"},
    {"lang": "fr", "country": "France", "text": "je dois etudier pour mon exam mais je regarde des videos de chats sur tiktok depuis 4h. help."},
    {"lang": "fr", "country": "France", "text": "pk le lundi est une chose ki existe? supprimons le lundi."},
    {"lang": "fr", "country": "France", "text": "Il m'est arrivé un truc de fou. J'étais dans le bus, j'ai cru voir un pote, je lui ai fait un grand signe de la main avec un sourire énorme. Il m'a fixé sans rien dire. C'était un inconnu total. J'ai fait semblant de dire bonjour à une mouche qui volait. J'ai envie de disparaître dans un trou noir."},

    # ITALIAN
    {"lang": "it", "country": "Italia", "text": "perche mi ha visualizzato e nn mi risponde da 3 ore??? piango"},
    {"lang": "it", "country": "Italia", "text": "scusa universo ma oggi nn voglio far nnt, sto a letto tutto il giorno byee"},
    {"lang": "it", "country": "Italia", "text": "ho mangiato l'ultima fetta di torta di mio fratello. pregate x me, sono morto."},
    {"lang": "it", "country": "Italia", "text": "universo fammi prendere 30 al prossimo esame anche se non ho studiato un cazzo 🙏"},
    {"lang": "it", "country": "Italia", "text": "che figura di merda in palestra sono caduta dal tapis roulant davanti al ragazzo che mi piace.. voglio morire ahaha"},
    {"lang": "it", "country": "Italia", "text": "Ho appena salutato con la mano una persona che stava salutando quello dietro di me. Non so come riprendermi da questa umiliazione pubblica. Universo fammi trasferire su marte domani."},

    # GERMAN
    {"lang": "de", "country": "Deutschland", "text": "hab hunger. universum, schick mir nen döner pls"},
    {"lang": "de", "country": "Österreich", "text": "warum sind Montage eigentlich legal?? verbietet Montage"},
    {"lang": "de", "country": "Deutschland", "text": "hab ausversehen das alte bild von meinem ex geliket.. kann ich mich jez vergraben?"},
    {"lang": "de", "country": "Schweiz", "text": "ich sollte lernen aber stattdessen schaue ich katzen videos rip meine noten"},
    {"lang": "de", "country": "Deutschland", "text": "sorry mama hab deinen lieblingsteller kaputt gemacht und gesagt es war der hund"},
    {"lang": "de", "country": "Deutschland", "text": "Heute im Supermarkt hab ich 'Danke, gleichfalls!' gesagt, als die Kassiererin meinte: 'Zahlen sie mit Karte?'... Ich bin einfach gegangen ohne die Einkäufe. Mein Leben ist ein Witz."},

    # PORTUGUESE
    {"lang": "pt", "country": "Brasil", "text": "universo pq ele visualiza e nao responde??? q odioo 🤡"},
    {"lang": "pt", "country": "Portugal", "text": "hoje n vou fazer nd da vida, preguiça mode on"},
    {"lang": "pt", "country": "Brasil", "text": "comi o bolo da minha irma e culpei o cachorro. q deus me perdoe kkkk"},
    {"lang": "pt", "country": "Brasil", "text": "fui acenar pra uma pessoa e ela tava acenando pra quem tava atras de mim. qro sumir da terra adeus"},
    {"lang": "pt", "country": "Brasil", "text": "se eu não passar nessa materia eu vou chorar tanto plmdds universo me ajuda"},
    {"lang": "pt", "country": "Portugal", "text": "Gente, eu estava no autocarro, adormeci e babei-me no ombro de um senhor desconhecido. Quando acordei ele estava a olhar para mim com pena. Nunca mais ando de transportes públicos, vou a pé para todo o lado."},

    # JAPANESE
    {"lang": "ja", "country": "Japan", "text": "明日テストだけど全く勉強してない。宇宙よ、私に奇跡をwww"},
    {"lang": "ja", "country": "Japan", "text": "元カレの3年前の写真間違えていいねしちゃった…もう終わった…"},
    {"lang": "ja", "country": "Japan", "text": "ダイエット中なのに深夜にラーメン食べちゃいました。許して…"},
    {"lang": "ja", "country": "Japan", "text": "なんで月曜日って存在するの？消してほしい"},
    {"lang": "ja", "country": "Japan", "text": "今日、知らない人に全力で手振っちゃった。恥ずかしすぎて穴があったら入りたい。"},
    {"lang": "ja", "country": "Japan", "text": "電車の中で寝過ごして、起きたら全然知らない駅にいた。しかも終電ないし。宇宙さん、私の人生ハードモードすぎませんか？とりあえず歩いて帰ります。"},

    # MORE MIXED/EVERYDAY/TEEN/FUNNY (to reach 100)
    {"lang": "es", "country": "México", "text": "no kiero ser adulto, todo es cobrar facturas y q te duela la espalda 🥲"},
    {"lang": "es", "country": "España", "text": "Me he dejado las llaves dentro de casa 3 veces esta semana. Confirmo que no soy muy listo."},
    {"lang": "es", "country": "Colombia", "text": "universo si m das plata no m quejo ok"},
    {"lang": "es", "country": "Argentina", "text": "odio madrugar loco. es contra mi naturaleza"},
    {"lang": "es", "country": "Chile", "text": "weon me compre una polera carisima y la manche con ketchup el primer dia..."},
    {"lang": "es", "country": "Ecuador", "text": "es normal hablar solo? a veces me caigo re bien"},
    {"lang": "es", "country": "Perú", "text": "por q las palomas caminan como si estuvieran escuchando cumbia?"},
    {"lang": "es", "country": "República Dominicana", "text": "klk universo tamo aqui chilling sin hacer na, mandame un iPhone vdd q si"},
    {"lang": "es", "country": "España", "text": "hoy decidí hacer ejercicio y casi me da un parraque a los 5 min. creo q el fitness no es lo mio"},
    {"lang": "es", "country": "México", "text": "kiero takos, pero tengo sueño. que dilema mas grande la vrdad"},
    
    {"lang": "en", "country": "USA", "text": "is it normal that i talk to my roomba? i named him jeffrey and he is a good boy."},
    {"lang": "en", "country": "UK", "text": "someone tell the weather to make up its mind it was sunny 5 mins ago now its raining sideways"},
    {"lang": "en", "country": "Australia", "text": "just saw a spider the size of my hand... guess i have to burn the house down now."},
    {"lang": "en", "country": "Canada", "text": "im sorry for all the stupid things i said when i was 14. i cringe everyday thinking abt it."},
    {"lang": "en", "country": "USA", "text": "why do hot dogs come in packs of 10 but buns come in packs of 8??? this is a conspiracy."},
    {"lang": "en", "country": "India", "text": "universe pls let my code compile on the first try today without errors thx"},
    {"lang": "en", "country": "South Africa", "text": "i wish i was a cat. sleep 16 hrs a day, get free food, knock stuff off tables. ideal life."},
    
    {"lang": "fr", "country": "France", "text": "j'ai perdu mes lunettes et je les cherchais partout... elles etaient sur ma tete. je suis un genie."},
    {"lang": "fr", "country": "France", "text": "l'univers, donne moi la force de faire le menage aujd pck c un desastre ici."},
    
    {"lang": "it", "country": "Italia", "text": "ho perso le chiavi di casa x la 3 volta sto mese. la mia vita e' un disastro ahah"},
    {"lang": "it", "country": "Italia", "text": "ma xke la pizza hawaiiana esiste? chi l'ha inventata voleva vederci soffrire."},
    
    {"lang": "de", "country": "Deutschland", "text": "bin ich der einzige der im supermarkt immer vergisst warum er da ist??"},
    {"lang": "de", "country": "Österreich", "text": "liebes universum, mach dass kaffee gesund für immer ist. danke."},
    
    {"lang": "pt", "country": "Brasil", "text": "queria ser rico pra nao ter q acordar as 6 da manha todo dia sofrimento"},
    {"lang": "pt", "country": "Brasil", "text": "a vida do crente nao eh facil... mas bora la ne"},
    {"lang": "pt", "country": "Portugal", "text": "queria um pastel de nata agr msm... universo providencia pff"},
    
    {"lang": "ja", "country": "Japan", "text": "猫になりたい。ずっと寝てたいし、飼い主にご飯もらえるし。最高じゃん。"},
    {"lang": "ja", "country": "Japan", "text": "スマホ落として画面割れた…立ち直れない😭"},

    # RANDOM THOUGHTS & CONFESSIONS
    {"lang": "es", "country": "España", "text": "confieso q a veces huelo mis propios pedos y no me desagradan. q asco perdon"},
    {"lang": "es", "country": "México", "text": "wey lit tengo 0 ganas de existir el día de hoy, universo dame paciencia"},
    {"lang": "es", "country": "Argentina", "text": "mi pasion es escuchar musica triste imaginando historias falsas q me hagan llorar"},
    {"lang": "es", "country": "Chile", "text": "tengo sueño to el dia pero en la noche mi cerebro decide pensar en el origen del universo zzz"},
    {"lang": "es", "country": "Colombia", "text": "ayuda no supero a mi ex de hace 3 años toy re loca"},
    {"lang": "es", "country": "Perú", "text": "odio el verano hace muxo calor prefiero el invierno mil veces"},
    {"lang": "es", "country": "España", "text": "si un dia me pierdo, buscadme en la seccion de chocolates del mercadona."},
    {"lang": "es", "country": "Argentina", "text": "pido mil perdones a mi perrito por haberle pisado la patita sin kerer hoy a la mñn. lloro."},
    {"lang": "es", "country": "México", "text": "ay universo xfavor q saquen ya la nueva temp de mi serie favorita q no aguanto mas"},
    {"lang": "es", "country": "Uruguay", "text": "amo los dias de lluvia para quedarme en casa jugando a la pc y comiendo tortas fritas uwu"},
    
    {"lang": "en", "country": "USA", "text": "my toxic trait is buying books and never reading them, just stacking them to look smart"},
    {"lang": "en", "country": "UK", "text": "im convinced my microwave makes things colder on the inside on purpose just to spite me"},
    {"lang": "en", "country": "Australia", "text": "universe drop a meteor on my workplace so i dont have to go in tomorrow plz"},
    {"lang": "en", "country": "Canada", "text": "does anyone else practice fake arguments in the shower and win every time?"},
    {"lang": "en", "country": "USA", "text": "my brain is literally 90% song lyrics and 10% anxiety"},
    {"lang": "en", "country": "Ireland", "text": "just ate an entire pack of biscuits in one sitting... no regrets at all"},
    {"lang": "en", "country": "USA", "text": "universe if u could make me lose 10 pounds without me working out that would be great"},
    
    {"lang": "fr", "country": "France", "text": "je deteste les moustiques, a quoi ca sert franchement ?"},
    {"lang": "fr", "country": "Suisse", "text": "si l'univers mendend, stp fais disparaitre la coriandre de la surface de la terre. ca a le gout du savon."},
    
    {"lang": "it", "country": "Italia", "text": "amo il gelato al pistacchio piu della mia vita vera"},
    {"lang": "it", "country": "Italia", "text": "odio il lunedi con tutto il mio cuore. abolite i lunedi x favore."},
    
    {"lang": "de", "country": "Deutschland", "text": "meine lieblingstätigkeit ist schlafen. ich könnte 20 stunden am stück schlafen."},
    {"lang": "de", "country": "Österreich", "text": "bitte lass es morgen schnee haben, ich will nicht zur arbeit."},
    
    {"lang": "pt", "country": "Brasil", "text": "minha paixao eh dormir, se deixarem eu durmo 20 horas por dia"},
    {"lang": "pt", "country": "Brasil", "text": "odeio acordar cedo, parece q minha alma sai do corpo e se recusa a voltar"},
    
    {"lang": "ja", "country": "Japan", "text": "布団から出たくない…冬の朝は地獄すぎる。"},
    {"lang": "ja", "country": "Japan", "text": "夜中に食べるカップ麺の美味しさは異常。罪悪感も異常。"},

    # FINAL BATCH TO ENSURE ~100
    {"lang": "es", "country": "España", "text": "Hoy mi abuela me ha preguntado cómo se apaga el internet. Y le he dicho que sople muy fuerte el router. Lo ha hecho. Universo, soy una mala persona, pero qué risa me ha dado."},
    {"lang": "en", "country": "USA", "text": "i accidentally told the waiter 'you too' when he said 'enjoy your meal'. im moving to another state immediately."},
    {"lang": "pt", "country": "Brasil", "text": "tropa do calvo qnts aqui tao ficando careca tbm kkkk luto mt pra aceitar"},
    {"lang": "fr", "country": "France", "text": "j'ai dit 'je t'aime' a la fin de mon appel pro a mon boss par habitude. au secours, trouvez moi un autre boulot."},
    {"lang": "de", "country": "Deutschland", "text": "ich hab im fahrstuhl gepupst und dann is der süße nachbar eingestiegen. bye."},
    {"lang": "it", "country": "Italia", "text": "ho detto ciao alla professoressa credendo fosse mia zia. la miopia mi rovinera."},
    {"lang": "ja", "country": "Japan", "text": "お母さんを先生と呼んでしまった…教室が静まり返った…消えたい"},
    {"lang": "es", "country": "México", "text": "Ojala q los aguacates no fueran tan caros... duele en el cora wey"},
    {"lang": "en", "country": "Australia", "text": "ive been calling my neighbor 'steve' for 3 years and just found out his name is brian. its too late to change now."},
    {"lang": "es", "country": "Argentina", "text": "che q onda pq los bondis siempre pasan tds juntos o no pasa ninguno??"},
    {"lang": "es", "country": "Chile", "text": "universo wn me duele la wata por comer tantos doritos qliao aiuda"},
    {"lang": "en", "country": "USA", "text": "sorry mom i am the one who scratched the car not the dog"}
]

with codecs.open('C:/Users/Kivan/.gemini/antigravity/scratch/oris-numen/js/universe-messages.js', 'r', 'utf-8') as f:
    content = f.read()

# We want to append this to the universeMessages array.
# The file ends with ];
# Let's parse the string and inject our messages before the last ]

new_messages_str = json.dumps(new_messages, indent=4, ensure_ascii=False)
new_messages_str = new_messages_str[1:-1] # remove [ ]

# find the last closing bracket
idx = content.rfind(']')
if idx != -1:
    new_content = content[:idx] + ',\n' + new_messages_str + '\n' + content[idx:]
    with codecs.open('C:/Users/Kivan/.gemini/antigravity/scratch/oris-numen/js/universe-messages.js', 'w', 'utf-8') as f:
        f.write(new_content)
    print("Added messages!")
else:
    print("Could not find ]")
