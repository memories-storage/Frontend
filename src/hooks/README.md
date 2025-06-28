# Hooks Directory

This directory contains custom React hooks that encapsulate reusable logic and state management.

## Structure:
- `useAuth.js` - Authentication-related hooks
- `useApi.js` - API call hooks
- `useLocalStorage.js` - Local storage hooks
- `useForm.js` - Form handling hooks
- `useTheme.js` - Theme management hooks

## Best Practices:
- Use the `use` prefix for all custom hooks
- Keep hooks focused on a single responsibility
- Return objects or arrays for multiple values
- Include proper error handling
- Add JSDoc comments for documentation
- Test hooks thoroughly

## Example Usage:
```javascript
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  const { data, loading, error, fetchData } = useApi('/api/users');
  
  // Component logic
};
``` 