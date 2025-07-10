# Hierarchical Folder System

This document explains the implementation of the hierarchical folder system with individual components for easy understanding and maintenance.

## Overview

The folder system implements a hierarchical structure where:
- **Root level**: Folders with `parent_id = null` (user's top-level folders)
- **Sub-folders**: Folders with `parent_id = folder_id` (nested folders)
- **Navigation**: Breadcrumb navigation for easy folder traversal
- **CRUD Operations**: Create, read, update, delete folders at any level

## Component Architecture

### 1. FolderExplorer (Main Component)
**Location**: `src/components/common/FolderExplorer/`

**Purpose**: Main orchestrator component that manages the entire folder navigation experience.

**Key Features**:
- Manages current folder state and breadcrumb navigation
- Handles folder CRUD operations
- Provides bulk selection and deletion
- Integrates all sub-components

**Props**:
```javascript
{
  onFolderSelect: (folder) => void,    // Callback when folder is selected
  onFileSelect: (file) => void,        // Callback when file is selected
  showCreateButton: boolean,           // Show/hide create folder button
  showActions: boolean,                // Show/hide folder actions
  className: string                    // Additional CSS classes
}
```

**Usage**:
```javascript
import FolderExplorer from '../components/common/FolderExplorer';

<FolderExplorer
  onFolderSelect={(folder) => console.log('Selected:', folder)}
  showCreateButton={true}
  showActions={true}
/>
```

### 2. Breadcrumb Component
**Location**: `src/components/common/Breadcrumb/`

**Purpose**: Provides navigation breadcrumbs for folder hierarchy.

**Features**:
- Clickable breadcrumb navigation
- Responsive design with text truncation
- Visual separation between levels

**Props**:
```javascript
{
  breadcrumbs: Array<{id: string, name: string}>,  // Breadcrumb items
  onNavigate: (index: number) => void              // Navigation callback
}
```

### 3. FolderCard Component
**Location**: `src/components/common/FolderCard/`

**Purpose**: Individual folder display card with actions.

**Features**:
- Folder icon and metadata display
- Selection checkbox for bulk operations
- Hover actions (delete, rename)
- Responsive design

**Props**:
```javascript
{
  folder: Object,                      // Folder data
  onClick: (folder) => void,           // Click handler
  onDelete: (folderId) => void,        // Delete handler
  onRename: (folder) => void,          // Rename handler
  isSelected: boolean,                 // Selection state
  onSelect: (folderId) => void,        // Selection handler
  showActions: boolean                 // Show/hide actions
}
```

### 4. FolderGrid Component
**Location**: `src/components/common/FolderGrid/`

**Purpose**: Grid layout container for folder cards.

**Features**:
- Responsive grid layout
- Loading, error, and empty states
- Handles folder card rendering

**Props**:
```javascript
{
  folders: Array<Object>,              // Array of folders
  onFolderClick: (folder) => void,     // Folder click handler
  onFolderDelete: (folderId) => void,  // Delete handler
  onFolderRename: (folder) => void,    // Rename handler
  selectedFolders: Set<string>,        // Selected folder IDs
  onFolderSelect: (folderId) => void,  // Selection handler
  showActions: boolean,                // Show/hide actions
  loading: boolean,                    // Loading state
  error: string                        // Error message
}
```

## Backend API Structure

### Database Schema
```sql
CREATE TABLE folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    parent_id UUID,                    -- NULL for root folders
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
);
```

### API Endpoints

#### 1. Create Folder
```
POST /api/folders
Content-Type: application/json

{
  "name": "Folder Name",
  "parent_id": "optional-parent-folder-id"
}
```

#### 2. Get Folders
```
GET /api/folders?parent_id=folder-id
```
- Without `parent_id`: Returns root folders (parent_id = null)
- With `parent_id`: Returns child folders of specified parent

#### 3. Get Single Folder
```
GET /api/folders/{id}
```

#### 4. Delete Folder
```
DELETE /api/folders/{id}
```
- Cascades to delete all child folders

## Usage Examples

### Basic Implementation
```javascript
import React from 'react';
import FolderExplorer from '../components/common/FolderExplorer';

const MyComponent = () => {
  const handleFolderSelect = (folder) => {
    console.log('Selected folder:', folder);
    // Handle folder selection
  };

  return (
    <div style={{ height: '100vh' }}>
      <FolderExplorer
        onFolderSelect={handleFolderSelect}
        showCreateButton={true}
        showActions={true}
      />
    </div>
  );
};
```

### Custom Folder Actions
```javascript
const handleFolderSelect = (folder) => {
  // Custom logic for folder selection
  setCurrentFolder(folder);
  updateURL(`/folders/${folder.id}`);
};

const handleFileSelect = (file) => {
  // Handle file selection within folders
  openFilePreview(file);
};
```

### Conditional Rendering
```javascript
<FolderExplorer
  onFolderSelect={handleFolderSelect}
  showCreateButton={userCanCreateFolders}
  showActions={userCanManageFolders}
  className="custom-folder-explorer"
/>
```

## State Management

The FolderExplorer component manages its own state:

```javascript
const [folders, setFolders] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [breadcrumbs, setBreadcrumbs] = useState([]);
const [currentFolderId, setCurrentFolderId] = useState(null);
const [selectedFolders, setSelectedFolders] = useState(new Set());
```

## Key Features

### 1. Hierarchical Navigation
- Breadcrumb navigation for easy folder traversal
- Parent-child relationship management
- Automatic navigation state updates

### 2. CRUD Operations
- **Create**: New folders at any level
- **Read**: Fetch folders by parent ID
- **Update**: Folder renaming (extensible)
- **Delete**: Single and bulk deletion with cascade

### 3. Bulk Operations
- Multi-select folder functionality
- Bulk delete with confirmation
- Selection state management

### 4. Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions

### 5. Error Handling
- Loading states
- Error messages
- Graceful fallbacks

## Development Guidelines

### Adding New Features
1. **Extend FolderCard**: Add new actions or display elements
2. **Update FolderExplorer**: Add new state management and handlers
3. **Modify API**: Add new endpoints if needed
4. **Update Types**: Ensure TypeScript types are updated

### Styling
- Use CSS variables for theming
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### Performance
- Implement proper loading states
- Use React.memo for expensive components
- Optimize re-renders with useCallback/useMemo

## Troubleshooting

### Common Issues

1. **Folders not loading**: Check API endpoint and authentication
2. **Navigation not working**: Verify breadcrumb state management
3. **Styling issues**: Check CSS variable definitions
4. **Mobile responsiveness**: Test on various screen sizes

### Debug Tips
- Use browser dev tools to inspect component state
- Check network tab for API calls
- Verify database schema matches expectations
- Test folder hierarchy with multiple levels

## Future Enhancements

1. **Folder Renaming**: Implement inline editing
2. **Drag & Drop**: Move folders between levels
3. **Search**: Find folders by name
4. **Sorting**: Sort by name, date, size
5. **Sharing**: Share folders with other users
6. **Favorites**: Mark important folders
7. **Tags**: Add metadata to folders 