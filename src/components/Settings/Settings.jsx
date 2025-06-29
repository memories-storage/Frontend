import React from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h2>Account Settings</h2>
            <div className="settings-item">
              <div className="settings-info">
                <h3>Notifications</h3>
                <p>Manage your notification preferences</p>
              </div>
              <div className="settings-action">
                <button className="btn btn-outline">Configure</button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <h3>Privacy</h3>
                <p>Control your privacy settings</p>
              </div>
              <div className="settings-action">
                <button className="btn btn-outline">Manage</button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <h3>Security</h3>
                <p>Two-factor authentication and security settings</p>
              </div>
              <div className="settings-action">
                <button className="btn btn-outline">Setup</button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>App Settings</h2>
            <div className="settings-item">
              <div className="settings-info">
                <h3>Theme</h3>
                <p>Choose your preferred theme</p>
              </div>
              <div className="settings-action">
                <select className="form-select">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <h3>Language</h3>
                <p>Select your preferred language</p>
              </div>
              <div className="settings-action">
                <select className="form-select">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Data & Storage</h2>
            <div className="settings-item">
              <div className="settings-info">
                <h3>Export Data</h3>
                <p>Download your data</p>
              </div>
              <div className="settings-action">
                <button className="btn btn-outline">Export</button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-info">
                <h3>Clear Cache</h3>
                <p>Clear cached data to free up space</p>
              </div>
              <div className="settings-action">
                <button className="btn btn-outline">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 