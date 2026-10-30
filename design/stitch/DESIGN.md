---
name: Warm Editorial Focus
colors:
  surface: '#fff8f6'
  surface-dim: '#e4d7d4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fef1ed'
  surface-container: '#f8ebe8'
  surface-container-high: '#f2e6e2'
  surface-container-highest: '#ece0dc'
  on-surface: '#201a18'
  on-surface-variant: '#56423d'
  inverse-surface: '#362f2d'
  inverse-on-surface: '#fbeeea'
  outline: '#89726c'
  outline-variant: '#dcc0ba'
  surface-tint: '#9e4229'
  primary: '#9e4229'
  on-primary: '#ffffff'
  primary-container: '#e87a5d'
  on-primary-container: '#611602'
  inverse-primary: '#ffb4a1'
  secondary: '#6b4bad'
  on-secondary: '#ffffff'
  secondary-container: '#b897ff'
  on-secondary-container: '#49278a'
  tertiary: '#994527'
  on-tertiary: '#ffffff'
  tertiary-container: '#e27e5b'
  on-tertiary-container: '#5d1a00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a1'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#7e2b14'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bcff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#533294'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#7b2f12'
  background: '#fff8f6'
  on-background: '#201a18'
  surface-variant: '#ece0dc'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.75rem
  space-2xl: 2.5rem
---

## Brand & Style

This design system blends Scandinavian minimalism with warm, sensory editorial warmth. Crafted for sustained, distraction-free deep work, it eliminates cognitive fatigue by discarding stark high-contrast whites and harsh tech-industrial tropes. The atmosphere balances academic rigor with empathetic companionship: poised, organized, mindful, and serene.

Visual language leans on soft tonal stacking, warm ambient lighting, and delicate hairline separators. Interactions are calm, tactile, and restrained. The system respects focus by rejecting frantic notification states in favor of gentle progress indicators, clear typographic hierarchies, and organic spatial breathing room.

## Colors

The palette establishes an ambient warmth through muted terracotta foundations paired with reflective lavender intervals:

- **Primary (`#E87A5D` / `#F48C68`)**: Anchors primary CTAs, active study timers, current subject highlights, and vital milestones. It projects warmth, encouragement, and energy without alarm.
- **Secondary (`#7C5CBF` / `#8F72D4`)**: Reserved for cognitive enrichment, synthesis, AI tutor exchanges, meta-tagging, and reflective insights.
- **Surfaces & Canvases**: 
  - Canvas Base: `#FFF8F5` (warm porcelain tint).
  - Surface Card / Container 1: `#FFFFFF` with a 0.5px border of `#F2E7E2`.
  - Surface Secondary: `#FBF3EF` (muted terracotta tint for input backdrops and inactive dropzones).
  - Surface Accent Tint: `#F5F1FD` (lavender mist for AI bubbles and study prompts).
- **Text & Neutral Rhythm**:
  - High Contrast (Primary Text): `#241E1C` (deep warm espresso).
  - Medium Contrast (Secondary Text): `#6E625F` (balanced warm slate).
  - Subtle Muted (Captions / Disabled): `#A89C98`.
  - Divider Hairline: `#EDE3DE`.
- **System Signals**:
  - Urgent Deadlines: `#D9534F` (muted brick red, avoiding neon alarms).
  - Mastery & Completed: `#4E9A7E` (sage evergreen).

## Typography

The typographic hierarchy relies on **Plus Jakarta Sans** for display, reading, and structural indicators. Its clear geometry provides exceptional legibility on compact displays, while its humanist proportions evoke an encouraging, studious demeanor.

- **Proportional Scaling**: Headlines feature tightened letter-spacing (`-0.02em` to `-0.01em`) to create clean title lockups without consuming excessive vertical space on 390px viewports.
- **Editorial Legibility**: Body copy maintains a generous 1.5x line-height ratio over warm backdrops to prevent eye strain during extended revision sessions.
- **Technical Elements**: Equations, flashcard metadata, and countdown counters leverage `JetBrains Mono` at `code-sm` to maintain strict tabular alignment.

## Layout & Spacing

The layout is built for fluid mobile-first presentation, calibrated around a 390px viewport width:

- **Grid & Margins**: A single-column fluid container bound by `1.25rem` (20px) outer edge margins. Section groupings stack with `1.25rem` vertical margins.
- **Micro Rhythms**: Internal component spacing uses `space-xs` (4px) for badge text padding, `space-sm` (8px) for icon-label gaps, and `space-md` (14px) for card body padding.
- **Component Breathing Room**: Action blocks and cards use `space-lg` (20px) internal breathing room, while distinct page segments divide with `space-2xl` (40px).
- **Adaptive Breakpoints**:
  - `Mobile (<640px)`: Full-width stacked layout, sticky bottom study/chat dock, edge-to-edge modal sheets.
  - `Tablet / Wide (>=640px)`: Max-width constraint of 720px centered canvas, dual-column layout for dashboard feeds and flashcard queues.

## Elevation & Depth

