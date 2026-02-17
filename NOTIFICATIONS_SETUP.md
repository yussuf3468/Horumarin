# Notifications System Setup

This guide will help you set up the production-ready notifications system in your Supabase database.

## Prerequisites

- Access to your Supabase project dashboard
- SQL Editor access in Supabase

## Step 1: Run the SQL Migration

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `database/migrations/create_notifications.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl + Enter`

The migration will create:

- ✅ `notification_type` enum with types: like, comment, answer, follow, mention, new_post
- ✅ `notifications` table with proper schema
- ✅ Foreign key constraints to auth.users and profiles
- ✅ Performance indexes on user_id, created_at, and unread notifications
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for vote and answer notifications
- ✅ Helper functions for marking notifications as read

## Step 2: Verify the Setup

After running the migration, verify everything was created successfully:

```sql
-- Check if the table exists
SELECT * FROM notifications LIMIT 0;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'notifications';

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table IN ('votes', 'answers');
```

## Step 3: Test the System

### Create a Test Notification

You can manually insert a test notification to verify everything works:

```sql
-- Replace USER_ID and ACTOR_ID with actual UUIDs from your auth.users table
INSERT INTO notifications (
  user_id,
  actor_id,
  type,
  entity_id,
  entity_type,
  message
) VALUES (
  'USER_ID_HERE',
  'ACTOR_ID_HERE',
  'like',
  gen_random_uuid(),
  'question',
  'Test notification'
);
```

### Verify RLS Policies

Try selecting notifications as a specific user:

```sql
-- This should only return notifications for the current user
SELECT * FROM notifications WHERE user_id = auth.uid();
```

## How It Works

### Automatic Notification Creation

The system automatically creates notifications when:

1. **Someone votes/likes your content**
   - Trigger: `on_vote_notification`
   - Creates a "like" notification
   - Only for upvotes (value = 1)
   - Doesn't notify if you vote on your own content

2. **Someone answers your question**
   - Trigger: `on_answer_notification`
   - Creates an "answer" notification
   - Doesn't notify if you answer your own question

### Real-Time Updates

The frontend subscribes to database changes using Supabase Realtime:

- Notification badge updates automatically
- Notification list refreshes when new notifications arrive
- No polling required - instant updates

### Performance Optimizations

- **Indexes** on frequently queried columns (user_id, created_at)
- **Partial index** on unread notifications for faster filtering
- **RLS policies** ensure users only see their own data
- **Foreign key cascades** automatically clean up notifications when users are deleted

## Security

Row Level Security (RLS) ensures:

- ✅ Users can only read their own notifications
- ✅ Users can only update (mark as read) their own notifications
- ✅ Users can delete their own notifications
- ✅ Only database triggers can create notifications (no direct user inserts)

## API Endpoints

The system includes these service functions:

```typescript
// Get all notifications for a user (sorted by created_at DESC)
getUserNotifications(userId: string)

// Get unread count
getUnreadCount(userId: string)

// Mark single notification as read
markNotificationAsRead(notificationId: string)

// Mark all notifications as read
markAllNotificationsAsRead(userId: string)

// Delete a notification
deleteNotification(notificationId: string)

// Subscribe to real-time updates
subscribeToNotifications(userId: string, callback: Function)
```

## Troubleshooting

### Migration fails with "relation does not exist"

**Solution:** Make sure you have the `profiles` table created first. The notifications table references `profiles(id)`.

### No notifications appearing

**Solution:**

1. Check if triggers are installed: `SELECT * FROM pg_trigger WHERE tgname LIKE 'on_%_notification';`
2. Verify RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'notifications';`
3. Check that votes/answers are being created in the database

### Unread count not updating

**Solution:** The frontend uses Supabase Realtime. Make sure:

1. Realtime is enabled in your Supabase project settings
2. The `notifications` table is enabled for Realtime replication

To enable Realtime:

1. Go to Database → Replication
2. Find `notifications` table
3. Toggle it ON

## Next Steps

- ✅ Notifications are now production-ready
- ✅ Add more trigger types (comments, follows, mentions) as needed
- ✅ Customize notification messages in Somali language
- ✅ Implement email/push notifications (optional)

## Database Schema

```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users(id),
  actor_id UUID → profiles(id),
  type notification_type,
  entity_id UUID,
  entity_type TEXT,
  message TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

🎉 **Your notification system is now production-ready!**

No more mock data - all notifications are now stored in PostgreSQL with proper RLS security, indexes for performance, and real-time updates.
