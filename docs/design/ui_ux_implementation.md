# UI/UX Implementation Guide for Brew Master

## Visual Design System

### Color Palette Implementation

#### Primary Colors

```css
:root {
  /* Dark Theme Base Colors */
  --background-primary: #121212;
  --background-secondary: #1e1e1e;
  --background-card: #222222;

  /* Accent Colors */
  --accent-gold: #e6a436;
  --accent-gold-light: #f5c875;
  --accent-gold-dark: #b37d1a;

  /* Functional Colors */
  --water-blue: #4a90e2;
  --success-green: #27ae60;
  --error-red: #e74c3c;
  --warning-orange: #f39c12;

  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-tertiary: #808080;
  --text-disabled: #555555;
}
```

#### Color Usage Guidelines

- Use dark backgrounds (#121212) for main surfaces
- Apply gold accents (#E6A436) for primary actions and highlights
- Implement blue (#4A90E2) for water-related visualizations
- Maintain WCAG 2.1 AA contrast ratios:
  - Regular text: minimum 4.5:1
  - Large text: minimum 3:1
  - UI components: minimum 3:1

### Typography System

#### Font Hierarchy

```css
:root {
  /* Font Families */
  --font-display:
    "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-text: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "SF Pro Mono", monospace;

  /* Font Sizes */
  --text-h1: 2rem; /* 32px */
  --text-h2: 1.5rem; /* 24px */
  --text-h3: 1.25rem; /* 20px */
  --text-h4: 1.125rem; /* 18px */
  --text-body: 1rem; /* 16px */
  --text-small: 0.875rem; /* 14px */
  --text-xs: 0.75rem; /* 12px */

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-loose: 1.8;
}
```

#### Typography Usage

- Use SF Pro Display Bold for headings and important numbers
- Apply SF Pro Text for body content and UI elements
- Implement SF Pro Mono for measurements and technical data
- Maintain minimum font sizes:
  - Mobile: 14px body text
  - Desktop: 16px body text

### Spacing System

```css
:root {
  /* Base Spacing Units */
  --space-unit: 0.5rem; /* 8px */
  --space-xs: calc(var(--space-unit) * 0.5); /* 4px */
  --space-sm: var(--space-unit); /* 8px */
  --space-md: calc(var(--space-unit) * 2); /* 16px */
  --space-lg: calc(var(--space-unit) * 3); /* 24px */
  --space-xl: calc(var(--space-unit) * 4); /* 32px */

  /* Component Specific Spacing */
  --card-padding: var(--space-md);
  --section-margin: var(--space-lg);
  --container-padding: var(--space-md);
}
```

## Component Design

### Interactive Elements

#### Primary Button

```css
.button-primary {
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    var(--accent-gold),
    var(--accent-gold-dark)
  );
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: bold;
  font-size: var(--text-body);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 164, 54, 0.3);
}

.button-primary:active {
  transform: translateY(0);
}
```

#### Form Inputs

```css
.input-field {
  height: 56px;
  padding: 0 16px;
  border-radius: 8px;
  background: var(--background-card);
  border: 1px solid var(--text-tertiary);
  color: var(--text-primary);
  font-family: var(--font-text);
  font-size: var(--text-body);
  transition: border-color 0.2s ease;
}

.input-field:focus {
  border-color: var(--accent-gold);
  outline: none;
  box-shadow: 0 0 0 2px rgba(230, 164, 54, 0.2);
}
```

### Cards and Containers

#### Recipe Card

```css
.recipe-card {
  border-radius: 12px;
  background: var(--background-card);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.recipe-card__image {
  aspect-ratio: 16/9;
  object-fit: cover;
}

.recipe-card__content {
  padding: var(--card-padding);
}

.recipe-card:hover {
  transform: translateY(-4px);
}
```

## Responsive Design Implementation

### Breakpoints

```css
/* Mobile First Breakpoints */
:root {
  --breakpoint-sm: 640px; /* Small devices */
  --breakpoint-md: 768px; /* Medium devices */
  --breakpoint-lg: 1024px; /* Large devices */
  --breakpoint-xl: 1280px; /* Extra large devices */
}
```

### Grid System

```css
.grid-container {
  display: grid;
  gap: var(--space-md);
  padding: var(--container-padding);

  /* Mobile: 1 column */
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid-container {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    /* Desktop: 3 columns */
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Animation Guidelines

### Micro-interactions

```css
/* Button Press Effect */
.interactive-element {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:active {
  transform: scale(0.95);
}

/* Smooth Page Transitions */
.page-transition {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
}
```

### Loading States

```css
/* Skeleton Loading */
.skeleton-loader {
  background: linear-gradient(
    90deg,
    var(--background-card) 25%,
    var(--background-secondary) 50%,
    var(--background-card) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Accessibility Implementation

### Focus States

```css
/* Keyboard Focus Styles */
:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Attributes

```html
<!-- Example of accessible interactive elements -->
<button
  aria-label="Start brewing timer"
  role="timer"
  aria-live="polite"
  class="timer-button"
>
  <span class="visually-hidden">Start Timer</span>
  <svg class="timer-icon" aria-hidden="true">...</svg>
</button>
```

### Screen Reader Only Content

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

## Performance Optimization

### Image Loading

```html
<!-- Responsive Images -->
<img
  src="coffee-small.jpg"
  srcset="coffee-small.jpg 300w, coffee-medium.jpg 600w, coffee-large.jpg 900w"
  sizes="(max-width: 640px) 300px,
         (max-width: 1024px) 600px,
         900px"
  loading="lazy"
  alt="Coffee brewing process"
/>
```

### Critical CSS

```html
<!-- Inline critical CSS -->
<style>
  /* Critical styles for above-the-fold content */
  .header,
  .hero-section {
    /* Immediate styles needed for first paint */
  }
</style>

<!-- Defer non-critical CSS -->
<link
  rel="preload"
  href="styles.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

## Testing Checklist

### Visual Testing

- [ ] Test color contrast ratios
- [ ] Verify typography scales across breakpoints
- [ ] Check component spacing consistency
- [ ] Validate responsive layouts
- [ ] Review animation performance

### Accessibility Testing

- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] ARIA implementation
- [ ] Color contrast compliance
- [ ] Focus management

### Performance Testing

- [ ] Page load times
- [ ] Image optimization
- [ ] Animation frame rates
- [ ] Memory usage
- [ ] Network payload size

### Cross-browser Testing

- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge
- [ ] Mobile browsers

## Documentation Standards

### Component Documentation Template

```markdown
# Component Name

## Purpose

Brief description of the component's function

## Usage

Example code snippet showing implementation

## Props/Parameters

- prop1: description
- prop2: description

## Accessibility

Accessibility considerations and requirements

## States

- Default
- Hover
- Active
- Disabled
- Error

## Variations

Different versions or styles of the component

## Dependencies

Required libraries or components
```

### Version Control

- Use semantic versioning for design system updates
- Document breaking changes
- Maintain a changelog
- Include migration guides for major updates

## Implementation Notes

1. Start with setting up the design tokens (colors, typography, spacing)
2. Implement base components following atomic design principles
3. Build larger components and patterns
4. Create page templates
5. Implement responsive behaviors
6. Add animations and interactions
7. Optimize for performance
8. Test across devices and browsers
9. Document all components and patterns
10. Create usage guidelines for developers
