# Christmas Letter Frontend

An interactive letter reading experience with envelope opening animations and reveal mechanics.

## Features

### Envelope Animation
- **Interactive Opening**: Click on the closed envelope to trigger an elegant opening animation
- **3D Flap Animation**: Realistic envelope flap that rotates open using CSS transforms
- **Letter Slide-Out**: The letter smoothly slides out from the envelope
- **Responsive Design**: Adapts to mobile and desktop screens with proper proportions

### Letter Display
- **Locked Text Blocks**: Each content block starts locked with a click-to-reveal mechanism
- **Left-to-Right Reveal**: Text reveals with a smooth left-to-right animation when unlocked
- **Hover Effects**: Visual feedback when hovering over locked blocks
- **Beige Theme**: Warm, cohesive color palette throughout

### State Management
- **Zustand Store**: Centralized state management for:
  - Envelope open/closed state
  - Individual text block unlock states
  - Reset functionality when closing the letter

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Mantine 7** - UI component library
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **Vite** - Build tool

## Project Structure

```
src/
├── components/
│   ├── EnvelopeAnimation.tsx    # Envelope opening animation
│   ├── TextBlock.tsx             # Individual text block with lock/reveal
│   ├── LetterHeader.tsx          # Letter recipient and description
│   ├── LetterContent.tsx         # Content blocks renderer
│   ├── LoadingState.tsx          # Loading spinner
│   └── ErrorState.tsx            # Error display
├── pages/
│   └── public/
│       └── PublicLetterPage.tsx  # Main letter viewing page
├── stores/
│   ├── letterStore.ts            # Letter data fetching
│   └── letterInteractionStore.ts # UI interaction state
├── types/
│   └── index.ts                  # TypeScript type definitions
└── theme.ts                      # Mantine theme configuration
```

## Component Responsibilities

### EnvelopeAnimation
- Manages envelope animation states (closed, opening, open)
- Handles click interaction to start animation
- Orchestrates the sequence: flap opens → letter slides out → content fades in
- Responsive sizing for mobile and desktop

### TextBlock
- Displays individual content blocks with lock overlay
- Manages hover states for visual feedback
- Triggers unlock animation on click
- Syncs state with Zustand store

### LetterHeader
- Displays recipient name ("To: [name]")
- Shows letter description if present
- Consistent styling with theme

### LetterContent
- Maps over content blocks
- Renders appropriate component based on block type
- Passes through envelope key for proper reset behavior

### CloseButton
- Conditionally renders when envelope is open
- Resets all interaction state
- Forces envelope remount for clean restart

## Theme Customization

The theme is defined in `src/theme.ts`:

```typescript
// Easy to modify font
export const APP_FONT = 'Roboto, sans-serif';

// Beige color palette (10 shades)
const beigeColors = [
  '#f9f6f2',  // Lightest
  '#f4ede4',
  '#ebe2d6',
  '#e0d4c4',
  '#d5c5b0',  // Used for envelope back
  '#c9b69c',  // Used for envelope flap
  '#bda688',
  '#a88f6f',
  '#8e7559',
  '#6e5b45',  // Darkest - used for text
] as const;
```

### Customizing Colors
1. Edit the `beigeColors` array in `theme.ts`
2. Maintain 10 shades from lightest to darkest
3. Colors are automatically applied throughout the app

### Customizing Font
1. Update the `APP_FONT` constant in `theme.ts`
2. Add the font link to `index.html` if using Google Fonts

## State Management

### letterInteractionStore
Manages all UI interaction state:

```typescript
{
  isEnvelopeOpen: boolean,           // Envelope animation state
  unlockedBlocks: Set<string>,       // IDs of unlocked text blocks
  openEnvelope: () => void,          // Mark envelope as open
  unlockBlock: (id: string) => void, // Unlock a text block
  isBlockUnlocked: (id: string) => boolean, // Check unlock status
  reset: () => void,                 // Reset all state
}
```

### letterStore
Handles letter data fetching from the backend:

```typescript
{
  currentLetter: LetterPublic | null,
  isLoading: boolean,
  error: string | null,
  fetchPublicLetter: (slug: string) => Promise<void>,
}
```

## Key Interactions

### Opening the Letter
1. User clicks on the closed envelope
2. Flap rotates 180° (1s duration)
3. Letter slides out from behind (1.2s, starts at 0.8s)
4. Content fades in (0.8s, starts when letter is visible)
5. Store marks envelope as open

### Unlocking Text Blocks
1. User clicks on a locked text block
2. Overlay fades out
3. Text reveals left-to-right with clipPath animation (1.2s)
4. Store records the block as unlocked

### Closing the Letter
1. User clicks "Close letter" button
2. Store resets all state (envelope + unlocked blocks)
3. Envelope key increments, forcing component remount
4. Everything returns to initial closed state

## Responsive Design

### Mobile Optimizations
- Envelope height limited to 45vh on mobile
- Font sizes scale with viewport width using `clamp()`
- Padding adjusts based on screen size
- Touch-friendly click targets

### Desktop Experience
- Maximum envelope size of 900px width
- Hover effects for better interactivity
- Optimized animations for larger screens

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox
- CSS Transforms and Transitions
- Framer Motion animations

## Future Enhancements

- [ ] Support for image and rich text content blocks
- [ ] Sound effects for opening/unlocking
- [ ] Social sharing functionality
- [ ] Print-friendly version
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Animation preferences (reduced motion support)
