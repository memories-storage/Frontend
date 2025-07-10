import React, { useState } from 'react';
import FolderExplorer from '../../components/common/FolderExplorer';
import './FolderExample.css';

const FolderExample = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    
    // Add to history
    setFolderHistory(prev => {
      const newHistory = [...prev, {
        id: folder.id,
        name: folder.name,
        timestamp: new Date().toISOString()
      }];
      // Keep only last 10 entries
      return newHistory.slice(-10);
    });
  };

  const handleFileSelect = (file) => {
    console.log('File selected:', file);
    // Handle file selection
  };

  return (
    <div className="folder-example">
      <div className="folder-example-header">
        <h1>Folder System Example</h1>
        <p>This demonstrates the hierarchical folder system with individual components</p>
      </div>

      <div className="folder-example-content">
        <div className="folder-explorer-section">
          <h2>Folder Explorer</h2>
          <div className="explorer-container">
            <FolderExplorer
              onFolderSelect={handleFolderSelect}
              onFileSelect={handleFileSelect}
              showCreateButton={true}
              showActions={true}
            />
          </div>
        </div>

        <div className="folder-info-section">
          <h2>Selected Folder Info</h2>
          {selectedFolder ? (
            <div className="folder-info">
              <h3>{selectedFolder.name}</h3>
              <p><strong>ID:</strong> {selectedFolder.id}</p>
              <p><strong>Parent ID:</strong> {selectedFolder.parent_id || 'Root'}</p>
              <p><strong>Created:</strong> {new Date(selectedFolder.created_at).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(selectedFolder.updated_at).toLocaleString()}</p>
            </div>
          ) : (
            <p className="no-selection">No folder selected</p>
          )}
        </div>

        <div className="folder-history-section">
          <h2>Folder History</h2>
          {folderHistory.length > 0 ? (
            <div className="folder-history">
              {folderHistory.map((entry, index) => (
                <div key={index} className="history-entry">
                  <span className="history-name">{entry.name}</span>
                  <span className="history-time">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-history">No folder history yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderExample; 