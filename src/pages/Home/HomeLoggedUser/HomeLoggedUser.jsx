import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../../components/common/Button';
import FileGrid from '../../../components/common/FileGrid';
import FileModal from '../../../components/common/FileModal';
import TabNavigation from '../../../components/common/TabNavigation';
import { useAuth } from '../../../context/AuthContext';
import { useUserId } from '../../../hooks/useUserId';
import { selectUserProfile } from '../../../store/slices/userSlice';
import { apiService } from '../../../services/api';
import { ENDPOINTS } from '../../../utils/constants/api';
import { getFileType, isImageFile, isVideoFile } from '../../../utils/fileUtils';
import './HomeLoggedUser.css';

const HomeLoggedUser = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUserId = useUserId();
  const profile = useSelector(selectUserProfile);

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(ENDPOINTS.GET_IMAGES);
      const filesWithDate = (response || []).map(file => ({
        ...file,
        uploadDate: new Date(),
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
    if (profile?.firstName) return profile.firstName;
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
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

  // Tab configuration
  const tabs = [
    { key: 'all', label: 'All Files', count: files.length },
    { key: 'photos', label: 'Photos', count: files.filter(f => isImageFile(f.url)).length },
    { key: 'videos', label: 'Videos', count: files.filter(f => isVideoFile(f.url)).length }
  ];

  // Empty state action
  const emptyStateAction = (
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
  );

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
              onClick={() => navigate(`/upload/id=${currentUserId}`)}
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
          
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
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

        <FileGrid
          files={filteredFiles}
          onFileClick={handleFileClick}
          emptyStateMessage={`No ${activeTab === 'photos' ? 'photos' : activeTab === 'videos' ? 'videos' : 'files'} yet`}
          emptyStateAction={emptyStateAction}
        />
      </div>

      {/* File Modal */}
      <FileModal
        file={selectedFile}
        isOpen={showModal}
        onClose={closeModal}
        onDelete={handleDeleteFile}
      />
    </div>
  );
};

export default HomeLoggedUser; 