import React, { useState, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';

const Scanner = () => {
  const [qrResult, setQrResult] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const fileInputRef = useRef(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check for camera availability
  React.useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraAvailable(false);
    } else {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setCameraAvailable(hasCamera);
      });
    }
  }, []);

  // Handle QR code from image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
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
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle QR code from camera
  const handleScan = (data) => {
    if (data && !hasRedirected) {
      setQrResult(data);
      // If the scanned data is a valid URL, redirect
      try {
        const url = new URL(data);
        setHasRedirected(true);
        window.location.href = url.href;
      } catch (e) {
        // Not a valid URL, do nothing
      }
    }
  };

  const handleError = (err) => {
    setQrResult('Camera error: ' + err.message);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h2>QR Code Scanner</h2>
      {cameraAvailable ? (
        <div style={{ marginBottom: 20 }}>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            videoConstraints={{
              facingMode: 'environment'
            }}
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <p>Camera not available on this device.</p>
      )}
      <div style={{ margin: '20px 0' }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <p>Or upload an image to scan QR code</p>
      </div>
      <div>
        <strong>Result:</strong>
        <div style={{ wordBreak: 'break-all', marginTop: 10 }}>{qrResult || 'No result yet.'}</div>
      </div>
    </div>
  );
};

export default Scanner;     