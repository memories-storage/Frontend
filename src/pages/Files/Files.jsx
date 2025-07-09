import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { selectUserProfile } from '../../store/slices/userSlice';
import { apiService } from '../../services/api';
import { ENDPOINTS } from '../../utils/constants/api';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'all', 'photos', 'videos', 'folders'
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set()); // Multi-select state
  const [isSelectionMode, setIsSelectionMode] = useState(false); // Selection mode toggle
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const profile = useSelector(selectUserProfile);

  useEffect(() => {
    fetchUserFiles();
  }, []);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['favorites', 'all', 'photos', 'videos', 'folders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      
      // Fetch both images and folders
      const [imagesResponse, foldersResponse] = await Promise.all([
        apiService.get(ENDPOINTS.GET_IMAGES),
        apiService.get(ENDPOINTS.GET_FOLDERS)
      ]);
      
      // Process images
      const imagesWithMetadata = (imagesResponse || []).map(file => ({
        ...file,
        uploadDate: new Date(),
        uploadDateString: new Date().toLocaleDateString(),
        isFavorite: false, // This should come from backend in real implementation
        type: 'file'
      }));
      
      // Process folders
      const foldersWithMetadata = (foldersResponse || []).map(folder => ({
        ...folder,
        id: folder.id,
        name: folder.name,
        url: null,
        uploadDate: new Date(folder.created_at),
        uploadDateString: new Date(folder.created_at).toLocaleDateString(),
        isFavorite: false,
        type: 'folder'
      }));
      
      // Combine and sort by date
      const allFiles = [...foldersWithMetadata, ...imagesWithMetadata];
      allFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      
      setFiles(allFiles);
      setError(null);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load your files. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleFileClick = (file) => {
    if (isSelectionMode) {
      // In selection mode, toggle file selection instead of opening modal
      toggleFileSelection(file.id);
    } else {
      // Normal mode - open file preview
      setSelectedFile(file);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (file?.type === 'folder') {
        await apiService.delete(ENDPOINTS.DELETE_FOLDER(fileId));
      } else {
        await apiService.delete(ENDPOINTS.DELETE_IMAGE(fileId));
      }
      setFiles(files.filter(file => file.id !== fileId));
      closeModal();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Please enter a folder name.');
      return;
    }

    try {
      setCreatingFolder(true);
      setError(null);
      
      const folderData = {
        name: newFolderName.trim()
      };

      // Send folder creation request to backend
      const response = await apiService.post(ENDPOINTS.CREATE_FOLDER, folderData);
      
      // Add the new folder to the files list
      const newFolder = {
        id: response.id,
        name: response.name,
        type: 'folder',
        url: null,
        uploadDate: new Date(),
        uploadDateString: new Date().toLocaleDateString(),
        isFavorite: false
      };

      setFiles(prevFiles => [newFolder, ...prevFiles]);
      setNewFolderName('');
      setShowCreateFolder(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder. Please try again.');
    } finally {
      setCreatingFolder(false);
    }
  };

  const openCreateFolder = () => {
    setShowCreateFolder(true);
    setNewFolderName('');
    setError(null);
  };

  const closeCreateFolder = () => {
    setShowCreateFolder(false);
    setNewFolderName('');
    setError(null);
  };

  const toggleFavorite = (fileId) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, isFavorite: !file.isFavorite }
          : file
      )
    );
  };

  // Multi-select functions
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Exit selection mode - clear selections
      setSelectedFiles(new Set());
    }
  };

  const toggleFileSelection = (fileId) => {
    const newSelectedFiles = new Set(selectedFiles);
    if (newSelectedFiles.has(fileId)) {
      newSelectedFiles.delete(fileId);
    } else {
      newSelectedFiles.add(fileId);
    }
    setSelectedFiles(newSelectedFiles);
  };

  const selectAllFiles = () => {
    const filteredFiles = getFilteredFiles();
    const allFileIds = filteredFiles.map(file => file.id);
    setSelectedFiles(new Set(allFileIds));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  const isAllSelected = () => {
    const filteredFiles = getFilteredFiles();
    return filteredFiles.length > 0 && selectedFiles.size === filteredFiles.length;
  };

  const isPartiallySelected = () => {
    const filteredFiles = getFilteredFiles();
    return selectedFiles.size > 0 && selectedFiles.size < filteredFiles.length;
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedFiles.size} item(s)?`);
    if (!confirmed) return;

    try {
      const selectedItems = Array.from(selectedFiles);
      const deletePromises = selectedItems.map(fileId => {
        const file = files.find(f => f.id === fileId);
        if (file?.type === 'folder') {
          return apiService.delete(ENDPOINTS.DELETE_FOLDER(fileId));
        } else {
          return apiService.delete(ENDPOINTS.DELETE_IMAGE(fileId));
        }
      });
      
      await Promise.all(deletePromises);
      
      // Remove deleted items from state
      setFiles(prevFiles => prevFiles.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
      setIsSelectionMode(false);
    } catch (err) {
      console.error('Error deleting items:', err);
      setError('Failed to delete some items. Please try again.');
    }
  };

  const handleBulkFavorite = () => {
    if (selectedFiles.size === 0) return;

    setFiles(prevFiles => 
      prevFiles.map(file => 
        selectedFiles.has(file.id) 
          ? { ...file, isFavorite: true }
          : file
      )
    );
    setSelectedFiles(new Set());
    setIsSelectionMode(false);
  };

  const handleBulkUnfavorite = () => {
    if (selectedFiles.size === 0) return;

    setFiles(prevFiles => 
      prevFiles.map(file => 
        selectedFiles.has(file.id) 
          ? { ...file, isFavorite: false }
          : file
      )
    );
    setSelectedFiles(new Set());
    setIsSelectionMode(false);
  };



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

  // Filter files based on active tab
  const getFilteredFiles = () => {
    let filtered = files;
    
    if (activeTab === 'favorites') {
      filtered = files.filter(file => file.isFavorite);
    } else if (activeTab === 'photos') {
      filtered = files.filter(file => getFileType(file.url, file.type) === 'image');
    } else if (activeTab === 'videos') {
      filtered = files.filter(file => getFileType(file.url, file.type) === 'video');
    } else if (activeTab === 'folders') {
      filtered = files.filter(file => file.type === 'folder');
    }
    // 'all' shows all files
    
    return filtered;
  };

  const filteredFiles = getFilteredFiles();
  const groupedFiles = groupFilesByDate(filteredFiles);
  const sortedDates = Object.keys(groupedFiles).sort((a, b) => new Date(b) - new Date(a));

  if (loading) {
    return (
      <div className="files-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="files-page">
      {/* Header */}
      <div className="files-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📁 Files</h1>
            <p>Manage and organize your files</p>
          </div>
          <div className="header-actions">
            <Button 
              variant="outline" 
              size="medium"
              onClick={() => navigate('/upload')}
            >
              📤 Upload Files
            </Button>
            <Button 
              variant="primary" 
              size="medium"
              onClick={openCreateFolder}
            >
              📁 Create Folder
            </Button>
          </div>
        </div>
      </div>

      {/* Selection Mode Controls */}
      {isSelectionMode && (
        <div className="selection-controls">
          <div className="selection-info">
            <span className="selection-count">
              {selectedFiles.size} file(s) selected
            </span>
          </div>
          <div className="selection-actions">
            <Button 
              variant="outline" 
              size="small"
              onClick={clearSelection}
            >
              Clear Selection
            </Button>
            <Button 
              variant="outline" 
              size="small"
              onClick={handleBulkFavorite}
            >
              ⭐ Mark as Favorite
            </Button>
            <Button 
              variant="outline" 
              size="small"
              onClick={handleBulkUnfavorite}
            >
              ☆ Remove from Favorites
            </Button>
            <Button 
              variant="contained" 
              color="error"
              size="small"
              onClick={handleBulkDelete}
            >
              🗑️ Delete Selected
            </Button>
            <Button 
              variant="outline" 
              size="small"
              onClick={toggleSelectionMode}
            >
              ✕ Exit Selection
            </Button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="files-tabs">
        <button 
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('favorites');
            navigate('/files?tab=favorites');
          }}
        >
          ⭐ Favorites ({files.filter(f => f.isFavorite).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('all');
            navigate('/files?tab=all');
          }}
        >
          📄 All Files ({files.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('photos');
            navigate('/files?tab=photos');
          }}
        >
          📸 Photos ({files.filter(f => isImageFile(f.url)).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('videos');
            navigate('/files?tab=videos');
          }}
        >
          🎥 Videos ({files.filter(f => isVideoFile(f.url)).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'folders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('folders');
            navigate('/files?tab=folders');
          }}
        >
          📁 Folders ({files.filter(f => f.type === 'folder').length})
        </button>
        
        {/* Selection Mode Toggle */}
        <div className="selection-toggle">
          <Button 
            variant={isSelectionMode ? "primary" : "outline"}
            size="small"
            onClick={toggleSelectionMode}
            className="selection-mode-btn"
          >
            {isSelectionMode ? '✕ Exit Selection' : '☑️ Select Files'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="small"
            onClick={fetchUserFiles}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Files Content */}
      <div className="files-content">
        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'favorites' ? '⭐' : 
               activeTab === 'photos' ? '📸' : 
               activeTab === 'videos' ? '🎥' : 
               activeTab === 'folders' ? '📁' : '📄'}
            </div>
            <h3>
              No {activeTab === 'favorites' ? 'favorites' : 
                   activeTab === 'photos' ? 'photos' : 
                   activeTab === 'videos' ? 'videos' : 
                   activeTab === 'folders' ? 'folders' : 'files'} yet
            </h3>
            <p>
              {activeTab === 'favorites' ? 'Mark files as favorites to see them here' :
               activeTab === 'folders' ? 'Create your first folder to organize files' :
               `Start by uploading your first ${activeTab === 'photos' ? 'photo' : activeTab === 'videos' ? 'video' : 'file'}`}
            </p>
            {activeTab !== 'favorites' && (
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => navigate('/upload')}
              >
                Upload Files
              </Button>
            )}
          </div>
        ) : (
          <div className="files-container">
            {/* Select All Button */}
            {isSelectionMode && filteredFiles.length > 0 && (
              <div className="select-all-section">
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={isAllSelected() ? clearSelection : selectAllFiles}
                  className="select-all-btn"
                >
                  {isAllSelected() ? '☐ Deselect All' : 
                   isPartiallySelected() ? '☑ Select All' : '☐ Select All'}
                </Button>
                {isPartiallySelected() && (
                  <span className="partial-selection">
                    {selectedFiles.size} of {filteredFiles.length} selected
                  </span>
                )}
              </div>
            )}

            {sortedDates.map((date) => (
              <div key={date} className="date-section">
                <h3 className="date-header">{date}</h3>
                <div className="files-grid">
                  {groupedFiles[date].map((file) => (
                    <div 
                      key={file.id} 
                      className={`file-card ${selectedFiles.has(file.id) ? 'selected' : ''} ${isSelectionMode ? 'selection-mode' : ''}`}
                      onClick={() => handleFileClick(file)}
                    >
                      {/* Selection Checkbox */}
                      {isSelectionMode && (
                        <div className="selection-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleFileSelection(file.id);
                            }}
                            className="file-checkbox"
                          />
                        </div>
                      )}

                      <div className="file-preview">
                        {getFileType(file.url, file.type) === 'folder' ? (
                          <div className="folder-icon">📁</div>
                        ) : getFileType(file.url, file.type) === 'image' ? (
                          <img src={file.url} alt="File preview" />
                        ) : getFileType(file.url, file.type) === 'video' ? (
                          <video src={file.url} muted />
                        ) : (
                          <div className="file-icon">📄</div>
                        )}
                        <div className="file-overlay">
                          <span className="view-text">
                            {isSelectionMode ? 'Click to select' : 
                             getFileType(file.url, file.type) === 'folder' ? 'Click to open' : 'Click to view'}
                          </span>
                        </div>
                        <button 
                          className={`favorite-button ${file.isFavorite ? 'favorited' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(file.id);
                          }}
                          title={file.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {file.isFavorite ? '⭐' : '☆'}
                        </button>
                      </div>
                      <div className="file-info">
                        <p className="file-name">
                          {getFileType(file.url, file.type) === 'folder' ? file.name : file.url.split('/').pop()}
                        </p>
                        <span className="file-type">{getFileType(file.url, file.type)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {showModal && selectedFile && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {getFileType(selectedFile.url, selectedFile.type) === 'folder' 
                  ? selectedFile.name 
                  : selectedFile.url.split('/').pop()}
              </h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {getFileType(selectedFile.url, selectedFile.type) === 'image' ? (
                <img src={selectedFile.url} alt="Full preview" />
              ) : getFileType(selectedFile.url, selectedFile.type) === 'video' ? (
                <video src={selectedFile.url} controls autoPlay />
              ) : getFileType(selectedFile.url, selectedFile.type) === 'folder' ? (
                <div className="folder-preview">
                  <div className="folder-icon-large">📁</div>
                  <p>Folder: {selectedFile.name}</p>
                  <p>Created: {selectedFile.uploadDateString}</p>
                </div>
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
                onClick={() => window.open(selectedFile.url, '_blank')}
                disabled={getFileType(selectedFile.url, selectedFile.type) === 'folder'}
              >
                Open in New Tab
              </Button>
              <Button 
                variant="outline" 
                size="medium"
                onClick={() => toggleFavorite(selectedFile.id)}
              >
                {selectedFile.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button 
                variant="contained" 
                color="error"
                size="medium"
                onClick={() => handleDeleteFile(selectedFile.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="modal-overlay" onClick={closeCreateFolder}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Folder</h3>
              <button className="close-button" onClick={closeCreateFolder}>×</button>
            </div>
            <div className="modal-body">
              <div className="folder-form">
                <label htmlFor="folder-name">Folder Name:</label>
                <input
                  type="text"
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="folder-input"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder();
                    }
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button 
                variant="outline" 
                size="medium"
                onClick={closeCreateFolder}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="medium"
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName.trim()}
              >
                {creatingFolder ? 'Creating...' : 'Create Folder'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files; 