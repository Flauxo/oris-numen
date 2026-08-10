import codecs

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'r', encoding='utf-8') as f:
    main_content = f.read()

# Add alarm permission request in onCreate
old_oncreate = '''    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);'''

new_oncreate = '''    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        }'''

main_content = main_content.replace(old_oncreate, new_oncreate)

# Add Toast in scheduleGratitudeNotification
old_sched = '''        @JavascriptInterface
        public void scheduleGratitudeNotification(String message) {
            try {'''

new_sched = '''        @JavascriptInterface
        public void scheduleGratitudeNotification(String message) {
            try {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Eco programado para dentro de 60s", Toast.LENGTH_SHORT).show());'''

main_content = main_content.replace(old_sched, new_sched)

with codecs.open('android/app/src/main/java/com/oris/numen/MainActivity.java', 'w', encoding='utf-8') as f:
    f.write(main_content)

# Now update NotificationReceiver.java to use ID 3 instead of 1 or 2
with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'r', encoding='utf-8') as f:
    notif_content = f.read()

old_notify = '''        if (notificationManager != null) {
            notificationManager.notify(("morning".equals(type)) ? 2 : 1, builder.build());
        }'''

new_notify = '''        if (notificationManager != null) {
            int notifId = 1;
            if ("morning".equals(type)) notifId = 2;
            else if ("gratitude".equals(type)) notifId = 3;
            notificationManager.notify(notifId, builder.build());
        }'''

notif_content = notif_content.replace(old_notify, new_notify)

with codecs.open('android/app/src/main/java/com/oris/numen/NotificationReceiver.java', 'w', encoding='utf-8') as f:
    f.write(notif_content)

print("Patched Java for Alarms")
