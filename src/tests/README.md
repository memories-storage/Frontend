# Tests Directory

This directory contains all test files for the React application.

## Structure:
- `components/` - Component tests
- `hooks/` - Custom hooks tests
- `utils/` - Utility function tests
- `services/` - Service tests
- `integration/` - Integration tests
- `__mocks__/` - Mock files for testing

## Testing Framework:
- Jest - Test runner and assertion library
- React Testing Library - Component testing utilities
- MSW (Mock Service Worker) - API mocking

## Best Practices:
- Test user behavior, not implementation details
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test error states and edge cases
- Keep tests simple and focused

## File Naming Convention:
- Component tests: `ComponentName.test.jsx`
- Hook tests: `useHookName.test.js`
- Utility tests: `utilityName.test.js`

## Example Test Structure:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Coverage:
Aim for at least 80% code coverage with focus on critical business logic. 