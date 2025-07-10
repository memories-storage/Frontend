import React, { useState, useEffect, useCallback } from 'react';
import Breadcrumb from '../Breadcrumb';
import FolderGrid from '../FolderGrid';
import CreateFolderModal from '../CreateFolderModal';
import Button from '../Button';
import { apiService } from '../../../services/api';
import { ENDPOINTS } from '../../../utils/constants/api';
import './FolderExplorer.css';

const FolderExplorer = ({ 
  onFolderSelect,
  onFileSelect,
  showCreateButton = true,
  showActions = true,
  className = ''
}) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState(new Set());

  // Initialize breadcrumbs with root
  useEffect(() => {
    setBreadcrumbs([{ id: null, name: 'Home' }]);
  }, []);

  // Fetch folders for current directory
  const fetchFolders = useCallback(async (parentId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = parentId 
        ? `${ENDPOINTS.GET_FOLDERS}?parent_id=${parentId}`
        : ENDPOINTS.GET_FOLDERS;
      
      const response = await apiService.get(url);
      setFolders(response || []);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Failed to load folders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load folders when component mounts or currentFolderId changes
  useEffect(() => {
    fetchFolders(currentFolderId);
  }, [currentFolderId, fetchFolders]);

  // Handle folder click - navigate into folder
  const handleFolderClick = useCallback((folder) => {
    const newBreadcrumbs = [...breadcrumbs, { id: folder.id, name: folder.name }];
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(folder.id);
    setSelectedFolders(new Set()); // Clear selection when navigating
    
    if (onFolderSelect) {
      onFolderSelect(folder);
    }
  }, [breadcrumbs, onFolderSelect]);

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback((index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    
    const targetFolder = newBreadcrumbs[newBreadcrumbs.length - 1];
    setCurrentFolderId(targetFolder.id);
    setSelectedFolders(new Set()); // Clear selection when navigating
  }, [breadcrumbs]);

  // Handle folder creation
  const handleCreateFolder = useCallback(async (folderName) => {
    try {
      setCreatingFolder(true);
      setError(null);
      
      const folderData = {
        name: folderName.trim(),
        parent_id: currentFolderId || undefined
      };

      const response = await apiService.post(ENDPOINTS.CREATE_FOLDER, folderData);
      
      // Add the new folder to the current list
      const newFolder = {
        ...response,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setFolders(prevFolders => [newFolder, ...prevFolders]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder. Please try again.');
    } finally {
      setCreatingFolder(false);
    }
  }, [currentFolderId]);

  // Handle folder deletion
  const handleDeleteFolder = useCallback(async (folderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this folder? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await apiService.delete(ENDPOINTS.DELETE_FOLDER(folderId));
      
      // Remove folder from list
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
      
      // If we're in the deleted folder, navigate to parent
      if (currentFolderId === folderId) {
        const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
        if (parentBreadcrumb) {
          handleBreadcrumbNavigate(breadcrumbs.length - 2);
        }
      }
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder. Please try again.');
    }
  }, [currentFolderId, breadcrumbs, handleBreadcrumbNavigate]);

  // Handle folder selection for bulk actions
  const handleFolderSelect = useCallback((folderId) => {
    setSelectedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Handle bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedFolders.size === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedFolders.size} folder(s)? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const deletePromises = Array.from(selectedFolders).map(folderId =>
        apiService.delete(ENDPOINTS.DELETE_FOLDER(folderId))
      );
      
      await Promise.all(deletePromises);
      
      // Remove deleted folders from list
      setFolders(prevFolders => 
        prevFolders.filter(folder => !selectedFolders.has(folder.id))
      );
      
      setSelectedFolders(new Set());
    } catch (err) {
      console.error('Error deleting folders:', err);
      setError('Failed to delete some folders. Please try again.');
    }
  }, [selectedFolders]);

  return (
    <div className={`folder-explorer ${className}`}>
      {/* Header with breadcrumb and actions */}
      <div className="folder-explorer-header">
        <Breadcrumb 
          breadcrumbs={breadcrumbs} 
          onNavigate={handleBreadcrumbNavigate} 
        />
        
        <div className="folder-explorer-actions">
          {showCreateButton && (
            <Button
              variant="primary"
              size="small"
              onClick={() => setShowCreateModal(true)}
            >
              New Folder
            </Button>
          )}
          
          {selectedFolders.size > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedFolders.size})
            </Button>
          )}
        </div>
      </div>

      {/* Folder grid */}
      <FolderGrid
        folders={folders}
        onFolderClick={handleFolderClick}
        onFolderDelete={showActions ? handleDeleteFolder : undefined}
        selectedFolders={selectedFolders}
        onFolderSelect={handleFolderSelect}
        showActions={showActions}
        loading={loading}
        error={error}
      />

      {/* Create folder modal */}
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateFolder}
        loading={creatingFolder}
        error={error}
      />
    </div>
  );
};

export default FolderExplorer; 