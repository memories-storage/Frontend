import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import './Scanner.css';

const Scanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [QrScannerComponent, setQrScannerComponent] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('prompt');
  const [hasRedirected, setHasRedirected] = useState(false);
  const fileInputRef = useRef(null);

  // Load QR scanner component
  React.useEffect(() => {
    const loadQrScanner = async () => {
      try {
        const QrScanner = await import('react-qr-scanner');
        setQrScannerComponent(() => QrScanner.default);
        setCameraAvailable(true);
      } catch (error) {
        setCameraAvailable(false);
      }
    };
    
    loadQrScanner();
  }, []);

  // Handle QR code from camera
  const handleScan = (data) => {
    if (data && !hasRedirected) {
      let qrText = typeof data === 'string' ? data : 
                   data?.text || data?.data || JSON.stringify(data);
      
      setQrResult(qrText);
      
      // If the scanned data is a valid URL, redirect
      try {
        const url = new URL(qrText);
        setHasRedirected(true);
        window.location.href = url.href;
      } catch (e) {
        // Not a valid URL, do nothing
      }
    }
  };

  const handleError = (err) => {
    if (err.name === 'NotAllowedError') {
      setCameraPermission('denied');
      setQrResult('📱 Camera access denied. Please allow camera permissions to use the scanner.');
    } else if (err.name === 'NotFoundError') {
      setQrResult('📷 No camera found on this device. Please use image upload instead.');
    } else {
      setQrResult('⚠️ Camera error: ' + (err.message || 'Unknown error'));
    }
  };

  // Handle QR code scanning from uploaded image
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
          
          if (code) {
            const qrText = code.data;
            setQrResult(qrText);
            
            // If the scanned data is a valid URL, redirect
            try {
              const url = new URL(qrText);
              setHasRedirected(true);
              window.location.href = url.href;
            } catch (e) {
              // Not a valid URL, do nothing
            }
          } else {
            setQrResult('🔍 No QR code found in this image. Please try a different image.');
          }
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

  return (
    <div className="scanner-container">
      <h2 className="scanner-title">QR Scanner</h2>
      
      {/* Camera Scanner Section */}
      {cameraAvailable && QrScannerComponent && cameraPermission !== 'denied' && (
        <div className="camera-container">
          <h3>📱 Scan with Camera</h3>
          <QrScannerComponent
            delay={300}
            onError={handleError}
            onScan={handleScan}
            videoConstraints={{ facingMode: 'environment' }}
            className="camera-video"
          />
          <p className="upload-text">Point your camera at a QR code</p>
        </div>
      )}

      {/* File Upload Section */}
      <div className="upload-section">
        <h3>📁 Select Image to Scan</h3>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="file-input"
        />
        <p className="upload-text">Upload a QR code image to scan</p>
      </div>

      <div className="feature-highlight">
        <h3>📋 Instructions</h3>
        <p>• Use camera to scan QR codes directly</p>
        <p>• Or select an image file containing a QR code</p>
        <p>• Supported formats: JPG, PNG, GIF</p>
        <p>• The scanned result will appear below</p>
      </div>
      
      {qrResult && (
        <div className="result-container">
          <strong>Scan Result:</strong>
          <div className="result-text">
            {qrResult}
            {(() => {
              try {
                const url = new URL(qrResult);
                return (
                  <div style={{ marginTop: '10px' }}>
                    <a 
                      href={url.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        marginTop: '10px'
                      }}
                    >
                      🔗 Open Link
                    </a>
                  </div>
                );
              } catch (e) {
                return null; // Not a valid URL
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;     