# UI Components Library

Comprehensive UI component library for Horumarin built with React, TypeScript, Framer Motion, and Tailwind CSS.

## Available Components

### 1. **Skeleton Loader**

Loading placeholder with shimmer animation.

**Location:** `components/ui/Skeleton.tsx`

**Features:**

- Multiple variants: text, circular, rectangular
- Wave and pulse animations
- Customizable dimensions
- Pre-built SkeletonCard component

**Usage:**

```tsx
import Skeleton, { SkeletonCard } from "@/components/ui/Skeleton";

<Skeleton variant="text" className="w-3/4" />
<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rectangular" height={200} animation="wave" />
<SkeletonCard />
```

---

### 2. **Badge**

Small status/label indicator.

**Location:** `components/ui/Badge.tsx`

**Variants:** default, primary, accent, success, warning, danger, outline  
**Sizes:** sm, md, lg

**Usage:**

```tsx
import Badge from "@/components/ui/Badge";

<Badge variant="primary">New</Badge>
<Badge variant="success" size="sm">Active</Badge>
```

---

### 3. **Avatar**

User avatar with fallback initials and status indicator.

**Location:** `components/ui/Avatar.tsx`

**Features:**

- Automatic fallback to initials
- Status indicators: online, offline, busy, away
- Multiple sizes: xs, sm, md, lg, xl
- Gradient background

**Usage:**

```tsx
import Avatar from "@/components/ui/Avatar";

<Avatar fallback="AM" size="md" status="online" />
<Avatar src="/avatar.jpg" alt="User" size="lg" />
```

---

### 4. **Breadcrumbs**

Navigation breadcrumb trail.

**Location:** `components/ui/Breadcrumbs.tsx`

**Usage:**

```tsx
import Breadcrumbs from "@/components/ui/Breadcrumbs";

<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Questions", href: "/questions" },
    { label: "Details" },
  ]}
/>;
```

---

### 5. **Drawer**

Slide-out panel with overlay.

**Location:** `components/ui/Drawer.tsx`

**Features:**

- Slides from left or right
- Sizes: sm, md, lg, full
- Auto body scroll lock
- Escape key to close
- Backdrop click to close

**Usage:**

```tsx
import Drawer from "@/components/ui/Drawer";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Settings"
  position="right"
  size="md"
>
  <p>Drawer content here</p>
</Drawer>;
```

---

### 6. **Dialog/Modal**

Centered modal dialog.

**Location:** `components/ui/Dialog.tsx`

**Features:**

- Centered with overlay
- Sizes: sm, md, lg, xl, full
- Auto body scroll lock
- Escape key to close
- Optional close button

**Usage:**

```tsx
import Dialog from "@/components/ui/Dialog";

<Dialog
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
</Dialog>;
```

---

### 7. **Tabs**

Tabbed interface with animated indicator.

**Location:** `components/ui/Tabs.tsx`

**Variants:** default (underline), pills (rounded)  
**Features:** Animated active indicator, icon support

**Usage:**

```tsx
import Tabs from "@/components/ui/Tabs";

<Tabs
  variant="default"
  tabs={[
    {
      id: "tab1",
      label: "Overview",
      icon: <Icon />,
      content: <div>Content 1</div>,
    },
    {
      id: "tab2",
      label: "Details",
      content: <div>Content 2</div>,
    },
  ]}
/>;
```

---

### 8. **Alert**

Notification/alert messages.

**Location:** `components/ui/Alert.tsx`

**Variants:** info, success, warning, danger  
**Features:** Optional title, dismissible with callback

**Usage:**

```tsx
import Alert from "@/components/ui/Alert";

<Alert variant="success" title="Success!" dismissible onDismiss={() => {}}>
  Your action was completed.
</Alert>;
```

---

### 9. **Spinner**

Loading spinner indicator.

**Location:** `components/ui/Spinner.tsx`

**Variants:** primary, accent, current  
**Sizes:** xs, sm, md, lg, xl

**Usage:**

```tsx
import Spinner from "@/components/ui/Spinner";

<Spinner size="md" variant="primary" />;
```

---

### 10. **Tooltip**

Hover information popup.

**Location:** `components/ui/Tooltip.tsx`

**Positions:** top, bottom, left, right  
**Features:** Customizable delay, animated appearance

**Usage:**

```tsx
import Tooltip from "@/components/ui/Tooltip";

<Tooltip content="Click to edit" position="top" delay={200}>
  <button>Hover me</button>
</Tooltip>;
```

---

## Design System Integration

All components:

- ✅ Use semantic color tokens (bg-surface, text-foreground, etc.)
- ✅ Full dark mode support
- ✅ Respect prefers-reduced-motion
- ✅ GPU-accelerated animations (transform + opacity)
- ✅ Smooth 300ms theme transitions
- ✅ WCAG AA contrast compliant
- ✅ Type-safe with TypeScript
- ✅ Framer Motion for animations

## Utility Functions

### `cn()` - Class Name Merger

Combines clsx and tailwind-merge for optimal class handling.

**Location:** `lib/utils.ts`

**Usage:**

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn("base-class", condition && "conditional-class", className)}
/>;
```

## Live Demo

Visit `/showcase` to see all components in action with interactive examples.

## Implementation on Homepage

The homepage (`app/page.tsx`) demonstrates:

- **Alert** - Welcome notification at top
- **Badge** - Question status indicators
- **Avatar** - User avatars in questions
- **Tooltip** - Hover information on votes/answers
- **AnimatedCounter** - Live user count (existing)
- **LiveActivityFeed** - Real-time activity (existing)

## Future Enhancements

Planned components:

- Dropdown menu
- Pagination
- Toast notifications
- Progress bar
- Date picker
- Select/Combobox
- Switch/Toggle
- Radio group
- Checkbox group
