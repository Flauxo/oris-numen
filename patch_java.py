import codecs
import re

# 1. Update MainActivity.java
with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'r', encoding='utf-8') as f:
    main_content = f.read()

new_method = '''
        @JavascriptInterface
        public void scheduleGratitudeNotification(String message) {
            try {
                android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
                Intent intent = new Intent(MainActivity.this, NotificationReceiver.class);
                intent.putExtra("type", "gratitude");
                intent.putExtra("message", message);
                
                int requestCode = 100 + new java.util.Random().nextInt(1000); // Random ID to avoid overwriting
                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                        MainActivity.this, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                
                long triggerAtMillis = System.currentTimeMillis() + 60 * 1000; // 1 minute
                
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    try {
                        alarmManager.setExactAndAllowWhileIdle(android.app.AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                    } catch (SecurityException se) {
                        alarmManager.setAndAllowWhileIdle(android.app.AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                    }
                } else {
                    alarmManager.setExact(android.app.AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        @JavascriptInterface
        public void triggerNativeVibration() {'''

main_content = main_content.replace('        @JavascriptInterface\n        public void triggerNativeVibration() {', new_method)

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(main_content)


# 2. Update NotificationReceiver.java
with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'r', encoding='utf-8') as f:
    notif_content = f.read()

notif_logic = '''
        if ("gratitude".equals(type)) {
            title = "Oris Numen";
            desc = intent.getStringExtra("message");
        } else if ("morning".equals(type)) {'''

notif_content = notif_content.replace('        if ("morning".equals(type)) {', notif_logic)

with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'w', encoding='utf-8') as f:
    f.write(notif_content)

print("Patched Java files")
