import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import './Scanner.css';

const Scanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [QrScannerComponent, setQrScannerComponent] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const fileInputRef = useRef(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  React.useEffect(() => {
    const loadQrScanner = async () => {
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        setQrResult('🔒 Camera access requires HTTPS. Please use a secure connection for the best experience!');
        setCameraAvailable(false);
        return;
      }
      
      try {
        const QrScanner = await import('react-qr-scanner');
        setQrScannerComponent(() => QrScanner.default);
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setCameraPermission('granted');
            setCameraAvailable(true);
          } catch (permissionError) {
            if (permissionError.name === 'NotAllowedError') {
              setCameraPermission('denied');
              setCameraAvailable(false);
            } else {
              setCameraAvailable(false);
            }
          }
        } else {
          setCameraAvailable(false);
        }

        if (navigator.permissions && navigator.permissions.query) {
          try {
            const permission = await navigator.permissions.query({ name: 'camera' });
            permission.addEventListener('change', () => {
              if (permission.state === 'granted') {
                setCameraPermission('granted');
                setCameraAvailable(true);
                setQrResult('🎉 Camera access granted! You can now scan QR codes.');
              } else if (permission.state === 'denied') {
                setCameraPermission('denied');
                setCameraAvailable(false);
              }
            });
          } catch (error) {
            // Permission API not supported
          }
        }
      } catch (error) {
        setCameraAvailable(false);
      }
    };
    
    loadQrScanner();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height);
          setQrResult(code ? code.data : '🔍 No QR code found in this image. Please try a different image.');
        } catch (error) {
          setQrResult('⚠️ Error processing image: ' + error.message);
        }
      };
      img.onerror = () => setQrResult('❌ Error loading image. Please try a different file.');
      img.src = e.target.result;
    };
    reader.onerror = () => setQrResult('📁 Error reading file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleScan = (data) => {
    if (data && !hasRedirected) {
      let qrText = typeof data === 'string' ? data : 
                   data?.text || data?.data || JSON.stringify(data);
      
      setQrResult(qrText);
      
      try {
        const url = new URL(qrText);
        setHasRedirected(true);
        window.location.href = url.href;
      } catch (e) {
        // Not a valid URL
      }
    }
  };

  const handleError = (err) => {
    if (err.name === 'NotAllowedError') {
      setCameraPermission('denied');
      setQrResult('🔐 Camera access denied. Click "Try Again" and allow camera permissions when prompted.');
    } else if (err.name === 'NotFoundError') {
      setQrResult('📷 No camera found on this device. Please use image upload instead.');
    } else if (err.name === 'NotSupportedError') {
      setQrResult('❌ Camera not supported on this device. Please use image upload instead.');
    } else if (err.name === 'NotReadableError') {
      setQrResult('📱 Camera is in use by another app. Please close other camera apps and try again.');
    } else {
      setQrResult('⚠️ Camera error: ' + (err.message || 'Unknown error. Please try image upload instead.'));
    }
  };

  // Function to check permission status
  const detectPermissionStatus = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' });
        if (permission.state === 'denied') {
          setQrResult('🔒 Camera access is blocked. Please enable it in your browser settings.');
        } else if (permission.state === 'granted') {
          setQrResult('✅ Camera access is already granted! You can start scanning now.');
          setCameraPermission('granted');
          setCameraAvailable(true);
        }
      } catch (error) {
        setQrResult('❓ Unable to check permission status.');
      }
    } else {
      setQrResult('🌐 Permission API not supported in this browser.');
    }
  };

  // Function to request camera permission
  const requestCameraPermission = async () => {
    try {
      setQrResult('🔐 Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      setCameraAvailable(true);
      setQrResult('🎉 Camera access granted! You can now scan QR codes.');
    } catch (error) {
      setCameraPermission('denied');
      if (error.name === 'NotAllowedError') {
        setQrResult('❌ Camera permission denied. Please click the camera icon in your browser address bar and select "Allow".');
      } else {
        setQrResult('⚠️ Failed to access camera: ' + error.message);
      }
    }
  };

  const openBrowserSettings = () => {
    setQrResult('📋 How to enable camera access:\n\n1. 🔍 Look for camera icon in address bar\n2. 👆 Click it and select "Allow"\n3. 🔄 Refresh this page\n\n💡 If you don\'t see the icon, check your browser\'s privacy settings!');
  };

  return (
    <div className="scanner-container">
      <span className="scanner-icon">📱</span>
      <h2 className="scanner-title">Smart QR Scanner</h2>
      <p className="scanner-subtitle">Scan QR codes instantly with your camera or upload images</p>
      
      {cameraAvailable && QrScannerComponent && cameraPermission === 'granted' ? (
        <div className="camera-container">
          <h3>🎯 Point your camera at a QR code</h3>
          <QrScannerComponent
            delay={300}
            onError={handleError}
            onScan={handleScan}
            videoConstraints={{ facingMode: 'environment' }}
            className="camera-video"
          />
          <p style={{ marginTop: '15px', fontSize: '0.9rem', opacity: '0.8' }}>
            Hold steady for best results! 📸
          </p>
        </div>
      ) : cameraPermission === 'denied' ? (
        <div className="permission-denied">
          <p className="permission-title">🔐 Camera Access Needed</p>
          <p className="permission-text">
            We need camera access to scan QR codes for you. It's quick and secure!
          </p>
          
          <div className="permission-instructions">
            <p><strong>✨ How to enable camera:</strong></p>
            <ul className="permission-list">
              <li>🔍 Look for a camera icon in your browser's address bar</li>
              <li>👆 Click the camera icon and select "Allow"</li>
              <li>🔄 If no icon appears, try refreshing the page</li>
              <li>📱 On mobile: Check your device's camera permissions</li>
            </ul>
          </div>
          
          <div className="button-group">
            <button onClick={requestCameraPermission} className="btn btn-primary">
              🔄 Try Again
            </button>
            <button onClick={detectPermissionStatus} className="btn btn-success">
              🔍 Check Status
            </button>
            <button onClick={openBrowserSettings} className="btn btn-secondary">
              ⚙️ Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="camera-unavailable">
          <p>📷 Camera scanning is not available on this device.</p>
          <p className="upload-text">Don't worry! You can still scan QR codes by uploading images below. 🖼️</p>
        </div>
      )}
      
      <div className="upload-section">
        <h3>📁 Upload Image to Scan</h3>
        <p className="upload-text" style={{ marginBottom: '15px' }}>
          Have a QR code image? Upload it here for instant scanning!
        </p>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="file-input"
        />
        <p className="upload-text" style={{ fontSize: '0.9rem', opacity: '0.8' }}>
          Supports JPG, PNG, GIF formats
        </p>
      </div>

      <div className="feature-highlight">
        <h3>🚀 Why use our QR Scanner?</h3>
        <p>• Instant scanning with your camera 📱</p>
        <p>• Upload images for offline scanning 🖼️</p>
        <p>• Works on all devices and browsers 🌐</p>
        <p>• Secure and private - no data stored 🔒</p>
      </div>
      
      {qrResult && (
        <div className="result-container">
          <strong>🎉 Scan Result:</strong>
          <div className="result-text">{qrResult}</div>
        </div>
      )}
    </div>
  );
};

export default Scanner;     