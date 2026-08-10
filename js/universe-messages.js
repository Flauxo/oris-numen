const universeMessages = [
    { lang: 'es', country: 'España', text: 'Quiero ponerme buenorra.' },
    { lang: 'es', country: 'México', text: 'Quiero que mi tía Paqui se cure de su cáncer de estómago.' },
    { lang: 'es', country: 'Colombia', text: 'Gracias por aceptarme en el gimnasio, por fin daré el paso.' },
    { lang: 'es', country: 'Argentina', text: 'Deseo aprobar todos los exámenes de la facultad este año.' },
    { lang: 'es', country: 'Chile', text: 'Espero encontrar pronto un trabajo que me haga feliz.' },
    { lang: 'es', country: 'Perú', text: 'Que mi familia tenga paz y nunca les falte el pan.' },
    { lang: 'es', country: 'España', text: 'Necesito olvidar a mi ex de una vez por todas.' },
    { lang: 'es', country: 'México', text: 'Ojalá mi emprendimiento empiece a dar frutos pronto.' },
    { lang: 'es', country: 'Uruguay', text: 'Quiero viajar por el mundo sin preocupaciones.' },
    { lang: 'es', country: 'Ecuador', text: 'Pido fuerza para superar esta depresión que me ahoga.' },
    { lang: 'es', country: 'Venezuela', text: 'Deseo volver a ver a mi familia reunida.' },
    { lang: 'es', country: 'España', text: 'Que mi gato se recupere de la operación.' },
    { lang: 'es', country: 'Bolivia', text: 'Quiero aprender a amarme a mí mismo.' },
    { lang: 'es', country: 'Paraguay', text: 'Espero que este año sea el mejor de mi vida.' },
    { lang: 'es', country: 'España', text: 'Necesito dinero para pagar las deudas.' },
    { lang: 'es', country: 'República Dominicana', text: 'Que el amor verdadero llegue a mi puerta.' },
    { lang: 'es', country: 'Costa Rica', text: 'Deseo salud plena para mis padres.' },
    { lang: 'es', country: 'Panamá', text: 'Quiero ganar el campeonato de mi barrio.' },
    { lang: 'es', country: 'Guatemala', text: 'Espero que mi hijo consiga la beca.' },
    { lang: 'es', country: 'Honduras', text: 'Pido por la paz en mi corazón y en mi mente.' },
    { lang: 'en', country: 'United States', text: 'I want to finally buy my own house.' },
    { lang: 'en', country: 'United Kingdom', text: 'Hope I get that promotion at work.' },
    { lang: 'en', country: 'Canada', text: 'I wish my dog would live forever.' },
    { lang: 'en', country: 'Australia', text: 'Please let me find my soulmate this year.' },
    { lang: 'en', country: 'New Zealand', text: 'I want to be free from anxiety and fear.' },
    { lang: 'en', country: 'United States', text: 'Just want to be happy again.' },
    { lang: 'en', country: 'Ireland', text: 'Let my business thrive and prosper.' },
    { lang: 'en', country: 'United States', text: 'I hope my sister beats her illness.' },
    { lang: 'en', country: 'United Kingdom', text: 'Give me the strength to quit smoking.' },
    { lang: 'en', country: 'South Africa', text: 'I wish for financial stability for my family.' },
    { lang: 'en', country: 'India', text: 'May I clear the civil services exam.' },
    { lang: 'en', country: 'United States', text: 'I want to lose 20 pounds before summer.' },
    { lang: 'en', country: 'Canada', text: 'Help me find the courage to start over.' },
    { lang: 'en', country: 'Australia', text: 'I wish to travel to Japan next year.' },
    { lang: 'en', country: 'United States', text: 'May my newborn baby grow up healthy.' },
    { lang: 'jp', country: 'Japón', text: 'どうしてもあの人と結ばれたい。' },
    { lang: 'jp', country: 'Japón', text: '家族全員が健康で過ごせますように。' },
    { lang: 'jp', country: 'Japón', text: '試験に合格して夢を叶えたい。' },
    { lang: 'jp', country: 'Japón', text: '仕事のストレスから解放されたい。' },
    { lang: 'jp', country: 'Japón', text: '宝くじが当たりますように。' },
    { lang: 'jp', country: 'Japón', text: '自分に自信が持てるようになりたい。' },
    { lang: 'jp', country: 'Japón', text: '新しい友達がたくさんできますように。' },
    { lang: 'jp', country: 'Japón', text: '世界中を旅してみたい。' },
    { lang: 'jp', country: 'Japón', text: '病気が早く治りますように。' },
    { lang: 'jp', country: 'Japón', text: '毎日笑顔でいられますように。' },
    { lang: 'zh', country: 'China', text: '希望能找到一份好工作。' },
    { lang: 'zh', country: 'China', text: '愿家人身体健康，平平安安。' },
    { lang: 'zh', country: 'China', text: '希望今年能顺利脱单。' },
    { lang: 'zh', country: 'China', text: '想要赚大钱，买大房子。' },
    { lang: 'zh', country: 'China', text: '愿考研顺利上岸。' },
    { lang: 'zh', country: 'China', text: '希望能早日摆脱抑郁症。' },
    { lang: 'zh', country: 'China', text: '希望父母长命百岁。' },
    { lang: 'zh', country: 'China', text: '想要去世界各地看一看。' },
    { lang: 'zh', country: 'China', text: '愿所有的努力都有回报。' },
    { lang: 'zh', country: 'China', text: '希望每天都能开心快乐。' },
    { lang: 'ar', country: 'Egipto', text: 'أتمنى أن أجد وظيفة أحلامي قريبًا.' },
    { lang: 'ar', country: 'Arabia Saudita', text: 'اللهم اشفِ والدتي من مرضها.' },
    { lang: 'ar', country: 'Marruecos', text: 'أتمنى أن يعم السلام في قلبي وفي العالم.' },
    { lang: 'ar', country: 'Emiratos Árabes Unidos', text: 'أريد أن أصبح رائد أعمال ناجح.' },
    { lang: 'ar', country: 'Jordania', text: 'اللهم ارزقني الذرية الصالحة.' },
    { lang: 'ar', country: 'Líbano', text: 'أتمنى أن أتخلص من الديون التي تثقل كاهلي.' },
    { lang: 'ar', country: 'Argelia', text: 'أريد أن أتعلم لغة جديدة هذا العام.' },
    { lang: 'ar', country: 'Túnez', text: 'أتمنى أن أسافر إلى مكة المكرمة.' },
    { lang: 'ar', country: 'Irak', text: 'اللهم احفظ عائلتي من كل سوء.' },
    { lang: 'ar', country: 'Egipto', text: 'أتمنى أن أحقق جميع أهدافي.' },
    { lang: 'fr', country: 'Francia', text: 'Je veux trouver l\'amour de ma vie.' },
    { lang: 'fr', country: 'Canadá', text: 'Que ma famille soit toujours en bonne santé.' },
    { lang: 'fr', country: 'Bélgica', text: 'J\'espère réussir mes examens cette année.' },
    { lang: 'fr', country: 'Suiza', text: 'Je souhaite avoir le courage de changer de carrière.' },
    { lang: 'fr', country: 'Francia', text: 'Que la paix revienne dans mon esprit.' },
    { lang: 'fr', country: 'Marruecos', text: 'Je veux acheter une belle maison pour mes parents.' },
    { lang: 'fr', country: 'Francia', text: 'J\'espère que mon projet artistique va décoller.' },
    { lang: 'de', country: 'Alemania', text: 'Ich möchte endlich glücklich sein.' },
    { lang: 'de', country: 'Austria', text: 'Hoffentlich finde ich einen besseren Job.' },
    { lang: 'de', country: 'Suiza', text: 'Ich wünsche mir Gesundheit für meine ganze Familie.' },
    { lang: 'de', country: 'Alemania', text: 'Dass meine Katze sich schnell erholt.' },
    { lang: 'de', country: 'Alemania', text: 'Ich möchte die Welt bereisen.' },
    { lang: 'it', country: 'Italia', text: 'Voglio trovare la pace interiore.' },
    { lang: 'it', country: 'Italia', text: 'Spero che mia madre guarisca presto.' },
    { lang: 'it', country: 'Suiza', text: 'Vorrei comprare una casa in campagna.' },
    { lang: 'it', country: 'Italia', text: 'Che la mia azienda abbia successo.' },
    { lang: 'it', country: 'Italia', text: 'Voglio innamorarmi di nuovo.' },
    { lang: 'pt', country: 'Brasil', text: 'Quero passar no concurso público.' },
    { lang: 'pt', country: 'Portugal', text: 'Espero encontrar um amor verdadeiro.' },
    { lang: 'pt', country: 'Brasil', text: 'Que a minha família tenha muita saúde e paz.' },
    { lang: 'pt', country: 'Brasil', text: 'Desejo ter estabilidade financeira.' },
    { lang: 'pt', country: 'Angola', text: 'Quero curar a minha ansiedade.' },
    { lang: 'ru', country: 'Rusia', text: 'Я хочу найти свою настоящую любовь.' },
    { lang: 'ru', country: 'Rusia', text: 'Пусть моя семья будет здорова и счастлива.' },
    { lang: 'ru', country: 'Bielorrusia', text: 'Надеюсь, что найду хорошую работу.' },
    { lang: 'ru', country: 'Kazajistán', text: 'Хочу путешествовать по всему миру.' },
    { lang: 'ru', country: 'Rusia', text: 'Желаю мира и спокойствия в душе.' },
    { lang: 'ko', country: 'Corea del Sur', text: '좋은 직장에 취직하고 싶어요.' },
    { lang: 'ko', country: 'Corea del Sur', text: '가족 모두 건강하고 행복했으면 좋겠습니다.' },
    { lang: 'ko', country: 'Corea del Sur', text: '올해는 꼭 좋은 인연을 만나고 싶어요.' },
    { lang: 'ko', country: 'Corea del Sur', text: '로또에 당첨되게 해주세요.' },
    { lang: 'ko', country: 'Corea del Sur', text: '우울증을 극복하고 다시 웃고 싶습니다.' },
    { lang: 'nl', country: 'Países Bajos', text: 'Ik hoop dat ik snel een leuke partner vind.' },
    { lang: 'nl', country: 'Bélgica', text: 'Dat mijn familie gezond en gelukkig mag blijven.' },
    { lang: 'sv', country: 'Suecia', text: 'Jag vill hitta inre frid och harmoni.' },
    { lang: 'sv', country: 'Suecia', text: 'Hoppas att jag får jobbet jag sökte.' },
    { lang: 'tr', country: 'Turquía', text: 'Ailemle birlikte huzurlu bir hayat istiyorum.' },
    { lang: 'tr', country: 'Turquía', text: 'Umarım sınavlarımda başarılı olurum.' },
    { lang: 'hi', country: 'India', text: 'मुझे अपने जीवन में शांति और खुशी चाहिए।' },
    { lang: 'hi', country: 'India', text: 'मैं चाहता हूं कि मेरा परिवार हमेशा स्वस्थ रहे।' }
,

    {
        "lang": "es",
        "country": "España",
        "text": "alguien sabe si mi ex me va a desbloquear o me rindo ya? 😭"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "weeeey ayer le dije mamá a la maestra de ingles q verguenza matame trgame tierra"
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "universo si escuchas esto por favor q baje el precio de la birra 🙏"
    },
    {
        "lang": "es",
        "country": "Chile",
        "text": "wena po universo ojala aprobar matematicas pq no estudie nah ksjksjs"
    },
    {
        "lang": "es",
        "country": "Colombia",
        "text": "parce me comi el postre de mi hno y le heche la culpa al perro, ojala q no me descubran xq me matan"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "aver universo aver si me mandas un novi@ q sea otaku y q huela bien es mucho pedir??"
    },
    {
        "lang": "es",
        "country": "Perú",
        "text": "pido perdon por robarme el wifi del vecino. la pass es 12345678 x si alguien le sirve"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "kiero confesar k le di like a una foto de mi ex del 2018 sin kerer. adios vida social."
    },
    {
        "lang": "es",
        "country": "España",
        "text": "Si el karma existe q se lo lleve a mi profe de biologia. 0,2 decimas loco, 0,2 decimas me faltaban para aprobar."
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "che universo me tiras un centro con la chica del kiosco? la amo ah"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "Llevo 4 horas intentando hacer este puzzle de 1000 piezas y creo que falta una... universo por qué me odias."
    },
    {
        "lang": "es",
        "country": "Desconocido",
        "text": "soy la unica q piensa q los pinguinos tienen rodillas pero estan escondidas?"
    },
    {
        "lang": "es",
        "country": "Uruguay",
        "text": "perdón universo por dormir 14 hs seguidas, es q taba cansadito"
    },
    {
        "lang": "es",
        "country": "Chile",
        "text": "ctm hoy vi a alguien caerse en la calle y me rei mucho pido perdon porq despues me tropece yo xd karma"
    },
    {
        "lang": "es",
        "country": "Colombia",
        "text": "universo haz q mañana llueva pa no ir a entrenar xfa"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "No sé quién leerá esto, pero hoy ha sido un día rarísimo. Me he despertado, he ido al baño, me he lavado los dientes y resulta que había cogido el cepillo de mi compañero de piso, que tiene como 4 meses sin cambiarlo. Luego he ido a hacer café y le he puesto sal en vez de azúcar. Todo mal. Universo, dale reset a mi día por favor, necesito empezar de cero porque no estoy para estos trotes."
    },
    {
        "lang": "es",
        "country": "México",
        "text": "Te juro que no entiendo a los gatos. Mi gato tiene comida cara, juguetes caros, una cama que parece nube. Y qué hace? Se va a dormir en la caja del paquete de amazon que acaba de llegar, y para colmo la muerde y me escupe los pedazos. Lo amo pero esta loco. Ojala reencarnar en gato, la vdd."
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "Ayer salí a comprar facturas y me cruce con un perrito en la calle. Lo acaricié y me siguió hasta mi casa. Mi vieja dijo que ni loca lo dejaba entrar, pero el perrito puso una cara tan triste que ahora duerme en mi cama y mi vieja le compró un chalequito polar. Ganamos."
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "if he doesnt text back in 5 mins im deleting his number entirely ok nvm he texted me"
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "plss universe just let me pass this exam i literally opened the book for 10 mins yesterday"
    },
    {
        "lang": "en",
        "country": "Australia",
        "text": "i ate my roomates cheese and blamed the rats. we dont have rats. im so cooked."
    },
    {
        "lang": "en",
        "country": "Canada",
        "text": "why tf are mosquitos a thing?? universe explain urself pls"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "i accidental y liked his pic from 3 yrs ago.. do i move to nepal and become a monk or"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "can u send me like 1 million dollars? its for a school project thx"
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "im sory mum for breaking ur fav vase when i was 8, i said it was the wind but it was my foot"
    },
    {
        "lang": "en",
        "country": "Ireland",
        "text": "universe drop me a sign if i should order pizza tonight. (im gonna order it anyway)"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "bruh why is everything so expensive now, air is gonna cost money next"
    },
    {
        "lang": "en",
        "country": "New Zealand",
        "text": "someone tell me why my cat stares at the blank wall for 3 hours every night? ghosts???"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "i rlly need a nap but i also need to finish this essay due in 10 mins. nap it is."
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "forgive me universe i ate a whole tub of ice cream by myself and i feel no regret"
    },
    {
        "lang": "en",
        "country": "Canada",
        "text": "if aliens are real pls come pick me up i dont wanna do taxes anymore"
    },
    {
        "lang": "en",
        "country": "Australia",
        "text": "lol i tripped over my own feet in front of my crush. going to go evaporate now."
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "pls let taylor swift notice me"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "Okay so basically I went to the store to get milk, right? And I see this guy who looks EXACTLY like my high school teacher. So I walk up to him, tap his shoulder, and shout 'MR. HENDERSON!'. The guy turns around, and it's literally just some 20-year-old dude in a sweater vest. He looked so scared. I just walked backward slowly into the produce aisle. I can never go back to that Walmart ever again."
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "I really need to confess this somewhere. I have been watering my office plant for 6 months now. I talked to it, gave it sunlight, and even bought special fertilizer. Today, a leaf fell off and I picked it up... It's plastic. The whole plant is fake. I've been giving emotional support and fertilizer to a piece of plastic for half a year."
    },
    {
        "lang": "en",
        "country": "Canada",
        "text": "Universe, I just want to say thank you for dogs. Like, honestly, what did we do to deserve them? My dog just sneezed, looked surprised, and then brought me a sock. It's not even a clean sock. But I love him so much I might actually cry. That is all."
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "j'ai faim mais la flemme de me lever. l'univers envoie moi une pizza stp."
    },
    {
        "lang": "fr",
        "country": "Belgique",
        "text": "pourkoi mon ex m'envoie un msg a 2h du mat? je reponds ou je bloque??"
    },
    {
        "lang": "fr",
        "country": "Suisse",
        "text": "pardon maman g cassé ton vase préféré et g accusé le chat... 😭"
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "je veux juste un ptit ami ki aime les animes et les chats. univers tu meçoute?"
    },
    {
        "lang": "fr",
        "country": "Canada",
        "text": "est ce ke qqn sait si les pinguins ont des genoux?? c urgent"
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "je dois etudier pour mon exam mais je regarde des videos de chats sur tiktok depuis 4h. help."
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "pk le lundi est une chose ki existe? supprimons le lundi."
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "Il m'est arrivé un truc de fou. J'étais dans le bus, j'ai cru voir un pote, je lui ai fait un grand signe de la main avec un sourire énorme. Il m'a fixé sans rien dire. C'était un inconnu total. J'ai fait semblant de dire bonjour à une mouche qui volait. J'ai envie de disparaître dans un trou noir."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "perche mi ha visualizzato e nn mi risponde da 3 ore??? piango"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "scusa universo ma oggi nn voglio far nnt, sto a letto tutto il giorno byee"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "ho mangiato l'ultima fetta di torta di mio fratello. pregate x me, sono morto."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "universo fammi prendere 30 al prossimo esame anche se non ho studiato un cazzo 🙏"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "che figura di merda in palestra sono caduta dal tapis roulant davanti al ragazzo che mi piace.. voglio morire ahaha"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "Ho appena salutato con la mano una persona che stava salutando quello dietro di me. Non so come riprendermi da questa umiliazione pubblica. Universo fammi trasferire su marte domani."
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "hab hunger. universum, schick mir nen döner pls"
    },
    {
        "lang": "de",
        "country": "Österreich",
        "text": "warum sind Montage eigentlich legal?? verbietet Montage"
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "hab ausversehen das alte bild von meinem ex geliket.. kann ich mich jez vergraben?"
    },
    {
        "lang": "de",
        "country": "Schweiz",
        "text": "ich sollte lernen aber stattdessen schaue ich katzen videos rip meine noten"
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "sorry mama hab deinen lieblingsteller kaputt gemacht und gesagt es war der hund"
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "Heute im Supermarkt hab ich 'Danke, gleichfalls!' gesagt, als die Kassiererin meinte: 'Zahlen sie mit Karte?'... Ich bin einfach gegangen ohne die Einkäufe. Mein Leben ist ein Witz."
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "universo pq ele visualiza e nao responde??? q odioo 🤡"
    },
    {
        "lang": "pt",
        "country": "Portugal",
        "text": "hoje n vou fazer nd da vida, preguiça mode on"
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "comi o bolo da minha irma e culpei o cachorro. q deus me perdoe kkkk"
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "fui acenar pra uma pessoa e ela tava acenando pra quem tava atras de mim. qro sumir da terra adeus"
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "se eu não passar nessa materia eu vou chorar tanto plmdds universo me ajuda"
    },
    {
        "lang": "pt",
        "country": "Portugal",
        "text": "Gente, eu estava no autocarro, adormeci e babei-me no ombro de um senhor desconhecido. Quando acordei ele estava a olhar para mim com pena. Nunca mais ando de transportes públicos, vou a pé para todo o lado."
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "明日テストだけど全く勉強してない。宇宙よ、私に奇跡をwww"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "元カレの3年前の写真間違えていいねしちゃった…もう終わった…"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "ダイエット中なのに深夜にラーメン食べちゃいました。許して…"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "なんで月曜日って存在するの？消してほしい"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "今日、知らない人に全力で手振っちゃった。恥ずかしすぎて穴があったら入りたい。"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "電車の中で寝過ごして、起きたら全然知らない駅にいた。しかも終電ないし。宇宙さん、私の人生ハードモードすぎませんか？とりあえず歩いて帰ります。"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "no kiero ser adulto, todo es cobrar facturas y q te duela la espalda 🥲"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "Me he dejado las llaves dentro de casa 3 veces esta semana. Confirmo que no soy muy listo."
    },
    {
        "lang": "es",
        "country": "Colombia",
        "text": "universo si m das plata no m quejo ok"
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "odio madrugar loco. es contra mi naturaleza"
    },
    {
        "lang": "es",
        "country": "Chile",
        "text": "weon me compre una polera carisima y la manche con ketchup el primer dia..."
    },
    {
        "lang": "es",
        "country": "Ecuador",
        "text": "es normal hablar solo? a veces me caigo re bien"
    },
    {
        "lang": "es",
        "country": "Perú",
        "text": "por q las palomas caminan como si estuvieran escuchando cumbia?"
    },
    {
        "lang": "es",
        "country": "República Dominicana",
        "text": "klk universo tamo aqui chilling sin hacer na, mandame un iPhone vdd q si"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "hoy decidí hacer ejercicio y casi me da un parraque a los 5 min. creo q el fitness no es lo mio"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "kiero takos, pero tengo sueño. que dilema mas grande la vrdad"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "is it normal that i talk to my roomba? i named him jeffrey and he is a good boy."
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "someone tell the weather to make up its mind it was sunny 5 mins ago now its raining sideways"
    },
    {
        "lang": "en",
        "country": "Australia",
        "text": "just saw a spider the size of my hand... guess i have to burn the house down now."
    },
    {
        "lang": "en",
        "country": "Canada",
        "text": "im sorry for all the stupid things i said when i was 14. i cringe everyday thinking abt it."
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "why do hot dogs come in packs of 10 but buns come in packs of 8??? this is a conspiracy."
    },
    {
        "lang": "en",
        "country": "India",
        "text": "universe pls let my code compile on the first try today without errors thx"
    },
    {
        "lang": "en",
        "country": "South Africa",
        "text": "i wish i was a cat. sleep 16 hrs a day, get free food, knock stuff off tables. ideal life."
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "j'ai perdu mes lunettes et je les cherchais partout... elles etaient sur ma tete. je suis un genie."
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "l'univers, donne moi la force de faire le menage aujd pck c un desastre ici."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "ho perso le chiavi di casa x la 3 volta sto mese. la mia vita e' un disastro ahah"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "ma xke la pizza hawaiiana esiste? chi l'ha inventata voleva vederci soffrire."
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "bin ich der einzige der im supermarkt immer vergisst warum er da ist??"
    },
    {
        "lang": "de",
        "country": "Österreich",
        "text": "liebes universum, mach dass kaffee gesund für immer ist. danke."
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "queria ser rico pra nao ter q acordar as 6 da manha todo dia sofrimento"
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "a vida do crente nao eh facil... mas bora la ne"
    },
    {
        "lang": "pt",
        "country": "Portugal",
        "text": "queria um pastel de nata agr msm... universo providencia pff"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "猫になりたい。ずっと寝てたいし、飼い主にご飯もらえるし。最高じゃん。"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "スマホ落として画面割れた…立ち直れない😭"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "confieso q a veces huelo mis propios pedos y no me desagradan. q asco perdon"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "wey lit tengo 0 ganas de existir el día de hoy, universo dame paciencia"
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "mi pasion es escuchar musica triste imaginando historias falsas q me hagan llorar"
    },
    {
        "lang": "es",
        "country": "Chile",
        "text": "tengo sueño to el dia pero en la noche mi cerebro decide pensar en el origen del universo zzz"
    },
    {
        "lang": "es",
        "country": "Colombia",
        "text": "ayuda no supero a mi ex de hace 3 años toy re loca"
    },
    {
        "lang": "es",
        "country": "Perú",
        "text": "odio el verano hace muxo calor prefiero el invierno mil veces"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "si un dia me pierdo, buscadme en la seccion de chocolates del mercadona."
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "pido mil perdones a mi perrito por haberle pisado la patita sin kerer hoy a la mñn. lloro."
    },
    {
        "lang": "es",
        "country": "México",
        "text": "ay universo xfavor q saquen ya la nueva temp de mi serie favorita q no aguanto mas"
    },
    {
        "lang": "es",
        "country": "Uruguay",
        "text": "amo los dias de lluvia para quedarme en casa jugando a la pc y comiendo tortas fritas uwu"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "my toxic trait is buying books and never reading them, just stacking them to look smart"
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "im convinced my microwave makes things colder on the inside on purpose just to spite me"
    },
    {
        "lang": "en",
        "country": "Australia",
        "text": "universe drop a meteor on my workplace so i dont have to go in tomorrow plz"
    },
    {
        "lang": "en",
        "country": "Canada",
        "text": "does anyone else practice fake arguments in the shower and win every time?"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "my brain is literally 90% song lyrics and 10% anxiety"
    },
    {
        "lang": "en",
        "country": "Ireland",
        "text": "just ate an entire pack of biscuits in one sitting... no regrets at all"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "universe if u could make me lose 10 pounds without me working out that would be great"
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "je deteste les moustiques, a quoi ca sert franchement ?"
    },
    {
        "lang": "fr",
        "country": "Suisse",
        "text": "si l'univers mendend, stp fais disparaitre la coriandre de la surface de la terre. ca a le gout du savon."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "amo il gelato al pistacchio piu della mia vita vera"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "odio il lunedi con tutto il mio cuore. abolite i lunedi x favore."
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "meine lieblingstätigkeit ist schlafen. ich könnte 20 stunden am stück schlafen."
    },
    {
        "lang": "de",
        "country": "Österreich",
        "text": "bitte lass es morgen schnee haben, ich will nicht zur arbeit."
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "minha paixao eh dormir, se deixarem eu durmo 20 horas por dia"
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "odeio acordar cedo, parece q minha alma sai do corpo e se recusa a voltar"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "布団から出たくない…冬の朝は地獄すぎる。"
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "夜中に食べるカップ麺の美味しさは異常。罪悪感も異常。"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "Hoy mi abuela me ha preguntado cómo se apaga el internet. Y le he dicho que sople muy fuerte el router. Lo ha hecho. Universo, soy una mala persona, pero qué risa me ha dado."
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "i accidentally told the waiter 'you too' when he said 'enjoy your meal'. im moving to another state immediately."
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "tropa do calvo qnts aqui tao ficando careca tbm kkkk luto mt pra aceitar"
    },
    {
        "lang": "fr",
        "country": "France",
        "text": "j'ai dit 'je t'aime' a la fin de mon appel pro a mon boss par habitude. au secours, trouvez moi un autre boulot."
    },
    {
        "lang": "de",
        "country": "Deutschland",
        "text": "ich hab im fahrstuhl gepupst und dann is der süße nachbar eingestiegen. bye."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "ho detto ciao alla professoressa credendo fosse mia zia. la miopia mi rovinera."
    },
    {
        "lang": "ja",
        "country": "Japan",
        "text": "お母さんを先生と呼んでしまった…教室が静まり返った…消えたい"
    },
    {
        "lang": "es",
        "country": "México",
        "text": "Ojala q los aguacates no fueran tan caros... duele en el cora wey"
    },
    {
        "lang": "en",
        "country": "Australia",
        "text": "ive been calling my neighbor 'steve' for 3 years and just found out his name is brian. its too late to change now."
    },
    {
        "lang": "es",
        "country": "Argentina",
        "text": "che q onda pq los bondis siempre pasan tds juntos o no pasa ninguno??"
    },
    {
        "lang": "es",
        "country": "Chile",
        "text": "universo wn me duele la wata por comer tantos doritos qliao aiuda"
    },
    {
        "lang": "en",
        "country": "USA",
        "text": "sorry mom i am the one who scratched the car not the dog"
    }

,
    {
        "lang": "es",
        "country": "España",
        "text": "Universo, por favor te lo pido, haz que Ivan me hable de una vez. Llevo 3 meses mirandole en la bibilioteca y no soy capaz de decirle ni hola. O sea, soy un desastre, necesito una señal divina o un empujoncito. Prometo ser buena el resto del año."
    },
    {
        "lang": "en",
        "country": "United States",
        "text": "I confess, I accidentally ate Martha s sandwich from the fridge yesterday. In my defense, it looked delicious and she wasn't around. I hope she doesn't read this. Universe, please clear my conscience and my karma."
    },
    {
        "lang": "fr",
        "country": "Francia",
        "text": "Cher univers, je sais que je demande beaucoup, mais si tu pouvais faire en sorte que Cristine accepte mon invitation à dîner ce vendredi, je te serais éternellement reconnaissant. J'ai même acheté de nouvelles chaussures."
    },
    {
        "lang": "de",
        "country": "Alemania",
        "text": "Liebes Universum, warum hast du Emily so perfekt gemacht? Jedes Mal, wenn sie lächelt, vergesse ich, wie man atmet. Bitte gib mir den Mut, sie endlich nach einem Date zu fragen, bevor ich vor Aufregung platze."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "Universo caro, ti prego, fa che la zia Matilde smetta di chiedermi quando mi sposo ogni volta che ci vediamo a Natale. Non ne posso più, sto per inventarmi un fidanzato immaginario solo per farla stare tranquilla."
    },
    {
        "lang": "sv",
        "country": "Suecia",
        "text": "Kära universum, om Gustav ringer mig ikväll lovar jag att städa hela lägenheten. Och kanske till och med baka något. Snälla, låt honom ringa. Jag orkar inte vänta längre på ett tecken."
    },
    {
        "lang": "pt",
        "country": "Brasil",
        "text": "Universo, só queria dizer que a Maya tem o sorriso mais lindo que eu já vi na vida. Se você pudesse dar um jeito dos nossos caminhos se cruzarem de novo, eu prometo que dessa vez eu não vou travar e vou falar com ela."
    },
    {
        "lang": "en",
        "country": "UK",
        "text": "Universe, please tell me why I walked into this room. I forgot entirely."
    },
    {
        "lang": "es",
        "country": "Brasil",
        "text": "Quiero conprar una casa para mis papas."
    },
    {
        "lang": "fr",
        "country": "España",
        "text": "Universo, alludame a tomar la decision correcta."
    },
    {
        "lang": "pt",
        "country": "United States",
        "text": "I just want to be rich enough to not care if guacamole is extra."
    },
    {
        "lang": "tr",
        "country": "Italia",
        "text": "Quiero ser tan feliz como alguien que acaba de encontrar 20 euros en un abrigo viejo."
    },
    {
        "lang": "de",
        "country": "España",
        "text": "A veces lloro con los anuncios de seguros de vida."
    },
    {
        "lang": "es",
        "country": "Francia",
        "text": "I confess, I use my dog as an excuse to leave parties early."
    },
    {
        "lang": "en",
        "country": "China",
        "text": "Quero ser uma pessoa melhor a cada dia."
    },
    {
        "lang": "ko",
        "country": "Italia",
        "text": "Universe, please forgive all my sines."
    },
    {
        "lang": "pl",
        "country": "Italia",
        "text": "毎日健康で過ごせますように。"
    },
    {
        "lang": "es",
        "country": "España",
        "text": "I wish for good health for my whole family."
    },
    {
        "lang": "tr",
        "country": "Corea",
        "text": "Я хочу, чтобы в мире был мир."
    },
    {
        "lang": "en",
        "country": "España",
        "text": "Quiero ser inmensamente felis, es mucho pedir?"
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "Quiero ser una persona exsitoza en la vida."
    },
    {
        "lang": "tr",
        "country": "Alemania",
        "text": "Deseo que mi perrito viva para ciempre."
    },
    {
        "lang": "zh",
        "country": "United States",
        "text": "Universo, dame paciencia, porque si me das fuerza lo mato."
    },
    {
        "lang": "it",
        "country": "Italia",
        "text": "Je souhaite trouver la paix intérieure."
    },
    {
        "lang": "zh",
        "country": "China",
        "text": "I judge people based on their grocery cart contents."
    },
    {
        "lang": "sv",
        "country": "Mexico",
        "text": "I secretly enjoy pineapple on pizza, please don't judge me universe."
    },
    {
        "lang": "ar",
        "country": "UK",
        "text": "Universe, if you are listening, please delete my browser history if I die suddenly. Thanks."
    },
    {
        "lang": "es",
        "country": "Mexico",
        "text": "Por fabor universo, escucha mis plegarias."
    },
    {
        "lang": "jp",
        "country": "Italia",
        "text": "A veces me hago el dormido en el metro para no ceder el asiento, lo siento universo."
    },
    {
        "lang": "it",
        "country": "Mexico",
        "text": "Si el universo es infinito, ¿por qué siempre choco con la misma pata de la cama?"
    },
    {
        "lang": "fr",
        "country": "United States",
        "text": "Ojalá mi gato me mirara con el mismo amor con el que mira a la mosca de la pared."
    },
    {
        "lang": "de",
        "country": "Mexico",
        "text": "Voglio viaggiare e scoprire nuove culture."
    },
    {
        "lang": "tr",
        "country": "Italia",
        "text": "Universe, pleese give me a sign what to do next with my life."
    },
    {
        "lang": "es",
        "country": "España",
        "text": "Le dije a mi jefe que estaba enfermo pero en realidad me quedé jugando videojuegos todo el día."
    },
    {
        "lang": "nl",
        "country": "Alemania",
        "text": "Quiero encontrar el valor para emprender mi propio negocio."
    },
    {
        "lang": "pt",
        "country": "Corea",
        "text": "Universo, guíame en este momento de incertidumbre."
    },
    {
        "lang": "ar",
        "country": "UK",
        "text": "Universo, por favor ayudame a pasar el exsamen de mañana, no he estudiado nada."
    },
    {
        "lang": "ko",
        "country": "España",
        "text": "I hope to meet people who bring out the best in me."
    },
    {
        "lang": "tr",
        "country": "España",
        "text": "Le he estado echando la culpa a mi hermano de romper el jarrón durante 5 años."
    },
    {
        "lang": "pt",
        "country": "España",
        "text": "Ich hoffe auf eine bessere Zukunft."
    },
    {
        "lang": "en",
        "country": "Portugal",
        "text": "Deseo allar la paz interior que tanto busco."
    },
    {
        "lang": "tr",
        "country": "Italia",
        "text": "Universo, dame fuersas para seguir adelante."
    },
    {
        "lang": "sv",
        "country": "Corea",
        "text": "Le pongo agua al champú para que dure más."
    },
    {
        "lang": "zh",
        "country": "Italia",
        "text": "I realy hope I get that job intervew tomorrow."
    },
    {
        "lang": "es",
        "country": "Corea",
        "text": "A veces escucho reggaeton a escondidas con los auriculares puestos."
    },
    {
        "lang": "tr",
        "country": "Portugal",
        "text": "Cher univers, fais que le chocolat ne fasse pas grossir. C est tout ce que je demande."
    },
    {
        "lang": "jp",
        "country": "Alemania",
        "text": "Por favor universo, que inventen el teletransporte ya, estoy harto del tráfico."
    },
    {
        "lang": "nl",
        "country": "Portugal",
        "text": "希望所有的梦想都能成真。"
    },
    {
        "lang": "sv",
        "country": "Portugal",
        "text": "I wish I culd go back in time and change things."
    },
    {
        "lang": "ko",
        "country": "Alemania",
        "text": "I use the same password for everything. I know it's bad."
    },
    {
        "lang": "jp",
        "country": "Corea",
        "text": "Deseo que el café me haga el mismo efecto que a la gente de los anuncios."
    },
    {
        "lang": "tr",
        "country": "Francia",
        "text": "Espero que todo salga vien en la operacion."
    },
    {
        "lang": "pt",
        "country": "Francia",
        "text": "Quiero vivir una vida sin arrepentimientos."
    },
    {
        "lang": "ru",
        "country": "United States",
        "text": "I have imaginary arguments in the shower and I always win."
    },
    {
        "lang": "de",
        "country": "España",
        "text": "I pretend to be on a phone call when I see someone I know in public."
    },
    {
        "lang": "de",
        "country": "Brasil",
        "text": "Universo, as que mi crush se fije en mi, porfa."
    },
    {
        "lang": "de",
        "country": "United States",
        "text": "Universo, que hoy me toque la lotería, o por lo menos que me sobre para un kebab."
    },
    {
        "lang": "it",
        "country": "Mexico",
        "text": "Ojala algun dia alguen me quiera como yo los quiero a ellos."
    },
    {
        "lang": "sv",
        "country": "Brasil",
        "text": "Universo, por que las pizzas son redondas, vienen en cajas cuadradas y se comen en triángulos? Mi cerebro no puede mas."
    },
    {
        "lang": "ar",
        "country": "Italia",
        "text": "Universo, haz que hoy no me encuentre a nadie conocido en el supermercado porfavor, voy en pijama y con unos pelos horribles."
    },
    {
        "lang": "fr",
        "country": "Japón",
        "text": "I wish for a world without hunger or poverty."
    },
    {
        "lang": "zh",
        "country": "España",
        "text": "Me como el queso rallado a puñados directamente de la bolsa a las 3 de la mañana."
    },
    {
        "lang": "jp",
        "country": "Alemania",
        "text": "Universe, give me the strength to overcome this obstacle."
    },
    {
        "lang": "ko",
        "country": "Portugal",
        "text": "Espero que mi ermano se recupere pronto de su enfermedad."
    },
    {
        "lang": "sv",
        "country": "España",
        "text": "Universo, dale un poco de sentido comun a mi jefe, o quitale el wifi, lo que sea mas facil."
    },
    {
        "lang": "tr",
        "country": "UK",
        "text": "I haven't washed my favorite jeans in months."
    },
    {
        "lang": "nl",
        "country": "España",
        "text": "Quiero viajar por todo el mudo antes de morir."
    },
    {
        "lang": "jp",
        "country": "Alemania",
        "text": "I talk to my plants and pretend they are judging me."
    },
    {
        "lang": "es",
        "country": "Brasil",
        "text": "Ojalá que mi perro me entienda cuando le explico por qué no puedo darle de mi comida."
    },
    {
        "lang": "fr",
        "country": "Brasil",
        "text": "Je confesse que j ai mangé le dernier biscuit et j ai accusé le chien."
    },
    {
        "lang": "sv",
        "country": "United States",
        "text": "I pretend I know what NFTs are when people talk about them."
    },
    {
        "lang": "ko",
        "country": "UK",
        "text": "Nesecito unas vacaciones urgente en una playa desierta."
    },
    {
        "lang": "pl",
        "country": "Alemania",
        "text": "Confieso que me gusta el olor a gasolina."
    },
    {
        "lang": "ar",
        "country": "Mexico",
        "text": "A veces me busco a mí mismo en Google por aburrimiento."
    },
    {
        "lang": "zh",
        "country": "UK",
        "text": "Quiero dejar una huella positiva en el mundo."
    },
    {
        "lang": "sv",
        "country": "Francia",
        "text": "Deseo aprender a disfrutar de las pequeñas cosas."
    },
    {
        "lang": "ar",
        "country": "España",
        "text": "Deseo tener la confianza de un cuervo robando papas fritas en la playa."
    },
    {
        "lang": "ar",
        "country": "España",
        "text": "Me robé un bolígrafo del banco ayer, me siento fatal."
    },
    {
        "lang": "zh",
        "country": "China",
        "text": "Por favor universo, que hoy no me toque sentarme al lado del que ronca en el tren."
    },
    {
        "lang": "fr",
        "country": "Alemania",
        "text": "I hope to inspire others with my art."
    },
    {
        "lang": "it",
        "country": "Brasil",
        "text": "Universe, send me an angel to gide me."
    },
    {
        "lang": "fr",
        "country": "Mexico",
        "text": "Deseo poder perdonar a quienes me hicieron daño."
    },
    {
        "lang": "zh",
        "country": "Francia",
        "text": "أتمنى السعادة لجميع الناس."
    },
    {
        "lang": "jp",
        "country": "Japón",
        "text": "Universe, help me find my true passion."
    },
    {
        "lang": "ru",
        "country": "China",
        "text": "Universo, haz que mi WiFi sea tan fuerte como mis ganas de no hacer nada hoy."
    },
    {
        "lang": "sv",
        "country": "Portugal",
        "text": "Universe, please make my bank account as thiccc as my thighs."
    },
    {
        "lang": "pt",
        "country": "United States",
        "text": "Quiero que mi mayor problema en la vida sea decidir en que isla privada voy a pasar mis vacaciones."
    }

];
