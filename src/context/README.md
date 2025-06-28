# Context Directory

This directory contains React Context providers for global state management.

## Structure:
- `AuthContext.js` - Authentication state management
- `ThemeContext.js` - Theme state management
- `AppContext.js` - General application state
- `index.js` - Export all contexts

## Best Practices:
- Keep contexts focused on specific domains
- Use useReducer for complex state logic
- Provide meaningful default values
- Include proper error handling
- Use TypeScript for better type safety
- Implement proper cleanup in useEffect

## Example Usage:
```javascript
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {/* Your app components */}
      </ThemeProvider>
    </AuthProvider>
  );
};
```

## Context Structure:
Each context should include:
- Provider component
- Custom hook for consuming the context
- Initial state
- Action types and reducers (if using useReducer) 