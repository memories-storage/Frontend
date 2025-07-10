import React, { useState } from 'react';
import Button from '../Button';
import './CreateFolderModal.css';

const CreateFolderModal = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  loading = false,
  error = null 
}) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
    }
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Folder</h3>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="folderName">Folder Name</label>
            <input
              type="text"
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </form>
        
        <div className="modal-footer">
          <Button 
            variant="outline" 
            size="medium"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="medium"
            onClick={handleSubmit}
            disabled={loading || !folderName.trim()}
          >
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal; 