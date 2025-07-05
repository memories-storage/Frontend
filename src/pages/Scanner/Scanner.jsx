import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';

const Scanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [QrScannerComponent, setQrScannerComponent] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const fileInputRef = useRef(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Load QR scanner component dynamically
  React.useEffect(() => {
    const loadQrScanner = async () => {
      try {
        const QrScanner = await import('react-qr-scanner');
        setQrScannerComponent(() => QrScanner.default);
        
        // Check for camera availability and permissions
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Check if we have permission to access camera
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
            setCameraPermission('granted');
            setCameraAvailable(true);
          } catch (permissionError) {
    
            if (permissionError.name === 'NotAllowedError') {
              setCameraPermission('denied');
              setCameraAvailable(false);
            } else if (permissionError.name === 'NotFoundError') {
              setCameraAvailable(false);
            } else {
              setCameraAvailable(false);
            }
          }
        } else {
          setCameraAvailable(false);
        }
      } catch (error) {

        setCameraAvailable(false);
      }
    };
    
    loadQrScanner();
  }, []);

  // Handle QR code from image
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
            setQrResult(code.data);
          } else {
            setQrResult('No QR code found in image.');
          }
        } catch (error) {
          setQrResult('Error processing image: ' + error.message);
        }
      };
      img.onerror = () => {
        setQrResult('Error loading image.');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setQrResult('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  // Handle QR code from camera
  const handleScan = (data) => {
    if (data && !hasRedirected) {
      // Extract the text from the QR code result
      let qrText;
      if (typeof data === 'string') {
        qrText = data;
      } else if (data && typeof data === 'object' && data.text) {
        qrText = data.text;
      } else if (data && typeof data === 'object' && data.data) {
        qrText = data.data;
      } else {

        qrText = JSON.stringify(data);
      }
      
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
      setQrResult('Camera access denied. Please allow camera permissions in your browser settings.');
    } else if (err.name === 'NotFoundError') {
      setQrResult('No camera found on this device.');
    } else if (err.name === 'NotSupportedError') {
      setQrResult('Camera not supported on this device.');
    } else {
      setQrResult('Camera error: ' + (err.message || 'Unknown error'));
    }
  };

  // Function to request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      setCameraAvailable(true);
    } catch (error) {
      
      setCameraPermission('denied');
      setQrResult('Camera permission denied. Please allow camera access in your browser settings.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center', padding: '20px' }}>
      <h2>QR Code Scanner</h2>
      
      {cameraAvailable && QrScannerComponent && cameraPermission === 'granted' ? (
        <div style={{ marginBottom: 20 }}>
          <QrScannerComponent
            delay={300}
            onError={handleError}
            onScan={handleScan}
            videoConstraints={{
              facingMode: 'environment'
            }}
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </div>
      ) : cameraPermission === 'denied' ? (
        <div style={{ marginBottom: 20, padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
          <p style={{ color: '#856404', marginBottom: '10px' }}>Camera access denied</p>
          <p style={{ fontSize: '14px', color: '#856404', marginBottom: '15px' }}>
            Please allow camera permissions in your browser settings to use the scanner.
          </p>
          <button 
            onClick={requestCameraPermission}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 20, padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p>Camera scanning is not available on this device.</p>
          <p style={{ fontSize: '14px', color: '#666' }}>You can still upload images to scan QR codes.</p>
        </div>
      )}
      
      <div style={{ margin: '20px 0' }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ marginBottom: '10px' }}
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Upload an image to scan QR code</p>
      </div>
      
      {qrResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <strong>Result:</strong>
          <div style={{ 
            wordBreak: 'break-all', 
            marginTop: 10, 
            fontSize: '14px',
            fontFamily: 'monospace'
          }}>
            {qrResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;     