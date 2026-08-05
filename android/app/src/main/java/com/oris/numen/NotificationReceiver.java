package com.oris.numen;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.app.Notification;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "oris_numen_channel";

    @Override
    public void onReceive(Context context, Intent intent) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Oris Numen Reminders",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Daily reminders for channeling");
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }

        Intent appIntent = new Intent(context, MainActivity.class);
        appIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context, 0, appIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Notification.Builder builder = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            builder = new Notification.Builder(context, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(context);
            builder.setPriority(Notification.PRIORITY_DEFAULT);
        }

        String type = intent.getStringExtra("type");
        String title = "Oris Numen";
        String desc = "Eleva tu voz al universo.";
        
        if ("morning".equals(type)) {
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
        }

        builder.setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(desc)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        if (notificationManager != null) {
            notificationManager.notify(("morning".equals(type)) ? 2 : 1, builder.build());
        }
    }
}
