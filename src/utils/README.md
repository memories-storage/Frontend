# Utils Directory

This directory contains utility functions, constants, and helper modules that are used throughout the application.

## Structure:
- `constants/` - Application constants and configuration
- `helpers/` - Helper functions for common operations
- `validators/` - Form validation and data validation functions
- `formatters/` - Data formatting utilities (dates, numbers, etc.)
- `api.js` - API utility functions and configurations

## Best Practices:
- Keep functions pure and testable
- Use descriptive names for functions and files
- Group related utilities together
- Export functions individually for better tree-shaking
- Include JSDoc comments for documentation
- Write unit tests for utility functions

## Example Structure:
```
utils/
├── constants/
│   ├── api.js
│   ├── routes.js
│   └── config.js
├── helpers/
│   ├── dateHelpers.js
│   ├── stringHelpers.js
│   └── arrayHelpers.js
├── validators/
│   ├── formValidators.js
│   └── dataValidators.js
└── api.js
``` 