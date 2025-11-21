# Design Guidelines - Circle.so Authentication Webapp

## Design Approach
**Selected System**: Material Design 3 with security-focused minimalism
**Rationale**: Authentication interfaces require clarity, trust, and accessibility. Material Design provides proven patterns for forms, validation states, and progressive disclosure while maintaining a professional, trustworthy appearance in iframe contexts.

## Core Design Principles
- **Trust through simplicity**: Clean, uncluttered interface builds user confidence
- **Immediate feedback**: Clear validation states reduce user anxiety
- **Progressive disclosure**: Show only what's needed at each authentication stage
- **Iframe-optimized**: Compact layouts that work within constrained embedding contexts

## Typography

**Font Family**: Inter (via Google Fonts CDN)
- Primary: Inter (400, 500, 600 weights)

**Hierarchy**:
- Page titles/headers: text-2xl font-semibold (24px)
- Section labels: text-sm font-medium uppercase tracking-wide (14px)
- Form labels: text-base font-medium (16px)
- Input text: text-base (16px)
- Helper text: text-sm (14px)
- Error messages: text-sm font-medium (14px)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Form field spacing: gap-6
- Button spacing: px-6 py-3
- Section margins: mb-8 to mb-12
- Container max-width: max-w-md (centered for forms)

**Grid**: Single column layouts for authentication flows

## Component Library

### Authentication Container
- Centered card layout with subtle shadow (shadow-lg)
- White background with rounded corners (rounded-lg)
- Max width 448px (max-w-md)
- Padding: p-8
- Responsive: Full width on mobile with px-4

### Form Elements

**Input Fields**:
- Border: 2px solid with focus ring
- Height: h-12
- Padding: px-4
- Rounded: rounded-md
- Font size: text-base
- Full width: w-full
- Clear focus states with ring offset

**PIN Input** (specific design):
- Numeric keypad-style or individual digit boxes
- Large, monospaced characters for clarity
- Pattern: 4-6 individual boxes or single masked input
- Auto-focus progression between digits

**Labels**:
- Positioned above inputs
- Font: text-base font-medium
- Margin: mb-2
- Required indicator: * in error red

**Buttons**:
- Primary CTA: Full width (w-full), height h-12
- Font: text-base font-semibold
- Rounded: rounded-md
- Loading state: Disabled appearance + spinner

### Validation States

**Success**:
- Green accent (border-green-500)
- Checkmark icon (Heroicons)
- Success message: text-green-700

**Error**:
- Red accent (border-red-500)
- X icon or alert triangle (Heroicons)
- Error message: text-red-700 with bg-red-50 background (p-3 rounded)

**Loading**:
- Subtle spinner animation
- Disabled button state
- Reduced opacity on form (opacity-60)

### Messaging Components

**Welcome Banner** (new users):
- Light background panel
- User name prominently displayed (text-xl font-semibold)
- Clear instruction text
- Icon: User circle or welcome icon

**Rate Limit Warning**:
- Yellow/amber alert box (bg-amber-50 border-amber-200)
- Warning icon
- Countdown timer display
- Clear explanation text

**Session Timeout Notice**:
- Slide-in notification (top or bottom)
- Countdown display
- "Extend session" action button

## Dev Mode Indicator
- Floating badge (top-right corner)
- Bright yellow/orange background
- Text: "DEV MODE" with code icon
- Small: text-xs px-3 py-1
- Position: Fixed top-4 right-4

## Icons
**Library**: Heroicons (via CDN) - outline style for clarity
- Lock icon (authentication)
- User circle (profile)
- Check circle (success)
- X circle (error)
- Exclamation triangle (warning)
- Clock (session timeout)
- Code bracket (dev mode)

## Accessibility
- Form labels always visible (no placeholder-only patterns)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Error messages linked to inputs via aria-describedby
- Color contrast minimum WCAG AA (4.5:1)
- Touch targets minimum 44x44px (h-12 buttons)
- Keyboard navigation fully supported

## Animation Guidelines
**Minimal animations only for feedback**:
- Input focus: Smooth border color transition (transition-colors duration-200)
- Button press: Subtle scale (active:scale-98)
- Success/error messages: Fade in (animate-fade-in)
- Loading spinner: Rotate animation only
- **No decorative animations** - security context demands seriousness

## Responsive Constraints (Iframe Context)
- Min-width: 320px (mobile)
- Optimal width: 400-600px
- Vertical scrolling: Enabled within iframe
- No fixed positioning except dev mode badge
- Padding on mobile: px-4 (prevent edge cutoff)