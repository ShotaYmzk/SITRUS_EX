# DESIGN.md

> Machine-readable design system for AI coding agents.  
> Drop this file in your project root. Any AI agent reads it to generate consistent, on-brand UI.

---

## 1. Visual Theme & Atmosphere

**Overall Vibe:** Precise, Developer-Native, Quietly Confident

The aesthetic is **focused-minimal** — not cold, but deliberate. Inspired by modern developer tooling (Linear, Vercel, Supabase) filtered through a Japanese sense of restraint and craft. Interfaces feel like well-written code: no noise, every element earns its place.

- **Density:** Medium-low. Generous whitespace but not wasteful. Content breathes without feeling sparse.
- **Mood:** Calm focus. Tools that respect the user's intelligence. No marketing fluff, no oversized hero text.
- **Philosophy:** Function-first with considered aesthetics. Clean enough to feel professional; warm enough to feel human.
- **Dark mode default.** Interfaces live primarily in dark surfaces, with light mode as an optional alternate — not an afterthought.
- **Motion:** Restrained and purposeful. Transitions exist to communicate, not to dazzle. 150–200ms ease-out for UI transitions; 0 for data updates.

**Design Keywords:** Minimal · Precise · Developer · Monochromatic · Warm Accents · Structured

---

## 2. Color Palette & Roles

### Core Palette

| Name | Hex | Role |
|------|-----|------|
| **Void Black** | `#0A0A0B` | App background (dark mode) |
| **Surface Dark** | `#111113` | Card / panel background |
| **Surface Raised** | `#18181B` | Elevated surfaces, modals |
| **Border Subtle** | `#27272A` | Default borders, dividers |
| **Border Default** | `#3F3F46` | Interactive borders, focused inputs |
| **Text Primary** | `#FAFAFA` | Headings, primary content |
| **Text Secondary** | `#A1A1AA` | Supporting text, labels, placeholders |
| **Text Muted** | `#52525B` | Disabled, metadata, timestamps |

### Accent Palette

| Name | Hex | Role |
|------|-----|------|
| **Sakura Coral** | `#E85D75` | Primary CTA, active states, highlights |
| **Sakura Soft** | `#F4869A` | Hover states for coral accent |
| **Sakura Faint** | `#3D1520` | Coral tint background, badges |
| **Indigo Action** | `#6366F1` | Secondary actions, links |
| **Indigo Soft** | `#818CF8` | Hover states for indigo |
| **Emerald Success** | `#10B981` | Success states, confirmations |
| **Amber Warning** | `#F59E0B` | Warnings, pending states |
| **Red Danger** | `#EF4444` | Errors, destructive actions |

### Light Mode Overrides

| Name | Hex | Role |
|------|-----|------|
| **Canvas White** | `#FFFFFF` | App background (light mode) |
| **Surface Light** | `#F4F4F5` | Card background |
| **Surface Hover** | `#E4E4E7` | Hover, selected states |
| **Text Primary** | `#09090B` | Primary content |
| **Text Secondary** | `#71717A` | Supporting text |

### Usage Rules

- Never use pure `#000000` — use Void Black `#0A0A0B` for depth without harshness.
- The coral accent (`#E85D75`) is the single brand color. Use it sparingly — one dominant use per screen.
- Indigo is for interactive navigation and links; do not mix it with coral CTAs.
- Semantic colors (success/warning/error) are never used decoratively.

---

## 3. Typography Rules

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| **Display / Headings** | `Geist` | `'Helvetica Neue', sans-serif` |
| **Body / UI** | `Geist` | `'Helvetica Neue', sans-serif` |
| **Code / Mono** | `Geist Mono` | `'Fira Code', 'Cascadia Code', monospace` |

> Geist (by Vercel) is the primary typeface — geometric, highly legible, native to developer UIs. Import via `https://vercel.com/font` or use `next/font`.

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 48px / 3rem | 700 | 1.1 | Hero headings, landing pages |
| `text-h1` | 36px / 2.25rem | 700 | 1.15 | Page titles |
| `text-h2` | 28px / 1.75rem | 600 | 1.2 | Section headers |
| `text-h3` | 22px / 1.375rem | 600 | 1.3 | Card titles, subsections |
| `text-h4` | 18px / 1.125rem | 600 | 1.4 | Minor headings |
| `text-body-lg` | 16px / 1rem | 400 | 1.6 | Primary body text |
| `text-body` | 14px / 0.875rem | 400 | 1.6 | UI text, descriptions |
| `text-sm` | 13px / 0.8125rem | 400 | 1.5 | Labels, captions, metadata |
| `text-xs` | 11px / 0.6875rem | 500 | 1.4 | Tags, badges, timestamps |
| `text-code` | 13px / 0.8125rem | 400 | 1.7 | Inline code, code blocks |

