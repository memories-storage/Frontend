# Services Directory

This directory contains service modules for external API calls, data fetching, and business logic.

## Structure:
- `api/` - API service modules organized by domain
- `auth.js` - Authentication service
- `storage.js` - Local storage and session storage services
- `websocket.js` - WebSocket connection service
- `index.js` - Export all services

## Best Practices:
- Keep services focused on specific domains
- Use consistent error handling patterns
- Implement proper request/response interceptors
- Use TypeScript for better type safety
- Include proper JSDoc documentation
- Handle loading and error states

## API Service Structure:
```
api/
├── auth.js
├── users.js
├── projects.js
├── code.js
└── index.js
```

## Example Usage:
```javascript
import { authService } from '../services/auth';
import { userService } from '../services/api/users';

const login = async (credentials) => {
  const response = await authService.login(credentials);
  return response;
};
```

## Error Handling:
Implement consistent error handling across all services with proper error types and messages. 