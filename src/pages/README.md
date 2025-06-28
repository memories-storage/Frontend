# Pages Directory

This directory contains page-level components that represent entire routes in your application.

## Structure:
- Each page component should be in its own directory
- Include related components, styles, and utilities within the page directory
- Use index.js files for clean imports

## Best Practices:
- Keep pages focused on layout and composition
- Delegate business logic to custom hooks
- Use lazy loading for better performance
- Implement proper error boundaries
- Include loading states and error handling

## Example Structure:
```
pages/
├── Home/
│   ├── Home.jsx
│   ├── Home.css
│   ├── components/
│   └── index.js
├── Projects/
│   ├── Projects.jsx
│   ├── Projects.css
│   ├── components/
│   └── index.js
└── About/
    ├── About.jsx
    ├── About.css
    └── index.js
``` 