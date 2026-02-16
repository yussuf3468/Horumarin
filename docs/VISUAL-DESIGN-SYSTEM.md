# MIDEEYE VISUAL DESIGN SYSTEM

## Complete Implementation Guide

---

## 🎨 DESIGN PHILOSOPHY

MIDEEYE represents **progress, knowledge, and Somali cultural identity**. The visual system reflects:

- **Authority**: Deep blues convey trust and expertise
- **Innovation**: Teal accents suggest modernity and forward-thinking
- **Warmth**: Amber CTAs create approachable energy
- **Clarity**: Strong hierarchy ensures easy navigation
- **Density**: Efficient use of space respects user time
- **Movement**: Rising sun symbolism throughout (progress/enlightenment)

---

## 📐 SPACING SYSTEM

### Scale (8px base unit)

```
xs:   4px  - Minimal gaps (tight inline elements)
sm:   8px  - Compact spacing (list items)
md:   12px - Element spacing (card internal)
base: 16px - Standard gaps (default margin/padding)
lg:   24px - Section padding (content blocks)
xl:   32px - Large separation (major sections)
2xl:  48px - Dramatic spacing (hero elements)
3xl:  64px - Maximum spacing (landing sections)
```

### Usage Rules

- **Never use arbitrary values** like `mt-7` or `p-13`
- Use Tailwind utilities: `p-4`, `mb-6`, `gap-8`
- Maintain vertical rhythm with consistent spacing
- Reduce padding on mobile, increase on desktop

---

## 🔤 TYPOGRAPHY HIERARCHY

### Size Scale

```typescript
Hero:    clamp(2.5rem, 5vw, 4rem) - 40-64px
Display: clamp(2rem, 4vw, 3rem)   - 32-48px
H2:      clamp(1.5rem, 3vw, 2rem) - 24-32px
H3:      1.25rem (20px)
Body:    1rem (16px)
Small:   0.875rem (14px)
Caption: 0.75rem (12px)
```

### Font Weights

- **800**: Hero headlines only
- **700**: Page titles (H1)
- **600**: Section headings (H2, H3)
- **500**: Metadata, labels
- **400**: Body text

### Line Height

- Headlines: 1.1-1.2 (tight)
- Body: 1.6 (relaxed)
- Captions: 1.4

### Letter Spacing

- Hero: -0.02em (tighter)
- H1: -0.01em
- Body: normal

---

## 🎨 COLOR PALETTE

### Primary (Deep Blue) - Authority & Trust

```
50:  #eff6ff - Lightest background tint
100: #dbeafe
200: #bfdbfe
300: #93c5fd
400: #60a5fa
500: #3b82f6 - Base primary
600: #2563eb
700: #1d4ed8 - Main brand blue
800: #1e40af
900: #1e3a8a - Deep brand blue
950: #172554 - Darkest
```

**Usage:**

- Main buttons, links, badges
- Heading accents
- Active states
- Vote counts

### Accent (Teal) - Innovation & Energy

```
50:  #f0fdfa
100: #ccfbf1
200: #99f6e4
300: #5eead4
400: #2dd4bf - Main accent
500: #14b8a6
600: #0d9488
700-900: Darker variations
```

**Usage:**

- Secondary actions
- Highlights
- Gradient combinations
- Success states

### CTA (Warm Amber) - Action & Warmth

```
50:  #fffbeb
100: #fef3c7
200: #fde68a
300: #fcd34d
400: #fbbf24
500: #f59e0b - Main CTA
600: #d97706
700-900: Darker variations
```

**Usage:**

- Primary CTAs only
- "Sign up" buttons
- Important actions
- Featured badges

### Neutrals - Depth & Readability

```
50:  #fafafa - Off-white bg
100: #f5f5f5 - Subtle bg
200: #e5e5e5 - Borders
300: #d4d4d4 - Dividers
400-500: Mid grays (labels)
600-700: Dark grays (body text)
800-950: Very dark (headings)
```

---

## 🌈 GRADIENTS

### Defined Tokens

```css
gradient-hero:       linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)
gradient-primary:    linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)
gradient-cta:        linear-gradient(135deg, #f59e0b 0%, #d97706 100%)
gradient-badge:      linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)
gradient-page:       linear-gradient(180deg, #fafafa 0%, #f0f9ff 50%, #fafafa 100%)
gradient-orb:        radial-gradient(circle, rgba(59,130,246,0.3), transparent)
```

### Usage Guidelines

- **Hero sections**: Use `bg-gradient-hero` for impact
- **Buttons**: Use `bg-gradient-primary` or `bg-gradient-cta`
- **Badges**: Use `bg-gradient-badge` for stats/labels
- **Page backgrounds**: Use `bg-gradient-page` for subtle depth
- **Decorative**: Use `gradient-orb` with blur for ambience

---

## 🖼️ SHADOWS & ELEVATION

### Shadow Scale

```css
card:         Subtle elevation (1-2px)
card-hover:   Medium lift (10-15px)
elevated:     Strong depth (20-25px)
button:       Interactive affordance (4-6px)
inner-glow:   Inset highlight (subtle)
```

### Usage Rules

- **Default cards**: `shadow-card`
- **Hover states**: `shadow-card-hover`
- **Modals/overlays**: `shadow-elevated`
- **Buttons**: `shadow-button`
- Combine with `border` for stronger definition

---

## 🏗️ LAYOUT PRINCIPLES

### Max Widths

```
container: 1280px - Main content boundary
reading:   720px  - Text-heavy sections
```

### Grid Systems

