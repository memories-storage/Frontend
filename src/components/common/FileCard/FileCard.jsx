import React from 'react';
import './FileCard.css';

const FileCard = ({ 
  file, 
  onClick, 
  isSelected = false, 
  showSelection = false,
  onSelectionToggle = null,
  showFavorite = false,
  onFavoriteToggle = null
}) => {
  const isVideoFile = (url) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const getFileType = (url, type) => {
    if (type === 'folder') return 'folder';
    if (isVideoFile(url)) return 'video';
    if (isImageFile(url)) return 'image';
    return 'file';
  };

  const handleClick = (e) => {
    if (showSelection && onSelectionToggle) {
      e.stopPropagation();
      onSelectionToggle(file.id);
    } else if (onClick) {
      onClick(file);
    }
  };

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(file.id);
    }
  };

  const fileType = getFileType(file.url, file.type);

  return (
    <div 
      className={`file-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {showSelection && (
        <div className="selection-overlay">
          {isSelected ? (
            <div className="selection-checkbox selected">✓</div>
          ) : (
            <div className="selection-checkbox">○</div>
          )}
        </div>
      )}
      
      <div className="file-preview">
        {fileType === 'folder' ? (
          <div className="folder-icon">📁</div>
        ) : fileType === 'image' ? (
          <img src={file.url} alt="File preview" />
        ) : fileType === 'video' ? (
          <video src={file.url} muted />
        ) : (
          <div className="file-icon">📄</div>
        )}
        <div className="file-overlay">
          <span className="view-text">Click to view</span>
        </div>
      </div>
      
      <div className="file-info">
        <p className="file-name">
          {fileType === 'folder' ? file.name : file.url.split('/').pop()}
        </p>
        <span className="file-type">{fileType}</span>
        {showFavorite && (
          <button 
            className={`favorite-button ${file.isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
          >
            {file.isFavorite ? '★' : '☆'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FileCard; 