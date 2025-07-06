import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, Pause } from 'lucide-react';

const VoiceRecorder = ({ onTranscription, onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('kn-IN');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convert to base64 for API calls
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          if (onAudioReady) onAudioReady(base64);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const simulateTranscription = () => {
    // Placeholder for speech-to-text service
    const mockTranscriptions = {
      'kn-IN': 'My tomato plant has yellow leaves (Kannada)',
      'en-IN': 'My tomato plant has yellow leaves',
      'hi-IN': 'My tomato plant has yellow leaves (Hindi)'
    };
    
    const mockText = mockTranscriptions[language] || mockTranscriptions['en-IN'];
    setTranscription(mockText);
    if (onTranscription) onTranscription(mockText);
  };

  return (
    <div className="voice-recorder">
      <h3>🎙️ Voice Input</h3>
      
      {/* Language Selection */}
      <div className="language-selector">
        <label>Language:</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="kn-IN">Kannada</option>
          <option value="en-IN">English</option>
          <option value="hi-IN">Hindi</option>
        </select>
      </div>

      {/* Recording Controls */}
      <div className="recording-controls">
        <button 
          onClick={toggleRecording}
          className={`record-btn ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? <MicOff /> : <Mic />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {audioURL && (
          <button onClick={playAudio} className="play-btn">
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
        
        {audioURL && (
          <button onClick={simulateTranscription} className="transcribe-btn">
            <Volume2 /> Transcribe
          </button>
        )}
      </div>

      {/* Audio Element */}
      {audioURL && (
        <audio 
          ref={audioRef}
          src={audioURL}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}

      {/* Transcription Display */}
      {transcription && (
        <div className="transcription-result">
          <h4>📝 Transcription:</h4>
          <p className="transcription-text">{transcription}</p>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="recording-status">
          <div className="pulse-indicator"></div>
          <span>Recording in {language.split('-')[0].toUpperCase()}...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;