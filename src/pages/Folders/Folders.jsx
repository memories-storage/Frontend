import React, { useState } from 'react';
import FolderExplorer from '../../components/common/FolderExplorer';
import './Folders.css';

const Folders = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Handle folder selection
  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    console.log('Selected folder:', folder);
    // You can add additional logic here, such as:
    // - Opening a modal with folder details
    // - Navigating to a folder-specific view
    // - Updating URL parameters
  };

  // Handle file selection (if needed)
  const handleFileSelect = (file) => {
    console.log('Selected file:', file);
    // Handle file selection logic
  };

  return (
    <div className="folders-page">
      <div className="folders-header">
        <div className="folders-title">
          <h1>Folders</h1>
          <p>Organize your files with hierarchical folders</p>
        </div>
      </div>

      <div className="folders-content">
        <FolderExplorer
          onFolderSelect={handleFolderSelect}
          onFileSelect={handleFileSelect}
          showCreateButton={true}
          showActions={true}
        />
      </div>

      {/* Optional: Show selected folder info */}
      {selectedFolder && (
        <div className="selected-folder-info">
          <h3>Selected Folder: {selectedFolder.name}</h3>
          <p>ID: {selectedFolder.id}</p>
          <p>Created: {new Date(selectedFolder.created_at).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default Folders; 