import React from 'react';
import FolderCard from '../FolderCard';
import './FolderGrid.css';

const FolderGrid = ({ 
  folders = [], 
  onFolderClick, 
  onFolderDelete, 
  onFolderRename,
  selectedFolders = new Set(),
  onFolderSelect,
  showActions = true,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="folder-grid-container">
        <div className="folder-grid-loading">
          <div className="loading-spinner"></div>
          <p>Loading folders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="folder-grid-container">
        <div className="folder-grid-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="folder-grid-container">
        <div className="folder-grid-empty">
          <p>No folders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-grid-container">
      <div className="folder-grid">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={onFolderClick}
            onDelete={onFolderDelete}
            onRename={onFolderRename}
            isSelected={selectedFolders.has(folder.id)}
            onSelect={onFolderSelect}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderGrid; 