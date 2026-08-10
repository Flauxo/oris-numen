import codecs
import re

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'r', encoding='utf-8') as f:
    main_content = f.read()

# 1. Insert scheduleGratitudeNotification before triggerNativeVibration
method_to_insert = '''        @JavascriptInterface
        public void scheduleGratitudeNotification(String message) {
            try {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Eco programado para dentro de 60s", Toast.LENGTH_SHORT).show());
                
                android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
                Intent intent = new Intent(MainActivity.this, NotificationReceiver.class);
                intent.putExtra("type", "gratitude");
                intent.putExtra("message", message);
                
                int requestCode = 100 + new java.util.Random().nextInt(1000);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                        MainActivity.this, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                
                long triggerAtMillis = System.currentTimeMillis() + 60 * 1000;
                
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
        
'''

# Find triggerNativeVibration and prepend
pattern_vibration = r'(\s*@JavascriptInterface\s*public void triggerNativeVibration)'
main_content = re.sub(pattern_vibration, method_to_insert + r'\1', main_content, count=1)


# 2. Insert Alarm permission check in onCreate
perm_logic = '''        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        }
        
'''
pattern_oncreate = r'(super\.onCreate\(savedInstanceState\);\s*)'
main_content = re.sub(pattern_oncreate, r'\1' + perm_logic, main_content, count=1)


with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(main_content)

print("MainActivity.java patched perfectly!")
