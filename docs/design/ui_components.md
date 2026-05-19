# UI Components for Brew Master App

## Design System

### Typography

- **Headings**: SF Pro Display Bold
  - H1: 32px
  - H2: 24px
  - H3: 20px
  - H4: 18px
- **Body Text**: SF Pro Text
  - Regular: 16px
  - Small: 14px
  - XSmall: 12px
- **Special Elements**:
  - Timer: SF Pro Display Light, 64px
  - Measurements: SF Pro Mono Medium, 18px

### Color System

- **Primary Colors**:
  - Dark Background: #121212
  - Secondary Background: #1E1E1E
  - Card Background: #222222
- **Accent Colors**:
  - Gold: #E6A436
  - Gold Light: #F5C875
  - Gold Dark: #B37D1A
- **Functional Colors**:
  - Water Blue: #4A90E2
  - Success Green: #27AE60
  - Error Red: #E74C3C
  - Warning Orange: #F39C12
- **Text Colors**:
  - Primary Text: #FFFFFF
  - Secondary Text: #B3B3B3
  - Tertiary Text: #808080
  - Disabled Text: #555555

### Spacing System

- Base unit: 8px
- Content padding: 16px
- Section margin: 24px
- Card padding: 16px
- Card margin: 12px

## Component Library

### Navigation Components

#### Bottom Navigation Bar

- Height: 64px
- Background: #1A1A1A with subtle top border
- Icons: Line style with gold active state
- Labels: Small text (12px) under icons
- Active indication: Gold underline and filled icon
- Items:
  - Prepare (coffee pot icon)
  - Discover (compass icon)
  - Cart (shopping cart icon)
  - Profile (user icon)

#### Top Header Bar

- Height: 56px
- Title: Center aligned, H3 size
- Left action: Back button or menu
- Right action: Context-specific (search, share, etc.)
- Transparent background with subtle bottom shadow when scrolled

#### Tab Bar

- Height: 48px
- Pill-shaped selector with smooth sliding animation
- Gold indicator for active tab
- White text for active, gray for inactive
- Equal width tabs or scrollable tabs for many options

### Content Components

#### Recipe Card

- Height: 180px
- Rounded corners (12px)
- Cover image with subtle gradient overlay
- Title overlay in bottom left
- Rating stars in bottom right
- Difficulty indicator (coffee bean icons)
- Time indicator with clock icon
- Subtle shadow and scale-up animation on press

#### Bean Profile Card

- Height: 140px
- Left: Bean bag image or roaster logo (30%)
- Right: Content (70%)
  - Roaster name (small caps)
  - Bean name (bold)
  - Origin (with flag icon)
  - Roast level (visual indicator)
  - Rating (star system)
- Subtle shine animation on new items

#### Method Card (Brew Selection)

- Circle shape (120px diameter)
- Icon illustration centered (60px)
- Method name underneath
- Border glow for favorite methods
- "PRO" badge where applicable
- White stroke on dark background
- Gold accent details

#### Achievement Badge

- Hexagonal shape
- Illustrated icon centered
- Two states: locked (grayscale), unlocked (color)
- Shine animation when newly unlocked
- Small progress indicator for in-progress badges
- Tooltip on press showing requirements

### Input Components

#### Primary Button

- Height: 48px
- Rounded corners (24px)
- Gold gradient background
- White bold text
- Icon option on left
- Loading state with animated dots
- Subtle press animation with haptic feedback

#### Secondary Button

- Height: 48px
- Rounded corners (24px)
- Transparent background with gold border
- Gold text
- Same press animation as primary

#### Text Input Field

- Height: 56px
- Rounded corners (8px)
- Dark gray background (#2A2A2A)
- White text, gray placeholder
- Label above or as placeholder
- Gold underline on focus
- Right aligned clear button
- Validation states with color coding

#### Slider

- Height: 36px
- Custom gold thumb
- Track with fill indication
- Value bubble appears on drag
- Haptic feedback on significant values
- Optional step markers

#### Toggle Switch

- Standard iOS/Android style
- Gold accent color when on
- Gray when off
- Smooth animation between states

### Feedback Components

#### Toast Notification

- Height: 56px
- Rounded corners (8px)
- Slides in from top
- Icon on left
- Message and optional action
- Auto-dismisses after 3 seconds
- Swipe to dismiss

#### Loading Indicator

- Coffee cup with animated steam
- Subtle pulse animation
- Optional progress percentage
- Transparent dark background overlay for modal loading

#### Rating Control

- Coffee bean icons instead of stars
- Empty/filled states
- Hover effects showing possible selection
- Haptic feedback on selection
- Optional half-bean ratings

### Special Components

#### Timer Control

- Large circular progress indicator
- Current time in center (large font)
- Play/pause button below
- Skip button for advanced users
- Wave animation for water level (if applicable)
- Color transitions to indicate stages
- Haptic and sound alerts at completion

#### Brewing Progress Visualization

- Vertical timeline with steps
- Current step highlighted
- Completed steps with checkmarks
- Locked future steps
- Smooth animations between states
- Time indicators for each step

#### Coffee/Water Ratio Visualization

- Split circular display
- Coffee grounds (brown) on top
- Water (blue) on bottom
- Real-time update as user adds ingredients
- Target indicators
- Flow animation during brewing

#### Flavor Profile Radar Chart

- Hexagonal radar chart
- 6 main flavor dimensions:
  - Acidity
  - Sweetness
  - Body
  - Bitterness
  - Fruitiness
  - Nuttiness
- Gold fill with subtle gradient
- Animation when values change

#### Bean Scanner Interface

- Camera viewfinder with guide markers
- Scan animation
- Recognition feedback
- Manual entry fallback button
- Recently scanned list
- Tutorial overlay for first-time users

## Animation Library

### Transition Animations

- **Screen Transitions**: Slide from right, fade out to left
- **Modal Presentation**: Slide up with backdrop fade
- **List Item Entry**: Subtle fade and slide up staggered by 50ms
- **Tab Switching**: Crossfade with shared elements preserved

### Micro-interactions

- **Button Press**: Scale down to 95%, then back with subtle bounce
- **Toggle Switch**: Smooth sliding with "click" feel
- **List Item Swipe**: Reveal actions with resistance at edges
- **Pull to Refresh**: Coffee drop animation that fills cup

### Process Visualizations

- **Brewing Timer**: Circular progress with pulsing effect
- **Water Pouring**: Wave animation with physics
- **Grinding**: Particle effect animation
- **Steam**: Subtle moving particles that fade

### Reward Animations

- **Level Up**: Starburst with particles and floating text
- **Badge Unlock**: Shine wipe with reveal animation
- **Achievement**: Confetti burst with haptic pulses
- **Recipe Completion**: Gold star burst with "success" sound
