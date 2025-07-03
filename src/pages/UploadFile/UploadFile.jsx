import React, { useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants/api';
import { useParams } from 'react-router-dom';
import './UploadFile.css';

const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height
    }
  };
};

const isImage = (file) => file.type.startsWith('image/');
const isVideo = (file) => file.type.startsWith('video/');

const UploadFile = () => {
  const [files, setFiles] = useState([]); // [{file, status, error, checked, previewUrl}]
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const { id } = useParams();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      status: 'pending',
      error: '',
      checked: true,
      previewUrl: isImage(file) || isVideo(file) ? URL.createObjectURL(file) : null
    }));
    // Prevent duplicates by file name and size
    setFiles(prevFiles => {
      const allFiles = [...prevFiles, ...newFiles];
      const uniqueFiles = [];
      const seen = new Set();
      for (const f of allFiles) {
        const key = f.file.name + '_' + f.file.size;
        if (!seen.has(key)) {
          uniqueFiles.push(f);
          seen.add(key);
        }
      }
      return uniqueFiles;
    });
    setMessage('');
  };

  const handleCheck = (idx) => {
    setFiles(files => files.map((f, i) => i === idx ? { ...f, checked: !f.checked } : f));
  };

  const handleRemove = (idx) => {
    setFiles(files => files.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    const filesToUpload = files.filter(f => f.checked);
    if (!filesToUpload.length) {
      setMessage('Please select at least one file to upload.');
      return;
    }
    setUploading(true);
    setMessage('Uploading files to backend...');
    const formData = new FormData();
    filesToUpload.forEach((f, idx) => {
      formData.append('files', f.file);
    });
    const deviceInfo = getDeviceInfo();
    formData.append('deviceInfo', JSON.stringify(deviceInfo));
    if (id) {
      let cleanId = id;
      if (typeof id === 'string' && id.includes('=')) {
        cleanId = id.split('=')[1];
      }
      formData.append('id', cleanId);
    }

    // Print FormData content
    console.log('Uploading files and device info to backend:');
    for (let pair of formData.entries()) {
      if (pair[0] === 'files') {
        console.log('File:', pair[1].name, pair[1].size, pair[1].type);
      } else {
        console.log(pair[0] + ':', pair[1]);
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOAD_FILES}`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        // Assume backend returns an array of {name, status, error?}
        const updatedFiles = files.map(f => {
          if (!f.checked) return f;
          const result = data.results?.find(r => r.name === f.file.name);
          if (result) {
            return {
              ...f,
              status: result.status,
              error: result.error || ''
            };
          }
          return { ...f, status: 'error', error: 'No response from backend' };
        });
        setFiles(updatedFiles);
        setMessage('Upload complete.');
      } else {
        setFiles(files.map(f => f.checked ? { ...f, status: 'error', error: 'Backend error' } : f));
        setMessage('Failed to upload files to backend.');
      }
    } catch (err) {
      setFiles(files.map(f => f.checked ? { ...f, status: 'error', error: err.message } : f));
      setMessage('Error uploading to backend: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="uploadfile-root">
      <h2 className="uploadfile-title">Upload Files</h2>
      <div className="uploadfile-input-row">
        <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="uploadfile-input" />
        <span className="uploadfile-count">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
      </div>
      <div className="uploadfile-cards">
        {files.map((f, idx) => (
          <div key={idx} className={`uploadfile-card${f.checked ? ' checked' : ''}`}>
            <button className="uploadfile-removebtn" title="Remove file" onClick={() => handleRemove(idx)}>&times;</button>
            <input type="checkbox" checked={f.checked} onChange={() => handleCheck(idx)} className="uploadfile-checkbox" />
            <div className="uploadfile-media-container">
              {isImage(f.file) && f.previewUrl && (
                <img src={f.previewUrl} alt={f.file.name} className="css-1kuwa16-MuiCardMedia-root uploadfile-media" />
              )}
              {isVideo(f.file) && f.previewUrl && (
                <video src={f.previewUrl} controls className="css-1kuwa16-MuiCardMedia-root uploadfile-media" />
              )}
              {!isImage(f.file) && !isVideo(f.file) && (
                <span className="uploadfile-nopreview">No preview</span>
              )}
            </div>
            <div className="uploadfile-filename">{f.file.name}</div>
            <div className="uploadfile-filesize">{(f.file.size/1024).toFixed(1)} KB</div>
            {f.status === 'success' && (
              <div className="uploadfile-status-success">Uploaded</div>
            )}
            {f.status === 'error' && (
              <div className="uploadfile-status-error">Failed: {f.error}</div>
            )}
            {f.status === 'pending' && (
              <div className="uploadfile-status-pending">Pending upload</div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleUpload} disabled={uploading || !files.some(f => f.checked)} className="uploadfile-uploadbtn">
        {uploading ? 'Uploading...' : 'Upload Selected'}
      </button>
      <div className="uploadfile-message">{message}</div>
    </div>
  );
};

export default UploadFile;  