import codecs
import re

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'r', encoding='utf-8') as f:
    main_content = f.read()

# 1. Remove the Toast
old_toast = '                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Eco programado para dentro de 60s", Toast.LENGTH_SHORT).show());'
main_content = main_content.replace(old_toast, '')

# 2. Remove the permission check in onCreate
old_perm = '''        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        }'''
main_content = main_content.replace(old_perm, '')

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(main_content)

print("Removed toast and alarm permission prompt")
