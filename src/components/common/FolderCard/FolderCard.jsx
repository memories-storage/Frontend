import React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './FolderCard.css';

const FolderCard = ({ 
  folder, 
  onClick, 
  onDelete, 
  onRename,
  isSelected = false,
  onSelect,
  showActions = true 
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(folder);
    }
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(folder.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(folder.id);
    }
  };

  const handleRename = (e) => {
    e.stopPropagation();
    if (onRename) {
      onRename(folder);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`folder-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="folder-card-header">
        <div className="folder-card-icon">
          <FolderIcon className="folder-icon" />
        </div>
        
        {onSelect && (
          <div className="folder-card-select" onClick={handleSelect}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}} // Controlled by parent
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        {showActions && (
          <div className="folder-card-actions">
            <button 
              className="action-button"
              onClick={handleRename}
              title="Rename folder"
            >
              <MoreVertIcon />
            </button>
          </div>
        )}
      </div>
      
      <div className="folder-card-content">
        <h3 className="folder-name" title={folder.name}>
          {folder.name}
        </h3>
        <p className="folder-date">
          Created: {formatDate(folder.created_at)}
        </p>
      </div>
      
      {showActions && onDelete && (
        <div className="folder-card-overlay">
          <button 
            className="delete-button"
            onClick={handleDelete}
            title="Delete folder"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderCard; 