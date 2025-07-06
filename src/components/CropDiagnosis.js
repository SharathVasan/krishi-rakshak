import React, { useState, useRef } from 'react';
import { Camera, Upload, Mic, MicOff, Loader2 } from 'lucide-react';
import geminiService from '../services/geminiService';

const CropDiagnosis = ({ onDiagnosis }) => {
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const dataURL = canvas.toDataURL('image/jpeg');
    setImage(dataURL);
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const startVoiceRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Voice recording implementation will be added later
    } else {
      setIsRecording(false);
    }
  };

  const analyzeCrop = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const result = await geminiService.diagnoseCrop(image, query);
      setDiagnosis(result);
      if (onDiagnosis) onDiagnosis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-diagnosis">
      <h2>🌱 Crop Diagnosis</h2>
      
      {/* Voice Input */}
      <div className="voice-section">
        <button 
          onClick={startVoiceRecording}
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? <MicOff /> : <Mic />}
          {isRecording ? 'Stop Recording' : 'Ask in Kannada'}
        </button>
        
        <input
          type="text"
          placeholder="Or type your question about the crop..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="query-input"
        />
      </div>

      {/* Image Capture */}
      <div className="image-section">
        {!image ? (
          <div>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="camera-preview"
              style={{ display: 'none' }}
            />
            
            <div className="capture-options">
              <button onClick={startCamera} className="camera-btn">
                <Camera /> Open Camera
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current.click()} className="upload-btn">
                <Upload /> Upload Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="image-preview">
            <img src={image} alt="Crop" className="crop-image" />
            <button onClick={() => setImage(null)} className="retake-btn">
              Retake Photo
            </button>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      {image && (
        <button 
          onClick={analyzeCrop} 
          disabled={loading}
          className="analyze-btn"
        >
          {loading ? <Loader2 className="spinner" /> : null}
          {loading ? 'Analyzing...' : 'Analyze Crop'}
        </button>
      )}

      {/* Diagnosis Results */}
      {diagnosis && (
        <div className="diagnosis-result">
          <h3>🔬 Diagnosis Results</h3>
          <div className="diagnosis-content">
            {diagnosis}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiagnosis;