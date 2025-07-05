import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './UploadFile.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFiles } from '../../store/slices/projectSlice';

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
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const dispatch = useDispatch();
  const uploading = useSelector(state => state.project.uploading);
  const uploadError = useSelector(state => state.project.uploadError);
  const uploadResult = useSelector(state => state.project.uploadResult);

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
    setMessage('Uploading files to backend...');
    const formData = new FormData();
    filesToUpload.forEach((f) => {
      formData.append('files', f.file);
    });
    const deviceInfo = getDeviceInfo();
    formData.append('deviceInfo', JSON.stringify(deviceInfo));
    if (id) {
      formData.append('userId', id.split('=')[1]);
    }
    
    dispatch(uploadFiles({ formData }));
  };

  // Show upload result or error
  React.useEffect(() => {
    if (uploadResult) {
      // Handle the original response format (array of ImageResponse objects)
      if (Array.isArray(uploadResult) && uploadResult.length > 0) {
        setMessage(`Successfully uploaded ${uploadResult.length} file(s).`);
        
        // Update file statuses based on upload result
        setFiles(prevFiles => {
          return prevFiles.map(file => {
            const uploadedFile = uploadResult.find(upload => 
              upload.URL && upload.URL.includes(file.file.name.split('.')[0])
            );
            if (uploadedFile) {
              return { ...file, status: 'success' };
            }
            return file;
          });
        });
      } else if (Array.isArray(uploadResult) && uploadResult.length === 0) {
        setMessage('No files were successfully uploaded.');
      } else {
        setMessage('Upload completed.');
      }
    } else if (uploadError) {
      setMessage('Failed to upload files to backend.');
    }
  }, [uploadResult, uploadError]);

  return (
    <div className="uploadfile-root">
      <h2 className="uploadfile-title">Upload Files</h2>
      <div className="uploadfile-header-row">
        <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="uploadfile-input" />
        <button onClick={handleUpload} disabled={uploading || !files.some(f => f.checked)} className="uploadfile-uploadbtn">
          {uploading ? 'Uploading...' : 'Upload Selected'}
        </button>
      </div>
      <div className="uploadfile-count-row">
        <span className="uploadfile-count">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
      </div>
      <div className="uploadfile-cards-scroll">
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
      </div>
      <div className="uploadfile-message">{message}</div>
    </div>
  );
};

export default UploadFile;  