Visual hierarchy uses warm ambient lighting rather than heavy drop shadows:

- **Level 0 (Flat Canvas)**: Pure `#FFF8F5` surface with no elevation.
- **Level 1 (Resting Cards & Modules)**: Solid `#FFFFFF` fill resting on Level 0. Outlined with a fine 1px stroke of `#EFE3DE`. Underpinned by a soft warm diffused ambient shadow: `0 2px 8px -2px rgba(184, 110, 89, 0.06), 0 1px 3px 0 rgba(40, 20, 15, 0.03)`.
- **Level 2 (Interactive Cards / Floating Controls)**: Enhanced elevation for hovered or actively engaged units: `0 8px 20px -4px rgba(184, 110, 89, 0.12), 0 2px 6px -1px rgba(40, 20, 15, 0.04)`.
- **Level 3 (Modal Sheets & AI Tutor Drawer)**: Deep ambient blur: `0 16px 36px -8px rgba(50, 28, 48, 0.18), 0 4px 12px -2px rgba(40, 20, 15, 0.06)`, framed by a crisp border `rgba(255, 255, 255, 0.8)`.
- **AI Glow Accentuation**: Elements driven by the AI study tutor employ a subtle secondary ambient halo: `0 0 0 1px rgba(124, 92, 191, 0.15), 0 4px 16px -2px rgba(124, 92, 191, 0.10)`.

## Shapes

The design uses balanced, modern geometric curvatures:

- **Base Radius (`0.5rem` / 8px)**: Inputs, drop-down cells, subject tag chips, and small interactive triggers.
- **Medium Radius (`rounded-lg` - `1rem` / 16px)**: Primary study cards, assignment review panels, dropzones, and AI conversation bubbles.
- **Large Radius (`rounded-xl` - `1.5rem` / 24px)**: Bottom floating bars, popover study sheets, and active focus timer dials.
- **Pill Contours**: Countdown timer badges and status indicator pills always utilize full circular capsules (`rounded-full` / `9999px`).

## Components

### Buttons
- **Primary**: Background `#E87A5D`, label `#FFFFFF` (`label-lg`), subtle warm shadow. Hover/Active scales to `#D96D50`.
- **Secondary (Tutor/Reflective)**: Background `#7C5CBF`, label `#FFFFFF`. Hover/Active scales to `#6E4EB0`.
- **Ghost/Tonal**: Background `#FBF3EF`, text `#E87A5D`, border none. Hover deepens to `#F5E5DE`.

### Subject Tags & Chips
- Soft-tinted backgrounds:
  - STEM/Math: Background `rgba(232, 122, 93, 0.12)`, text `#C5593D`.
  - Humanities/Literature: Background `rgba(124, 92, 191, 0.12)`, text `#6849A6`.
  - Sciences: Background `rgba(78, 154, 126, 0.14)`, text `#337059`.
- Format: `label-sm`, uppercase tracking `0.04em`, 100% pill radius, horizontal padding 8px, vertical padding 3px.

### Deadline Countdown Badges
- Capsule format containing a mono tabular timer (`code-sm`).
- Normal state: Background `#F5F1FD`, border `1px solid rgba(124, 92, 191, 0.2)`, text `#7C5CBF`.
- Imminent state (< 24h): Background `#FFF1EF`, border `1px solid rgba(217, 83, 79, 0.25)`, text `#D9534F` with a soft pulsing 6px dot indicator.

### Document Upload Dropzones (PDF / Images)
- Container: Surface `#FAF6F4` with a dashed border `1.5px dashed #DCCDC7`, border radius `1rem`.
- Active drag state: Border `#E87A5D`, background `#FFF8F5`.
- Inner content: Central warm icon badge (`40x40px`, background `#FFFFFF`, shadow Level 1), headline `body-md` in `#241E1C`, secondary subtext `body-sm` in `#6E625F`. Supports file size and type preview pill metadata.

### AI Study Tutor Chat Bubbles
- **User Message**: Aligned right, background `#E87A5D`, text `#FFFFFF`, rounded `1rem` with bottom-right corner squared off to `4px`.
- **Tutor Response**: Aligned left, background `#F5F1FD`, border `1px solid rgba(124, 92, 191, 0.16)`, text `#241E1C`, rounded `1rem` with bottom-left corner squared off to `4px`.
- Attached quick actions (e.g., "Summarize", "Create Flashcard") render inside the bubble stream as soft ghost pill buttons with `#7C5CBF` borders.

### Cards & Subject Progress
- Baseline Level 1 elevation, white background, `1rem` border radius, padding `1.25rem`.
- Features an integrated progress bar: 4px height, track background `#EDE3DE`, active bar `#E87A5D` (transitions to `#7C5CBF` upon reaching target mastery).

### Inputs & Search Bars
- Background `#FFFFFF`, border `1px solid #EFE3DE`, text `#241E1C`, placeholder `#A89C98`.
- Focus state: Border `#E87A5D`, soft terracotta glow `0 0 0 3px rgba(232, 122, 93, 0.14)`.