import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';

const ImageCapture = ({ onImageCapture }) => {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setShowCamera(true);
      setCameraReady(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access is required for taking photos');
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    setImage(dataURL);
    stopCamera();
    
    if (onImageCapture) onImageCapture(dataURL);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setCameraReady(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        if (onImageCapture) onImageCapture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    startCamera();
  };

  const removeImage = () => {
    setImage(null);
    if (onImageCapture) onImageCapture(null);
  };

  return (
    <div className="image-capture">
      <h3>=ø Capture Crop Image</h3>
      
      {!image && !showCamera && (
        <div className="capture-options">
          <button onClick={startCamera} className="camera-btn">
            <Camera /> Take Photo
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="upload-btn"
          >
            <Upload /> Upload Photo
          </button>
        </div>
      )}

      {showCamera && (
        <div className="camera-view">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-preview"
            onCanPlay={() => setCameraReady(true)}
          />
          
          <div className="camera-controls">
            <button 
              onClick={capturePhoto} 
              disabled={!cameraReady}
              className="capture-btn"
            >
              =ø Capture
            </button>
            
            <button onClick={stopCamera} className="cancel-btn">
              <X /> Cancel
            </button>
          </div>
        </div>
      )}

      {image && (
        <div className="image-preview">
          <img src={image} alt="Captured crop" className="captured-image" />
          
          <div className="image-actions">
            <button onClick={retakePhoto} className="retake-btn">
              <RotateCcw /> Retake
            </button>
            
            <button onClick={removeImage} className="remove-btn">
              <X /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;