### Typography Rules

- Letter spacing: `-0.02em` on headings, `0` on body, `0.05em` on `text-xs` badges/tags.
- Never exceed 70 characters per line for body text (set `max-width: 65ch`).
- Avoid mixing more than 2 font weights in a single component.
- Code snippets always use `Geist Mono` with a `Surface Raised` background and subtle border.

---

## 4. Component Stylings

### Buttons

```
Primary Button
  Background:  Sakura Coral (#E85D75)
  Text:        White (#FAFAFA)
  Border:      none
  Radius:      6px (softly rounded, not pill-shaped)
  Padding:     8px 16px (sm) | 10px 20px (md) | 12px 24px (lg)
  Font:        14px, weight 500
  Hover:       background → #F4869A, transform: translateY(-1px), box-shadow: 0 4px 12px rgba(232,93,117,0.35)
  Active:      transform: translateY(0), background → #D44F65
  Disabled:    opacity: 0.4, cursor: not-allowed

Secondary Button
  Background:  transparent
  Text:        Text Primary (#FAFAFA)
  Border:      1px solid Border Default (#3F3F46)
  Radius:      6px
  Hover:       Background → Surface Raised (#18181B), border-color → Border Default
  Active:      Background → #27272A

Ghost Button
  Background:  transparent
  Text:        Text Secondary (#A1A1AA)
  Border:      none
  Hover:       Background → Surface Raised (#18181B), text → Text Primary
  Usage:       Toolbar actions, icon buttons, contextual menus

Destructive Button
  Background:  transparent
  Text:        Red Danger (#EF4444)
  Border:      1px solid rgba(239,68,68,0.3)
  Hover:       Background → rgba(239,68,68,0.1)
```

### Input Fields

```
Default Input
  Background:  Surface Dark (#111113)
  Border:      1px solid Border Subtle (#27272A)
  Radius:      6px
  Padding:     10px 12px
  Font:        14px, Text Primary
  Placeholder: Text Muted (#52525B)
  Transition:  border-color 150ms ease

Focus State
  Border:      1px solid Border Default (#3F3F46)
  Outline:     2px solid rgba(99,102,241,0.3) [Indigo glow]
  Background:  Surface Raised (#18181B)

Error State
  Border:      1px solid Red Danger (#EF4444)
  Outline:     2px solid rgba(239,68,68,0.2)

Label
  Font:        13px, weight 500, Text Secondary (#A1A1AA)
  Margin-bottom: 6px
  Letter-spacing: 0.01em
```

### Cards

```
Default Card
  Background:  Surface Dark (#111113)
  Border:      1px solid Border Subtle (#27272A)
  Radius:      10px
  Padding:     20px 24px
  Shadow:      none (flat by default)

Elevated Card
  Background:  Surface Raised (#18181B)
  Border:      1px solid Border Default (#3F3F46)
  Shadow:      0 4px 16px rgba(0,0,0,0.4)

Interactive Card (hover)
  Border:      1px solid rgba(232,93,117,0.3)
  Shadow:      0 0 0 1px rgba(232,93,117,0.15), 0 4px 20px rgba(0,0,0,0.5)
  Transform:   translateY(-2px)
  Transition:  all 200ms ease

Card Header
  Border-bottom: 1px solid Border Subtle (#27272A)
  Padding-bottom: 16px
  Margin-bottom: 16px
```

### Navigation

```
Sidebar Navigation
  Background:  Surface Dark (#111113)
  Width:       240px
  Border-right: 1px solid Border Subtle (#27272A)

Nav Item (default)
  Padding:     8px 12px
  Radius:      6px
  Font:        14px, weight 400, Text Secondary (#A1A1AA)
  Icon:        16px, same color as text

Nav Item (hover)
  Background:  Surface Raised (#18181B)
  Text:        Text Primary (#FAFAFA)

Nav Item (active)
  Background:  Sakura Faint (#3D1520)
  Text:        Sakura Coral (#E85D75)
  Icon:        Sakura Coral (#E85D75)
  Font-weight: 500

Top Nav / Header
  Background:  Surface Dark (#111113) with backdrop-blur: 12px
  Border-bottom: 1px solid Border Subtle (#27272A)
  Height:      56px
  Position:    sticky top-0, z-index: 50
```

### Badges & Tags

```
Default Badge
  Background:  Surface Raised (#18181B)
  Text:        Text Secondary (#A1A1AA)
  Border:      1px solid Border Subtle (#27272A)
  Radius:      4px
  Padding:     2px 8px
  Font:        11px, weight 500, letter-spacing: 0.05em, uppercase

Accent Badge (e.g. "NEW", "BETA")
  Background:  Sakura Faint (#3D1520)
  Text:        Sakura Coral (#E85D75)
  Border:      1px solid rgba(232,93,117,0.3)

Success Badge
  Background:  rgba(16,185,129,0.1)
  Text:        Emerald Success (#10B981)
  Border:      1px solid rgba(16,185,129,0.2)
```

