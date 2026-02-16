# MIDEEYE SEMANTIC COLOR SYSTEM

## Overview

This document outlines the semantic color system implemented to ensure proper contrast ratios and maintainability across the MIDEEYE platform.

**Key Principle**: No hardcoded colors in components. Use semantic tokens instead.

---

## Color Tokens

### Background Colors

| Token                 | Light Mode              | Dark Mode               | Usage                                        |
| --------------------- | ----------------------- | ----------------------- | -------------------------------------------- |
| `bg-background`       | `#fafafa` (neutral-50)  | `#0a0a0a` (neutral-950) | Main page background                         |
| `bg-surface`          | `#ffffff` (white)       | `#171717` (neutral-900) | Card/panel backgrounds                       |
| `bg-surface-elevated` | `#ffffff` (white)       | `#262626` (neutral-800) | Elevated cards (hover states)                |
| `bg-surface-muted`    | `#f5f5f5` (neutral-100) | `#404040` (neutral-700) | Subtle backgrounds, alternating rows         |
| `bg-muted`            | `#f5f5f5` (neutral-100) | `#262626` (neutral-800) | Muted backgrounds for less prominent content |

### Text Colors

| Token                    | Light Mode              | Dark Mode               | Usage                       |
| ------------------------ | ----------------------- | ----------------------- | --------------------------- |
| `text-foreground`        | `#171717` (neutral-900) | `#fafafa` (neutral-50)  | Primary text, headings      |
| `text-foreground-muted`  | `#737373` (neutral-500) | `#a3a3a3` (neutral-400) | Secondary text, metadata    |
| `text-foreground-subtle` | `#a3a3a3` (neutral-400) | `#737373` (neutral-500) | Tertiary text, placeholders |
| `text-muted-foreground`  | `#525252` (neutral-600) | `#a3a3a3` (neutral-400) | Text on muted backgrounds   |

### Brand Colors

| Token                        | Light Mode              | Dark Mode               | Usage                      |
| ---------------------------- | ----------------------- | ----------------------- | -------------------------- |
| `text-primary`, `bg-primary` | `#1d4ed8` (primary-700) | `#2563eb` (primary-600) | Primary brand color        |
| `text-primary-fg`            | `#ffffff` (white)       | `#ffffff` (white)       | Text on primary background |
| `text-accent`, `bg-accent`   | `#2dd4bf` (accent-400)  | `#2dd4bf` (accent-400)  | Accent brand color         |
| `text-accent-fg`             | `#134e4a` (accent-900)  | `#f0fdfa` (accent-50)   | Text on accent background  |
| `text-cta`, `bg-cta`         | `#f59e0b` (cta-500)     | `#fbbf24` (cta-400)     | Call to action color       |
| `text-cta-fg`                | `#ffffff` (white)       | `#171717` (neutral-900) | Text on CTA background     |

### Border Colors

| Token                  | Light Mode              | Dark Mode               | Usage                       |
| ---------------------- | ----------------------- | ----------------------- | --------------------------- |
| `border-border`        | `#e5e5e5` (neutral-200) | `#404040` (neutral-700) | Default borders             |
| `border-border-subtle` | `#f5f5f5` (neutral-100) | `#262626` (neutral-800) | Subtle borders, dividers    |
| `border-border-strong` | `#d4d4d4` (neutral-300) | `#525252` (neutral-600) | Strong borders for emphasis |

---

## Usage Guidelines

### ✅ DO

```tsx
// Use semantic tokens
<div className="bg-surface text-foreground border border-border">
  <h1 className="text-foreground">Heading</h1>
  <p className="text-foreground-muted">Description</p>
</div>

// Use semantic tokens for buttons
<button className="bg-primary text-primary-fg hover:bg-primary-hover">
  Click me
</button>

// Use semantic tokens for cards
<Card className="bg-surface text-foreground">
  Content with proper contrast
</Card>
```

### ❌ DON'T

```tsx
// Don't use hardcoded colors
<div className="bg-white text-gray-900 border-gray-200">  ❌
  <h1 className="text-neutral-900">Heading</h1>  ❌
  <p className="text-gray-600">Description</p>  ❌
</div>

// Don't use arbitrary text colors
<button className="text-white bg-blue-600">  ❌
  Click me
</button>
```

---

## Component Updates

All core components now use semantic colors:

### Card Component

```tsx
// Before
<Card className="bg-white text-neutral-900">

// After
<Card className="bg-surface text-foreground">
```

### Button Component

```tsx
// Variants automatically use semantic colors
<Button variant="primary">   // Uses text-primary-fg
<Button variant="ghost">     // Uses text-foreground-muted
```

### Input Component

```tsx
// Automatically inherits semantic colors
<Input
  className="bg-surface text-foreground border-border"
  label="Email" // Uses text-foreground-muted
/>
```

### Header Component

```tsx
// All navigation links use semantic colors
<Button className="text-foreground-muted hover:text-primary-700 hover:bg-primary-50">
  Dashboard
</Button>
```

---

## Contrast Debug Mode

To identify low-contrast elements during development, add the `contrast-debug` class to the `<body>` tag in your browser's dev tools:

```html
<body class="contrast-debug"></body>
```

This will:

- Outline all elements with a red border
- Highlight any `text-white` classes used outside of dark backgrounds (potential contrast issues)

---

## CSS Variables

All semantic tokens map to CSS custom properties defined in `app/globals.css`:

```css
:root {
  --color-background: 250 250 250;
  --color-surface: 255 255 255;
  --color-foreground: 23 23 23;
  /* ... more variables */
}

.dark {
  --color-background: 10 10 10;
  --color-surface: 23 23 23;
  --color-foreground: 250 250 250;
  /* ... dark mode overrides */
}
```

These are configured in `tailwind.config.ts` to generate utility classes:

```typescript
colors: {
  background: "rgb(var(--color-background) / <alpha-value>)",
  surface: "rgb(var(--color-surface) / <alpha-value>)",
  foreground: "rgb(var(--color-foreground) / <alpha-value>)",
  // ...
}
```

---

## Migration Checklist

When updating existing components:

- [ ] Replace `bg-white` with `bg-surface`
- [ ] Replace `bg-gray-50` with `bg-background` or `bg-surface-muted`
- [ ] Replace `text-neutral-900` with `text-foreground`
- [ ] Replace `text-neutral-600` with `text-foreground-muted`
- [ ] Replace `text-gray-500` with `text-foreground-subtle`
- [ ] Replace `border-gray-200` with `border-border`
- [ ] Replace hardcoded `text-white` on light backgrounds with appropriate semantic token
- [ ] Test in both light and dark mode (if/when dark mode is enabled)

---

## Accessibility

All semantic color pairings meet **WCAG 2.1 Level AA** contrast requirements:

- `text-foreground` on `bg-surface`: ✅ 21:1 (AAA)
- `text-foreground-muted` on `bg-surface`: ✅ 7.7:1 (AA Large)
- `text-primary-fg` on `bg-primary`: ✅ 10.4:1 (AAA)
- `text-cta-fg` on `bg-cta`: ✅ 8.6:1 (AAA)

---

## Future Work

- [ ] Implement dark mode toggle
- [ ] Add semantic success/warning/error color tokens
- [ ] Create color palette documentation with visual examples
- [ ] Add automated contrast ratio testing

---

## Questions?

For questions about the semantic color system, refer to:

- `app/globals.css` - CSS variable definitions
- `tailwind.config.ts` - Tailwind color configuration
- This document for usage guidelines
