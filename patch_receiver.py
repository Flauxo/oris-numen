import codecs
import re

with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = '''        if ("morning".equals(type)) {
            String[] mTitles = { "Buen día de reflexión", "Despierta tu esencia", "Comienza con paz" };
            String[] mDescs = { 
                "El fin de semana es perfecto para canalizar tus pensamientos.",
                "Aprovecha esta mañana para liberar tus cargas o agradecer.",
                "Dedica un momento a tu evolución espiritual en esta hermosa mañana."
            };
            int r = new java.util.Random().nextInt(mTitles.length);
            title = mTitles[r];
            desc = mDescs[r];
            BootReceiver.scheduleWeekendNotification(context);
        } else {
            String[] titles = {
                "Tu canal está abierto",
                "La frecuencia te aguarda",
                "Elévate hoy",
                "Hora de purificar",
                "Oris Numen"
            };
            String[] descs = {
                "¿Hay algo que necesites confesar o agradecer hoy? Canalízalo ahora.",
                "Una plegaria silenciosa puede cambiar tu día. Conecta con la divinidad.",
                "Libera tus cargas a través de la frecuencia del Perdón.",
                "La semilla cósmica espera tu próxima canalización para seguir creciendo.",
                "Dedica un momento para ti. Eleva tu voz al universo."
            };
            int randomIndex = new java.util.Random().nextInt(titles.length);
            title = titles[randomIndex];
            desc = descs[randomIndex];
            BootReceiver.scheduleNightNotification(context, 2);
        }'''

new_logic = '''        if ("gratitude".equals(type)) {
            title = "Oris Numen";
            String msg = intent.getStringExtra("message");
            if (msg != null && !msg.isEmpty()) {
                desc = msg;
            } else {
                desc = "Alguien en el mundo ha encontrado consuelo en tu mensaje";
            }
        } else if ("morning".equals(type)) {
            String[] mTitles = { "Buen día de reflexión", "Despierta tu esencia", "Comienza con paz" };
            String[] mDescs = { 
                "El fin de semana es perfecto para canalizar tus pensamientos.",
                "Aprovecha esta mañana para liberar tus cargas o agradecer.",
                "Dedica un momento a tu evolución espiritual en esta hermosa mañana."
            };
            int r = new java.util.Random().nextInt(mTitles.length);
            title = mTitles[r];
            desc = mDescs[r];
            BootReceiver.scheduleWeekendNotification(context);
        } else {
            String[] titles = {
                "Tu canal está abierto",
                "La frecuencia te aguarda",
                "Elévate hoy",
                "Hora de purificar",
                "Oris Numen"
            };
            String[] descs = {
                "¿Hay algo que necesites confesar o agradecer hoy? Canalízalo ahora.",
                "Una plegaria silenciosa puede cambiar tu día. Conecta con la divinidad.",
                "Libera tus cargas a través de la frecuencia del Perdón.",
                "La semilla cósmica espera tu próxima canalización para seguir creciendo.",
                "Dedica un momento para ti. Eleva tu voz al universo."
            };
            int randomIndex = new java.util.Random().nextInt(titles.length);
            title = titles[randomIndex];
            desc = descs[randomIndex];
            BootReceiver.scheduleNightNotification(context, 2);
        }'''

content = content.replace(old_logic, new_logic)

with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched NotificationReceiver.java")
