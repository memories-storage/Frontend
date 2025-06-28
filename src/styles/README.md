# Styles Directory

This directory contains global styles, CSS variables, and styling utilities.

## Structure:
- `global.css` - Global styles and CSS reset
- `variables.css` - CSS custom properties (variables)
- `themes/` - Theme-specific styles
- `components/` - Component-specific styles
- `utilities/` - Utility classes and mixins

## Best Practices:
- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Keep styles modular and reusable
- Use CSS Grid and Flexbox for layouts
- Implement responsive design patterns
- Optimize for performance

## CSS Variables:
Define colors, spacing, typography, and other design tokens as CSS variables for consistency across the application.

## Theme Support:
Organize theme styles to support light/dark mode and other theme variations.

## Example Structure:
```
styles/
├── global.css
├── variables.css
├── themes/
│   ├── light.css
│   └── dark.css
├── components/
│   ├── button.css
│   └── modal.css
└── utilities/
    ├── spacing.css
    └── typography.css
``` 