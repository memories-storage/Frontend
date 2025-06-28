import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUserProfile } from '../../hooks/useDataFetching.js';
import { 
  selectIsAuthenticated,
  logoutUser,
  clearAuthData       
} from '../../store/slices/authSlice.js';
import { 
  updateUserProfile,
  changePassword
} from '../../store/slices/userSlice.js';
import './UserDashboard.css';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Use custom hooks for data fetching with caching
  const { profile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Clear all cached data on logout
      dispatch(clearAuthData());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRefreshData = () => {
    // Force refresh profile data
    refetchProfile();
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditForm({
        name: profile?.name || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(!isEditing);
    setShowPasswordForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      
      // Validate form
      if (!editForm.name.trim()) {
        alert('Name is required');
        return;
      }

      if (showPasswordForm) {
        if (!editForm.currentPassword || !editForm.newPassword || !editForm.confirmPassword) {
          alert('All password fields are required');
          return;
        }
        if (editForm.newPassword !== editForm.confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        if (editForm.newPassword.length < 6) {
          alert('New password must be at least 6 characters');
          return;
        }
      }

      // Update profile name
      if (editForm.name !== profile?.name) {
        await dispatch(updateUserProfile({
          name: editForm.name
        })).unwrap();
      }

      // Change password if requested
      if (showPasswordForm) {
        await dispatch(changePassword({
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword
        })).unwrap();
      }

      alert('Profile updated successfully!');
      setIsEditing(false);
      setShowPasswordForm(false);
      refetchProfile(); // Refresh data
    } catch (error) {
      alert('Failed to update profile: ' + (error.message || error));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
    setEditForm({
      name: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-container">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>User Profile</h1>
          <div className="dashboard-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleRefreshData}
              disabled={profileLoading}
            >
              {profileLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Profile Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              {!isEditing && (
                <button 
                  className="btn btn-primary"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {profileLoading ? (
              <div className="loading">Loading profile...</div>
            ) : profileError ? (
              <div className="error">
                Error loading profile: {profileError}
                <button onClick={refetchProfile}>Retry</button>
              </div>
            ) : profile ? (
              <div className="profile-container">
                {/* Profile Photo/QR Code Section */}
                <div className="profile-photo-section">
                  <div className="profile-photo">
                    {profile.qrCodeUrl ? (
                      <img src={profile.qrCodeUrl} alt="Profile QR Code" />
                    ) : (
                      <div className="qr-placeholder">
                        <div className="qr-icon">📱</div>
                        <p>QR Code</p>
                        <small>Will be fetched from backend</small>
                      </div>
                    )}
                  </div>
                  <div className="photo-info">
                    <h4>Profile QR Code</h4>
                    <p>Scan this QR code to view your profile</p>
                    {profile.profileLink && (
                      <div className="profile-link">
                        <small>Profile Link:</small>
                        <a href={profile.profileLink} target="_blank" rel="noopener noreferrer">
                          {profile.profileLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profile.email || ''}
                          disabled
                          className="form-input disabled"
                        />
                        <small className="form-help">Email cannot be changed</small>
                      </div>

                      <div className="password-section">
                        <div className="password-toggle">
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                          >
                            {showPasswordForm ? 'Hide' : 'Change Password'}
                          </button>
                        </div>

                        {showPasswordForm && (
                          <div className="password-form">
                            <div className="form-group">
                              <label htmlFor="currentPassword">Current Password</label>
                              <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={editForm.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Enter current password"
                                className="form-input"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="newPassword">New Password</label>
                              <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={editForm.newPassword}
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                                className="form-input"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="confirmPassword">Confirm New Password</label>
                              <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={editForm.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                className="form-input"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={handleSaveProfile}
                          disabled={updateLoading}
                        >
                          {updateLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-info">
                      <h3>{profile.name || 'User'}</h3>
                      <p><strong>Email:</strong> {profile.email}</p>
                      {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}
                      {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                      <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-data">No profile data available</div>
            )}
          </div>

          {/* Cache Status Information */}
          <div className="dashboard-section">
            <h2>Data Status</h2>
            <div className="cache-status">
              <div className="status-item">
                <span className="status-label">Profile Data:</span>
                <span className={`status-indicator ${profile ? 'fresh' : 'stale'}`}>
                  {profile ? 'Cached' : 'Not Available'}
                </span>
              </div>
              <div className="cache-info">
                <p>
                  <small>
                    Data is cached for 5 minutes to reduce API calls. 
                    Click "Refresh Data" to fetch fresh data from the server.
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;  