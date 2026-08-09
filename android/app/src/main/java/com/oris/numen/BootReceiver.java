package com.oris.numen;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.os.Build;

import java.util.Calendar;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            scheduleNightNotification(context, 1); // 1 day if device reboots
            scheduleWeekendNotification(context);
        }
    }

    public static void scheduleNextNotifications(Context context) {
        scheduleNightNotification(context, 2);
        scheduleWeekendNotification(context);
    }

    public static void scheduleNightNotification(Context context, int daysToAdd) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.putExtra("type", "night");
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

        // Random time between 21:30 and 22:30
        calendar.set(Calendar.HOUR_OF_DAY, 21);
        int randomMinute = 30 + new java.util.Random().nextInt(61); // 30 to 90
        if (randomMinute >= 60) {
            calendar.set(Calendar.HOUR_OF_DAY, 22);
            calendar.set(Calendar.MINUTE, randomMinute - 60);
        } else {
            calendar.set(Calendar.MINUTE, randomMinute);
        }
        calendar.set(Calendar.SECOND, 0);

        setAlarm(alarmManager, calendar, pendingIntent);
    }

    public static void scheduleWeekendNotification(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, NotificationReceiver.class);
        intent.putExtra("type", "morning");
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context, 1, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Calendar calendar = Calendar.getInstance();
        
        // Find next Saturday or Sunday
        while (calendar.get(Calendar.DAY_OF_WEEK) != Calendar.SATURDAY && calendar.get(Calendar.DAY_OF_WEEK) != Calendar.SUNDAY) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }
        
        // If it's already the weekend but past 11 AM, move to next day
        if ((calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) && calendar.get(Calendar.HOUR_OF_DAY) >= 11) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.MONDAY) {
                calendar.add(Calendar.DAY_OF_YEAR, 5); // Jump to Saturday
            }
        }

        // Random time between 10:00 and 11:00
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        int randomMinute = new java.util.Random().nextInt(60); 
        calendar.set(Calendar.MINUTE, randomMinute);
        calendar.set(Calendar.SECOND, 0);

        setAlarm(alarmManager, calendar, pendingIntent);
    }

    private static void setAlarm(AlarmManager alarmManager, Calendar calendar, PendingIntent pendingIntent) {
        if (alarmManager != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                try {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                } catch (SecurityException se) {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                }
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
            }
        }
    }
}
