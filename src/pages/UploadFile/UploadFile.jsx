import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './UploadFile.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFiles, clearUploadResult } from '../../store/slices/projectSlice';
import { v4 as uuidv4 } from 'uuid';

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
  const [files, setFiles] = useState([]); // [{file, status, error, checked, previewUrl, uuid}]
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
      previewUrl: isImage(file) || isVideo(file) ? URL.createObjectURL(file) : null,
      uuid: uuidv4()
    }));
    
    // Prevent duplicates
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
    

    
    setMessage('🚀 Uploading your files to the cloud...');
    
    // Mark selected files as uploading
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.checked ? { ...file, status: 'uploading' } : file
      )
    );
    
    const formData = new FormData();
    
    // Add files with UUID prefix
    filesToUpload.forEach((f) => {
      const fileWithUUID = new File([f.file], `${f.uuid}_${f.file.name}`, {
        type: f.file.type,
        lastModified: f.file.lastModified
      });
      formData.append('files', fileWithUUID);
    });
    
    const deviceInfo = getDeviceInfo();
    formData.append('deviceInfo', JSON.stringify(deviceInfo));
    if (id) {
      formData.append('userId', id.split('=')[1]);
    }
    
    dispatch(uploadFiles({ formData }));
  };

    // Handle upload results
  React.useEffect(() => {
    if (uploadResult) {
      // Handle new structured response format
      if (uploadResult.successful !== undefined && uploadResult.failed !== undefined) {
        // Ensure arrays are not null
        const successfulArray = Array.isArray(uploadResult.successful) ? uploadResult.successful : [];
        const failedArray = Array.isArray(uploadResult.failed) ? uploadResult.failed : [];
        
        const failedCount = failedArray.length;
        const successfulCount = successfulArray.length;
        
        if (failedCount === 0) {
          setMessage(`All ${successfulCount} file(s) uploaded successfully.`);
        } else {
          setMessage(`${successfulCount} file(s) uploaded successfully, ${failedCount} file(s) failed.`);
        }
        
        // Update file statuses and remove successful files immediately
        setFiles(prevFiles => {
          console.log('=== UPLOAD RESULT DEBUG ===');
          console.log('Processing files:', prevFiles.length);
          console.log('Successful files from backend:', successfulArray);
          console.log('Failed files from backend:', failedArray);
          console.log('Current files in state:', prevFiles.map(f => ({ name: f.file.name, uuid: f.uuid, fullName: f.uuid + '_' + f.file.name, checked: f.checked })));
          
          const filtered = prevFiles.filter(file => {
            const fullName = file.uuid + '_' + file.file.name;
            const isFailed = failedArray.some(failedFile => {
              const match = failedFile.name === fullName;
              console.log(`Checking failed: "${failedFile.name}" === "${fullName}" = ${match}`);
              return match;
            });
            const isSuccessful = successfulArray.some(successfulFile => {
              const match = successfulFile.name === fullName;
              console.log(`Checking successful: "${successfulFile.name}" === "${fullName}" = ${match}`);
              return match;
            });
            
            console.log(`File ${file.file.name} (full: ${fullName}): isFailed=${isFailed}, isSuccessful=${isSuccessful}, checked=${file.checked}`);
            
            if (isFailed) {
              // Keep failed files with error status
              console.log(`Keeping failed file: ${file.file.name}`);
              return true;
            } else if (isSuccessful) {
              // Remove successful files immediately (regardless of checked status)
              console.log(`Removing successful file: ${file.file.name}`);
              return false;
            }
            // Keep unchecked files that weren't uploaded
            console.log(`Keeping unchecked file: ${file.file.name}`);
            return true;
          }).map(file => {
            const fullName = file.uuid + '_' + file.file.name;
            const isFailed = failedArray.some(failedFile => 
              failedFile.name === fullName
            );
            if (isFailed) {
              return { ...file, status: 'error', error: 'Upload failed' };
            }
            return file;
          });
          console.log('Files after processing:', filtered.length, filtered.map(f => f.file.name));
          console.log('=== END DEBUG ===');
          return filtered;
        });
        
        dispatch(clearUploadResult());
      } else if (Array.isArray(uploadResult)) {
        // Handle old response format (array of failed files only)
        const failedCount = uploadResult.length;
        
        if (failedCount === 0) {
          setMessage('All files uploaded successfully.');
        } else {
          setMessage(`${failedCount} file(s) failed to upload.`);
        }
        
        // Update file statuses and remove successful files immediately
        setFiles(prevFiles => {
          return prevFiles.filter(file => {
            const isFailed = uploadResult?.some(failedFile => 
              failedFile.name === file.file.name
            ) || false;
            
            if (isFailed) {
              // Keep failed files with error status
              return true;
            } else if (file.checked) {
              // Remove successful files immediately (in old format, if not in failed array, it's successful)
              return false;
            }
            // Keep unchecked files
            return true;
          }).map(file => {
            const isFailed = uploadResult?.some(failedFile => 
              failedFile.name === file.file.name
            ) || false;
            
            if (isFailed) {
              return { ...file, status: 'error', error: 'Upload failed' };
            }
            return file;
          });
        });
        
        dispatch(clearUploadResult());
      } else {
        // Handle unexpected response format
        console.error('Unexpected upload response format:', uploadResult);
        setMessage('Upload completed with unexpected response.');
        dispatch(clearUploadResult());
      }
    } else if (uploadError) {
      setMessage('Failed to upload files to backend.');
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.checked ? { ...file, status: 'error', error: 'Upload failed' } : file
        )
      );
      
      dispatch(clearUploadResult());
    }
  }, [uploadResult, uploadError, dispatch]);

  return (
    <div className="uploadfile-root">
      <h2 className="uploadfile-title">Upload Files</h2>
      <div className="uploadfile-header-row">
        <div className="uploadfile-input-container">
          <input 
            type="file" 
            accept="image/*,video/*" 
            multiple 
            onChange={handleFileChange} 
            className="uploadfile-input" 
            id="file-input"
          />
          <label htmlFor="file-input" className="uploadfile-input-label">
            Choose Files ({files.length} selected)
          </label>
        </div>
        <button onClick={handleUpload} disabled={uploading || !files.some(f => f.checked)} className="uploadfile-uploadbtn">
          {uploading ? 'Uploading...' : 'Upload Selected'}
        </button>
      </div>
      <div className="uploadfile-count-row">
        <span className="uploadfile-count">{files.length} file{files.length !== 1 ? 's' : ''} remaining</span>
      </div>
      <div className="uploadfile-cards-scroll">
        <div className="uploadfile-cards">
          {files.map((f, idx) => (
            <div key={f.uuid} className={`uploadfile-card${f.checked ? ' checked' : ''}`}>
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
              {f.status === 'uploading' && (
                <div className="uploadfile-status-uploading">Uploading...</div>
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