# 🚀 Quick Start - Enable Notifications

## Step 1: Run the SQL Migration (5 minutes)

1. Open your Supabase project: https://supabase.com/dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New query**
4. Open the file: `database/migrations/create_notifications.sql`
5. Copy **ALL** the SQL code
6. Paste into the Supabase SQL Editor
7. Click **RUN** (or press Ctrl+Enter)
8. Wait for "Success" message

✅ **Done!** The notifications table is now created.

---

## Step 2: Enable Real-time (1 minute)

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the `notifications` table in the list
3. Click the toggle to turn it **ON** (green)
4. Wait 10 seconds for replication to enable

✅ **Done!** Real-time updates are now enabled.

---

## Step 3: Test It (2 minutes)

### Test 1: Create a test notification

In Supabase SQL Editor, run:

```sql
-- Get two user IDs from your database
SELECT id, email FROM auth.users LIMIT 2;

-- Insert a test notification
-- Replace YOUR_USER_ID and ACTOR_USER_ID with actual IDs from above
INSERT INTO notifications (
  user_id,
  actor_id,
  type,
  entity_id,
  entity_type,
  message,
  is_read
) VALUES (
  'YOUR_USER_ID',
  'ACTOR_USER_ID',
  'like',
  gen_random_uuid(),
  'question',
  'Someone liked your test post',
  false
);
```

### Test 2: Check in your app

1. Open your app in the browser
2. Log in as the user (YOUR_USER_ID)
3. Look at the bottom navigation
4. You should see a red badge with "1" on the Inbox icon 🔔

### Test 3: View the notification

1. Click on the Inbox icon
2. You should see the test notification
3. Click on it to mark as read
4. The red badge should disappear

✅ **Done!** Notifications are working!

---

## Step 4: Enable Automatic Notifications (Already Done!)

The following triggers are **already installed** by the migration:

✅ **Vote/Like Trigger** - Creates notification when someone upvotes your post  
✅ **Answer Trigger** - Creates notification when someone answers your question

No additional setup needed!

---

## 🎉 You're All Set!

The notification system is now **production-ready** and using **real database data**.

### What happens now:

- When someone upvotes your post → You get a notification ❤️
- When someone answers your question → You get a notification 💡
- Notifications appear **instantly** (real-time)
- Badge count updates **automatically**
- Everything is **secure** with RLS policies

---

## 🐛 Troubleshooting

### "Table doesn't exist" error

**Fix:** Make sure you ran the entire SQL migration from `create_notifications.sql`

### Badge shows 0 but I have notifications

**Fix:**

1. Check if Realtime is enabled (Database → Replication)
2. Refresh the page
3. Check browser console for errors

### Notifications not appearing after voting

**Fix:**

1. Make sure the triggers are installed (they're in the migration)
2. Try voting on someone else's post (not your own)
3. Check Supabase logs for trigger errors

### Still having issues?

1. Read the full guide: `NOTIFICATIONS_SETUP.md`
2. Check implementation details: `NOTIFICATION_IMPLEMENTATION.md`
3. Verify RLS policies are enabled: `SELECT * FROM pg_policies WHERE tablename = 'notifications';`

---

## 📚 Files Reference

- **Migration SQL**: `database/migrations/create_notifications.sql`
- **Service Layer**: `services/notification.service.ts`
- **Notification Page**: `app/notifications/page.tsx`
- **Bottom Nav Badge**: `components/layout/BottomNav.tsx`
- **Setup Guide**: `NOTIFICATIONS_SETUP.md`
- **Implementation Summary**: `NOTIFICATION_IMPLEMENTATION.md`

---

**Total Setup Time: ~8 minutes**

🎯 **No mock data. All real. Production ready.**
