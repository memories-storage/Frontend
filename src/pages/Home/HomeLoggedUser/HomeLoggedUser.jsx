import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';
import { selectUserProfile } from '../../../store/slices/userSlice';
import { apiService } from '../../../services/api';
import { ENDPOINTS } from '../../../utils/constants/api';
import './HomeLoggedUser.css';

const HomeLoggedUser = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'photos', 'videos'
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profile = useSelector(selectUserProfile);

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(ENDPOINTS.GET_IMAGES);
      // Add upload date to files (using current date as fallback since backend doesn't provide it)
      const filesWithDate = (response || []).map(file => ({
        ...file,
        uploadDate: new Date(), // This should come from backend in real implementation
        uploadDateString: new Date().toLocaleDateString()
      }));
      setFiles(filesWithDate);
      setError(null);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load your files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await apiService.delete(ENDPOINTS.DELETE_IMAGE(fileId));
      setFiles(files.filter(file => file.id !== fileId));
      closeModal();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    }
  };

  const getDisplayName = () => {
    if (profile?.firstName) {
      return profile.firstName;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const isVideoFile = (url) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const getFileType = (url) => {
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
    
    if (activeTab === 'photos') {
      filtered = files.filter(file => getFileType(file.url) === 'image');
    } else if (activeTab === 'videos') {
      filtered = files.filter(file => getFileType(file.url) === 'video');
    }
    
    return filtered;
  };

  const filteredFiles = getFilteredFiles();
  const groupedFiles = groupFilesByDate(filteredFiles);
  const sortedDates = Object.keys(groupedFiles).sort((a, b) => new Date(b) - new Date(a));

  if (loading) {
    return (
      <div className="home-logged-user">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-logged-user">
      {/* Header */}
      <div className="user-header">
        <div className="user-info">
          <div className="welcome-section">
            <h2>Welcome back, {getDisplayName()}! 👋</h2>
            <p>Manage and view your uploaded files</p>
          </div>
          <div className="user-actions">
            <Button 
              variant="outline" 
              size="medium"
              onClick={() => navigate('/upload')}
            >
              Upload Files
            </Button>
            <Button 
              variant="outline" 
              size="medium"
              onClick={() => navigate('/files')}
            >
              📁 All Files
            </Button>
            <Button 
              variant="outline" 
              size="medium"
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="medium"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>Recent Files</h1>
          
          {/* Tab Navigation */}
          <div className="file-tabs">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Files ({files.length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos ({files.filter(f => isImageFile(f.url)).length})
            </button>
            <button 
              className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos ({files.filter(f => isVideoFile(f.url)).length})
            </button>
          </div>
          
          {/* View All Files Button */}
          <div className="file-actions">
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => navigate('/files')}
            >
              📁 View All Files
            </Button>
          </div>
        </div>

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

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No {activeTab === 'photos' ? 'photos' : activeTab === 'videos' ? 'videos' : 'files'} yet</h3>
            <p>Start by uploading your first {activeTab === 'photos' ? 'photo' : activeTab === 'videos' ? 'video' : 'file'}</p>
            <div className="empty-actions">
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => navigate('/upload')}
              >
                Upload Your First {activeTab === 'photos' ? 'Photo' : activeTab === 'videos' ? 'Video' : 'File'}
              </Button>
              <Button 
                variant="outline" 
                size="medium"
                onClick={() => navigate('/files')}
              >
                📁 Go to Files
              </Button>
            </div>
          </div>
        ) : (
          <div className="files-container">
            {sortedDates.map((date) => (
              <div key={date} className="date-section">
                <h3 className="date-header">{date}</h3>
                <div className="files-grid">
                  {groupedFiles[date].map((file) => (
                    <div 
                      key={file.id} 
                      className="file-card"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="file-preview">
                        {getFileType(file.url) === 'image' ? (
                          <img src={file.url} alt="File preview" />
                        ) : getFileType(file.url) === 'video' ? (
                          <video src={file.url} muted />
                        ) : (
                          <div className="file-icon">📄</div>
                        )}
                        <div className="file-overlay">
                          <span className="view-text">Click to view</span>
                        </div>
                      </div>
                      <div className="file-info">
                        <p className="file-name">{file.url.split('/').pop()}</p>
                        <span className="file-type">{getFileType(file.url)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for file preview */}
      {showModal && selectedFile && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedFile.url.split('/').pop()}</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {getFileType(selectedFile.url) === 'image' ? (
                <img src={selectedFile.url} alt="Full preview" />
              ) : getFileType(selectedFile.url) === 'video' ? (
                <video src={selectedFile.url} controls autoPlay />
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
              >
                Open in New Tab
              </Button>
              <Button 
                variant="contained" 
                color="error"
                size="medium"
                onClick={() => handleDeleteFile(selectedFile.id)}
              >
                Delete File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLoggedUser; 