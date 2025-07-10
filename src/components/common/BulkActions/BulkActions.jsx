import React from 'react';
import Button from '../Button';
import './BulkActions.css';

const BulkActions = ({ 
  selectedCount, 
  onSelectAll, 
  onClearSelection, 
  onBulkDelete, 
  onBulkFavorite, 
  onBulkUnfavorite,
  isAllSelected,
  isPartiallySelected,
  showFavorite = false
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-actions">
      <div className="bulk-info">
        <span className="selected-count">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="selection-controls">
          {isPartiallySelected && (
            <Button 
              variant="outline" 
              size="small"
              onClick={onSelectAll}
            >
              Select All
            </Button>
          )}
          <Button 
            variant="outline" 
            size="small"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>
      </div>
      
      <div className="bulk-buttons">
        {showFavorite && (
          <>
            <Button 
              variant="outline" 
              size="small"
              onClick={onBulkFavorite}
            >
              ⭐ Add to Favorites
            </Button>
            <Button 
              variant="outline" 
              size="small"
              onClick={onBulkUnfavorite}
            >
              ☆ Remove from Favorites
            </Button>
          </>
        )}
        <Button 
          variant="contained" 
          color="error"
          size="small"
          onClick={onBulkDelete}
        >
          🗑️ Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActions; 