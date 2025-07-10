import React from 'react';
import FileCard from '../FileCard';
import './FileGrid.css';

const FileGrid = ({ 
  files, 
  onFileClick, 
  selectedFiles = new Set(),
  showSelection = false,
  onSelectionToggle = null,
  showFavorite = false,
  onFavoriteToggle = null,
  emptyStateMessage = "No files found",
  emptyStateAction = null
}) => {
  // Group files by upload date
  const groupFilesByDate = (files) => {
    const grouped = {};
    files.forEach(file => {
      const date = file.uploadDateString;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(file);
    });
    return grouped;
  };

  const groupedFiles = groupFilesByDate(files);
  const sortedDates = Object.keys(groupedFiles).sort((a, b) => new Date(b) - new Date(a));

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <h3>{emptyStateMessage}</h3>
        {emptyStateAction && emptyStateAction}
      </div>
    );
  }

  return (
    <div className="file-grid-container">
      {sortedDates.map((date) => (
        <div key={date} className="date-section">
          <h3 className="date-header">{date}</h3>
          <div className="files-grid">
            {groupedFiles[date].map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onClick={onFileClick}
                isSelected={selectedFiles.has(file.id)}
                showSelection={showSelection}
                onSelectionToggle={onSelectionToggle}
                showFavorite={showFavorite}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid; 