### Code Blocks

```
Inline Code
  Background:  Surface Raised (#18181B)
  Text:        Sakura Soft (#F4869A)
  Border:      1px solid Border Subtle (#27272A)
  Radius:      4px
  Padding:     1px 6px
  Font:        Geist Mono, 13px

Code Block
  Background:  #0D0D0F
  Border:      1px solid Border Subtle (#27272A)
  Radius:      8px
  Padding:     16px 20px
  Font:        Geist Mono, 13px, line-height 1.7
  Header:      filename label + copy button, Border Subtle bottom border
```

### Modals & Overlays

```
Backdrop
  Background:  rgba(0,0,0,0.7)
  Backdrop-filter: blur(4px)

Modal
  Background:  Surface Raised (#18181B)
  Border:      1px solid Border Default (#3F3F46)
  Radius:      12px
  Padding:     24px
  Max-width:   480px (sm) | 640px (md) | 800px (lg)
  Shadow:      0 25px 60px rgba(0,0,0,0.8)
  Animation:   fade-in + scale from 0.96 to 1.0, 200ms ease-out
```

---

## 5. Layout Principles

### Spacing Scale

Based on a 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon gaps, tight component padding |
| `space-2` | 8px | Inner element spacing |
| `space-3` | 12px | Compact padding (badges, chips) |
| `space-4` | 16px | Default component padding |
| `space-5` | 20px | Card inner padding |
| `space-6` | 24px | Section gaps, card padding (lg) |
| `space-8` | 32px | Between major components |
| `space-10` | 40px | Section padding top/bottom |
| `space-12` | 48px | Large section spacing |
| `space-16` | 64px | Page section margins |
| `space-24` | 96px | Hero spacing, major layout gaps |

### Grid & Layout

```
Page Container
  Max-width:   1200px
  Padding:     0 24px (mobile) | 0 40px (tablet) | 0 48px (desktop)
  Margin:      0 auto

Content Width
  Narrow:      640px  (articles, forms, focused content)
  Default:     960px  (standard pages)
  Wide:        1200px (dashboards, data tables)
  Full:        100%   (backgrounds, hero sections)

Dashboard Layout
  Sidebar:     240px fixed
  Main:        flex-1
  Gap:         0 (border separates them)

Card Grid
  Columns:     1 (mobile) | 2 (tablet) | 3 (desktop)
  Gap:         16px (sm) | 20px (md) | 24px (lg)
```

### Whitespace Philosophy

- Section padding: `64px 0` on desktop, `40px 0` on mobile.
- Cards never touch each other — minimum 16px gap.
- Headings always have more space above than below.
- Never crowd a CTA button — it needs breathing room of at least 24px around it.

---

## 6. Depth & Elevation

The interface is predominantly flat. Elevation is used sparingly to create focus and hierarchy.

| Level | Surface | Shadow | Usage |
|-------|---------|--------|-------|
| **0 — Ground** | `#0A0A0B` Void Black | none | App background |
| **1 — Raised** | `#111113` Surface Dark | none | Cards, panels, sidebar |
| **2 — Float** | `#18181B` Surface Raised | `0 4px 16px rgba(0,0,0,0.4)` | Dropdowns, tooltips |
| **3 — Overlay** | `#18181B` Surface Raised | `0 25px 60px rgba(0,0,0,0.8)` | Modals, command palettes |
| **4 — Toast** | `#27272A` | `0 8px 24px rgba(0,0,0,0.6)` | Notifications (top-layer) |

**Key principle:** Never stack more than 3 elevation levels on a single screen. Flat → Float → Overlay is the maximum chain.

**Borders over shadows:** Prefer `1px solid Border Subtle` to define surfaces before adding shadows. Shadows are reserved for floating elements (level 2+).

---

## 7. Do's and Don'ts

### ✅ Do

- Use the coral accent (`#E85D75`) for **one** primary action per screen.
- Maintain consistent `8px radius` for interactive elements (inputs, buttons), `10px` for cards.
- Use `Geist Mono` for any data values, IDs, code snippets, or technical strings.
- Apply `border: 1px solid Border Subtle` to define card edges — avoid background-color-only differentiation.
- Keep icon size consistent: `16px` for inline/nav, `20px` for actions, `24px` for features.
- Use `transition: all 150ms ease-out` for all interactive state changes.
- Show empty states with helpful microcopy — never leave a blank area.
- Prefer text labels alongside icons in navigation (no icon-only nav without tooltips).

### ❌ Don't

