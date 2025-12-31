# Visual Guide: Priority 2 & 3 Implementation

## Priority 2: Products Filter Sidebar

### Desktop View (> 992px)
```
┌─────────────────────────────────────────────────────────────┐
│                        NAVBAR                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  Products Toolbar                   │  │
│  │   FILTERS    │  │  [Showing X of Y products]          │  │
│  │   SIDEBAR    │  └────────────────────────────────────┘  │
│  │              │                                           │
│  │ Category     │  ┌───────┐ ┌───────┐ ┌───────┐          │
│  │ [Dropdown]   │  │Product│ │Product│ │Product│          │
│  │              │  │ Card  │ │ Card  │ │ Card  │          │
│  │ Wattage      │  └───────┘ └───────┘ └───────┘          │
│  │ [Min] - [Max]│                                           │
│  │              │  ┌───────┐ ┌───────┐ ┌───────┐          │
│  │ Price (GH₵)  │  │Product│ │Product│ │Product│          │
│  │ [Min] - [Max]│  │ Card  │ │ Card  │ │ Card  │          │
│  │              │  └───────┘ └───────┘ └───────┘          │
│  │ [Apply]      │                                           │
│  │ [Clear All]  │         [Pagination]                     │
│  │              │                                           │
│  └──────────────┘                                           │
│     (Sticky)                                                │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (< 992px)
```
┌──────────────────────────┐
│        NAVBAR            │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │ [🎚️ Filters]       │  │  ← Toggle Button
│  │ Showing X of Y     │  │
│  └────────────────────┘  │
│                          │
│  ┌──────┐  ┌──────┐     │
│  │Product│ │Product│    │
│  └──────┘  └──────┘     │
│                          │
│  ┌──────┐  ┌──────┐     │
│  │Product│ │Product│    │
│  └──────┘  └──────┘     │
│                          │
└──────────────────────────┘

When Toggle Clicked:
┌──────────────────────────┐
│ ╔════════════════╗       │
│ ║ [✕] FILTERS    ║       │  ← Sidebar slides in
│ ║                ║       │
│ ║ Category       ║       │
│ ║ [Dropdown]     ║       │
│ ║                ║       │
│ ║ Wattage        ║       │
│ ║ [Min] - [Max]  ║       │
│ ║                ║       │
│ ║ Price          ║       │
│ ║ [Min] - [Max]  ║       │
│ ║                ║       │
│ ║ [Apply]        ║       │
│ ║ [Clear All]    ║       │
│ ╚════════════════╝       │
│ [Backdrop Overlay]       │
└──────────────────────────┘
```

---

## Priority 3: Hero Banner with Animations

### Banner Structure
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    [◀]                    [▶]               │  ← Nav Buttons
│                                                              │
│                                                              │
│                  ╔═══════════════════╗                      │
│                  ║                   ║                      │
│                  ║   BANNER TITLE    ║  ← Fade In Up       │
│                  ║                   ║     (1s delay)       │
│                  ║   Subtitle text   ║  ← Fade In Up       │
│                  ║                   ║     (1.2s delay)     │
│                  ║   [Shop Now →]    ║  ← Fade In Up       │
│                  ║                   ║     (1.4s delay)     │
│                  ╚═══════════════════╝                      │
│                                                              │
│                                                              │
│                    ● ━━━ ● ●                                │  ← Indicators
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Animation Sequence
```
Step 1 (0s):     Banner fades in + scales from 1.1 to 1.0
                 ↓
Step 2 (0.2s):   Title slides up and fades in
                 ↓
Step 3 (0.4s):   Subtitle slides up and fades in
                 ↓
Step 4 (0.6s):   Button slides up and fades in
                 ↓
Step 5 (5s):     Auto-rotate to next banner
```

### Interactive Elements

#### Navigation Buttons
```
Normal State:        Hover State:
┌─────┐             ┌─────┐
│  ◀  │    →        │  ◀  │  (Orange background)
└─────┘             └─────┘  (Scale 1.1)
(White bg)          (Shadow glow)
```

#### Indicator Dots
```
Inactive:  ●  ●  ●  (Small circles)
Active:    ━━━      (Pill shape, orange)
Hover:     ⬤        (Larger circle)
```

#### Hero Button
```
Normal:              Hover:
┌──────────────┐    ┌──────────────┐
│ Shop Now  →  │ →  │ Shop Now   → │  (Arrow moves right)
└──────────────┘    └──────────────┘  (Lifts up)
(Orange)            (Darker orange)
                    (Larger shadow)
```

---

## Color Palette

### Primary Colors
```
Orange:     ████  #FF6B3D  (Primary actions)
Dark Orange:████  #e55a2f  (Hover states)
Black:      ████  #0f0f0f  (Text, headers)
White:      ████  #ffffff  (Backgrounds)
```

### Gray Scale
```
Gray 50:    ████  #fafafa  (Page background)
Gray 100:   ████  #f5f5f5  (Card backgrounds)
Gray 200:   ████  #eeeeee  (Borders)
Gray 600:   ████  #757575  (Secondary text)
Gray 800:   ████  #424242  (Primary text)
```

---

## Animation Timing

### Filter Sidebar
- **Slide In**: 0.3s ease
- **Backdrop Fade**: 0.3s ease
- **Button Hover**: 0.3s cubic-bezier

### Hero Banner
- **Banner Transition**: 1s ease
- **Content Fade In**: 1s ease (staggered)
- **Button Hover**: 0.3s ease
- **Auto-rotate**: Every 5 seconds

---

## Responsive Breakpoints

```
Desktop (> 992px):
- Sidebar: 280px width, sticky
- Hero: 600px height
- Nav buttons: 50px

Tablet (768px - 992px):
- Sidebar: Modal overlay
- Hero: 450px height
- Nav buttons: 40px

Mobile (< 768px):
- Sidebar: 320px max-width
- Hero: 400px height
- Nav buttons: 36px
- Stacked layouts
```

---

## User Interactions

### Filter Sidebar
1. **Desktop**: Always visible, scroll with page
2. **Mobile**: Click toggle → Sidebar slides in → Click backdrop or X to close
3. **Apply**: Filters products immediately
4. **Clear**: Resets all filters and reloads products

### Hero Banner
1. **Auto-rotate**: Changes every 5 seconds
2. **Manual navigation**: Click ◀ or ▶ buttons
3. **Direct access**: Click indicator dots
4. **Hover effects**: All interactive elements respond
5. **CTA button**: Links to products or specific pages

---

## Accessibility Features

### Filter Sidebar
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Close button (mobile)
- ✅ Backdrop click to close

### Hero Banner
- ✅ ARIA labels on navigation
- ✅ Keyboard accessible controls
- ✅ Alt text on images
- ✅ Proper heading hierarchy
- ✅ Focus management

---

## Performance Optimizations

### CSS Animations
- ✅ GPU-accelerated (transform, opacity)
- ✅ No layout shifts
- ✅ Smooth 60fps
- ✅ Minimal repaints

### JavaScript
- ✅ Debounced filter updates
- ✅ Efficient DOM manipulation
- ✅ Event delegation
- ✅ Lazy loading ready

---

**Visual Guide Created**: December 25, 2024
**Implementation Status**: ✅ Complete