```
Hero:      Single column, centered
Features:  3 columns (MD), 1 column (mobile)
Questions: 2 columns (MD), 1 column (mobile)
Categories: 4 columns (LG), 2 columns (mobile)
```

### Spacing Between Sections

- Hero to first section: `mb-20` (80px)
- Section to section: `py-16` (64px top/bottom)
- Final CTA: `py-20` (80px top/bottom)

---

## 🎯 COMPONENT PATTERNS

### Cards

```tsx
<Card hover elevated className="p-6">
  {children}
</Card>
```

**Variants:**

- `hover`: Lift effect on hover
- `elevated`: Stronger shadow
- `gradient`: Background gradient

**Internal Padding:**

- Small cards: `p-4`
- Standard cards: `p-6`
- Large cards: `p-8`

### Buttons

```tsx
<Button size="lg" variant="primary">
  Text
</Button>
```

**Sizes:** `sm`, `md`, `lg`
**Variants:** `primary`, `secondary`, `outline`, `ghost`

### Badges

```tsx
<div className="px-3 py-1 bg-gradient-badge text-white rounded-full">
  Badge Text
</div>
```

---

## 🌟 LOGO USAGE

### MIDEEYE Logo

**Symbolism:**

- **Rising sun rays**: Enlightenment, progress, dawn of knowledge
- **Book base**: Foundation of learning
- **Central star**: Excellence, Somali identity, guidance
- **Gradient**: Trust + innovation

**Sizes:**

- Header: `size="sm"` (32px)
- Footer: `size="md"` (40px)
- Hero: `size="lg"` (48px)

**Versions:**

```tsx
<Logo size="md" showWordmark={true} />  // Full logo
<LogoIcon size={40} />                   // Icon only
```

**Color Variations:**

- Primary: Full gradient (default)
- Monochrome: Single color (special contexts)
- White: Dark backgrounds

**Clear Space:**
Maintain space equal to icon height on all sides

---

## 📱 RESPONSIVE BEHAVIOR

### Breakpoints

```
sm:  640px  - Small tablets
md:  768px  - Tablets
lg:  1024px - Desktop
xl:  1280px - Large desktop
```

### Mobile-First Approach

```tsx
// Default (mobile)
<div className="text-xl">

// Tablet and up
<div className="text-xl md:text-2xl">

// Desktop
<div className="text-xl md:text-2xl lg:text-3xl">
```

### Grid Responsiveness

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## 🎬 ANIMATION GUIDELINES

### Motion Tokens

```
fade-in:       Entrance (opacity)
slide-up:      Entrance (vertical)
slide-in-right: Entrance (horizontal)
pulse-slow:    Attention (subtle)
float:         Decorative (ambient)
```

### Usage Rules

- **Page load**: `animate-fade-in`
- **Scroll triggers**: Use `whileInView` with Framer Motion
- **Hover states**: Subtle transforms only (`-translate-y-1`)
- **Duration**: Keep under 400ms (0.3-0.4s)
- **Easing**: Use `ease-out` for entrances

---

## ✅ DO'S

✓ Use design tokens consistently
✓ Maintain strong hierarchy
✓ Apply shadows for depth
✓ Use gradients purposefully
✓ Keep spacing predictable
✓ Follow mobile-first approach
✓ Use semantic color names
✓ Provide clear affordances

---

## ❌ DON'TS

✗ Use arbitrary spacing values
✗ Mix color systems (no hex colors)
✗ Create flat, lifeless cards
✗ Overuse animations
✗ Ignore hover states
✗ Use weak contrast
✗ Skip responsive testing
✗ Break the grid system

---

## 🚀 IMPLEMENTATION CHECKLIST

When creating a new page/component:

1. [ ] Use `max-w-container` or `max-w-6xl` for main container
2. [ ] Apply proper `px-4 md:px-6 lg:px-8` for responsive padding
3. [ ] Use design system spacing tokens
4. [ ] Apply typography hierarchy (hero, display, h2, h3)
5. [ ] Add `shadow-card` to cards
6. [ ] Include hover states (`hover:shadow-card-hover`)
7. [ ] Use gradients from design system
8. [ ] Test on mobile, tablet, desktop
9. [ ] Add loading states where applicable
10. [ ] Ensure proper color contrast

---

## 📊 VISUAL DENSITY IMPROVEMENTS

**Before:** Empty, sparse, weak hierarchy
**After:** Dense, structured, strong presence

### Changes Made:

- Reduced vertical spacing by 30%
- Added decorative gradient backgrounds
- Implemented 2-4 column grids
- Created community energy sections
- Added visual badges and stats
- Introduced subtle card gradients
- Strengthened shadow system
- Improved typography scale

---

## 📚 FILE LOCATIONS

```
Design System:     lib/design-system.ts
Tailwind Config:   tailwind.config.ts
Logo Components:   components/brand/Logo.tsx
Card Component:    components/ui/Card.tsx
Button Component:  components/ui/Button.tsx
Header:            components/layout/Header.tsx
Footer:            components/layout/Footer.tsx
Homepage:          app/page.tsx
Favicon:           public/favicon.svg
```

---

## 🎓 NEXT STEPS

**Phase 2 - Animation:**

- Implement micro-interactions
- Add page transitions
- Create loading sequences
- Build interactive elements

**Phase 3 - Dark Mode:**

- Define dark palette
- Create theme switcher
- Update all components

**Phase 4 - Advanced Features:**

- Add parallax effects
- Implement scroll animations
- Create interactive data visualizations

---

**Remember:** This is a national innovation platform. Every pixel should convey trust, progress, and cultural pride.