- Don't use the coral accent for decorative elements, borders, or text links — it signals action.
- Don't use `border-radius: 9999px` (full pill) on standard buttons — use `6px` for precise, tool-like feel.
- Don't mix Indigo and Coral in the same interactive context.
- Don't use white backgrounds (`#FFFFFF`) in dark mode — always use Surface layers.
- Don't use `font-weight: 300` for body text at any size below 18px — it becomes illegible.
- Don't apply `box-shadow` to flat, ground-level surfaces.
- Don't use `color: red` or `background: blue` — always reference the token system.
- Don't use gradient backgrounds as primary surfaces — gradients are accent decorations only.
- Don't exceed 3 colors in a single component (not counting neutral surface/border colors).

---

## 8. Responsive Behavior

### Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Wide monitors |

### Mobile Strategy

- **Sidebar:** Collapses to off-canvas drawer; triggered by hamburger icon; `z-index: 100`.
- **Card grids:** Stack to single column below `md`.
- **Navigation:** Bottom tab bar (4 items max) replaces sidebar on mobile.
- **Touch targets:** Minimum `44px × 44px` for all interactive elements on mobile.
- **Type scale:** Scale down display/h1 by 25% on mobile (`text-display: 36px`, `text-h1: 28px`).
- **Modals:** Full-screen sheets on mobile, sliding up from bottom.

### Collapsing Strategy

```
Desktop (lg+)  →  Sidebar + main content side by side
Tablet (md)    →  Sidebar collapsed to 64px icon-only strip
Mobile (sm-)   →  Sidebar hidden, accessible via drawer
```

---

## 9. Icon System

- **Library:** Lucide Icons (consistent stroke width: `1.5px`)
- **Sizes:** `16px` (small/inline) · `20px` (default UI) · `24px` (feature/heading) · `48px` (empty states)
- **Color:** Always inherit text color — never hardcode icon color separately from its parent text.
- **Alignment:** Icons aligned to text baseline (`vertical-align: middle`) for inline use.
- **No filled icons** in navigation or utility contexts — use outlined variants consistently.

---

## 10. Motion & Animation

```css
/* Standard transitions */
--transition-fast:   100ms ease-out;   /* Toggle states, checkboxes */
--transition-base:   150ms ease-out;   /* Hover, border, color changes */
--transition-smooth: 200ms ease-out;   /* Transform, modal open */
--transition-slow:   300ms ease-out;   /* Page transitions, skeleton */

/* Entrance animations */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Usage: cards, modal content — 200ms ease-out */

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
/* Usage: modals, dropdowns, popovers — 200ms ease-out */
```

**Rules:**
- No animation should exceed `300ms` (unless it's a full-page transition).
- Respect `prefers-reduced-motion` — disable all transforms and use instant opacity change instead.
- Staggered list entrance: add `animation-delay: calc(index * 40ms)` for lists up to 5 items.

---

## 11. Agent Prompt Guide

### Quick Color Reference

```
Brand coral:       #E85D75  (primary CTA)
Background:        #0A0A0B  (app bg)
Card surface:      #111113  (panels)
Border:            #27272A  (default) / #3F3F46 (active)
Text primary:      #FAFAFA
Text secondary:    #A1A1AA
Text muted:        #52525B
Indigo link:       #6366F1
```

### Ready-to-Use Prompts for Agents

```
"Build a settings page with sidebar navigation using the design system in DESIGN.md. 
Dark background #0A0A0B, card surfaces #111113, coral accent #E85D75 for save button, 
Geist font, 6px border radius on inputs, 1px solid #27272A borders."

"Create a data dashboard with metric cards showing KPIs. Use the elevation system: 
ground at #0A0A0B, cards at #111113 with 1px border #27272A. Success values in 
#10B981, warning in #F59E0B. Geist Mono for numeric values."

"Generate a login form following DESIGN.md. Centered narrow layout (max-width 440px), 
coral primary button, indigo #6366F1 for 'forgot password' link, 
inputs with focus ring rgba(99,102,241,0.3)."

"Build a feature card grid (3 columns desktop, 1 mobile). Cards use #111113 background, 
border #27272A, hover state lifts 2px with coral border-color rgba(232,93,117,0.3). 
Icons 24px Lucide, text hierarchy h3+body."
```

### Tone for UI Copy

- **Headings:** Direct and specific. "Manage extensions" not "Extension Management Center".
- **CTA buttons:** Verb-first. "Save changes" · "Add item" · "Enable" — never "Submit" or "OK".
- **Empty states:** Friendly and actionable. "No items yet — add your first one."
- **Error messages:** Specific about cause. "Invalid email format" not "Something went wrong".
- **Labels:** Sentence case, not Title Case for UI labels.

---

*DESIGN.md generated for Shota Yamazaki's projects (SITRUS EX, PromptUP, Research Portfolio).*  
*Format: Google Stitch DESIGN.md v1.0 extended.*  
*Last updated: 2026-04-04*