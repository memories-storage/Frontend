import React from 'react';
import Button from '../Button';
import './FileModal.css';

const FileModal = ({ 
  file, 
  isOpen, 
  onClose, 
  onDelete = null,
  showDelete = true 
}) => {
  if (!isOpen || !file) return null;

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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(file.id);
    }
  };

  const truncateFileName = (name, maxLength = 30) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension ? '.' + extension : ''}`;
  };

  const fileType = getFileType(file.url, file.type);
  const fileName = fileType === 'folder' ? file.name : file.url.split('/').pop();
  const displayName = truncateFileName(fileName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 title={fileName}>{displayName}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {fileType === 'folder' ? (
            <div className="folder-preview">
              <div className="folder-icon-large">📁</div>
              <p>Folder: {file.name}</p>
            </div>
          ) : fileType === 'image' ? (
            <img src={file.url} alt="Full preview" />
          ) : fileType === 'video' ? (
            <video src={file.url} controls autoPlay />
          ) : (
            <div className="file-preview-fallback">
              <div className="file-icon-large">📄</div>
              <p>File preview not available</p>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <Button 
            variant="outline" 
            size="medium"
            onClick={() => window.open(file.url, '_blank')}
          >
            Open in New Tab
          </Button>
          {showDelete && onDelete && (
            <Button 
              variant="contained" 
              color="error"
              size="medium"
              onClick={handleDelete}
            >
              Delete {fileType === 'folder' ? 'Folder' : 'File'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileModal; 