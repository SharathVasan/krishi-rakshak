import React, { useEffect, useState } from "react";
import geminiService from "./services/geminiService";
import CropDiagnosis from "./components/CropDiagnosis";
import VoiceRecorder from "./components/VoiceRecorder";
import ImageCapture from "./components/ImageCapture";
import "./App.css";

function App() {
  const [testResult, setTestResult] = useState("");
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [language, setLanguage] = useState("en");
  const [farmerProfile, setFarmerProfile] = useState({
    location: "Karnataka",
    farmSize: "Small scale",
    crops: "Mixed crops",
    category: "General"
  });

  useEffect(() => {
    // Test Gemini connection on app load
    const testGemini = async () => {
      const result = await geminiService.testConnection();
      setTestResult(result || "Failed to connect to Gemini");
    };
    testGemini();
  }, []);

  const handleVoiceQuery = async (transcript) => {
    const response = await geminiService.processVoiceQuery(
      transcript, 
      { tab: activeTab, profile: farmerProfile },
      language
    );
    console.log("Voice response:", response);
  };

  const handleMarketAnalysis = async () => {
    const response = await geminiService.getMarketAdvice(
      farmerProfile.location,
      farmerProfile.crops,
      null,
      language
    );
    console.log("Market analysis:", response);
  };

  const handleSchemeRecommendations = async () => {
    const response = await geminiService.getSchemeRecommendations(
      farmerProfile,
      language
    );
    console.log("Scheme recommendations:", response);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛡️ Krishi Rakshak</h1>
        <p>Your AI Farming Companion</p>

        {/* Language Selector */}
        <div className="language-selector">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnosis')}
          >
            🌱 Crop Diagnosis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            💰 Market Prices
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
            onClick={() => setActiveTab('schemes')}
          >
            🏛️ Govt Schemes
          </button>
        </div>

        {/* Voice Input (Always Available) */}
        <VoiceRecorder 
          onTranscription={handleVoiceQuery}
          language={language}
        />

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'diagnosis' && (
            <CropDiagnosis 
              onDiagnosis={(result) => console.log("Diagnosis:", result)}
              language={language}
            />
          )}
          
          {activeTab === 'market' && (
            <div className="market-section">
              <h2>💰 Market Intelligence</h2>
              <button onClick={handleMarketAnalysis} className="action-btn">
                Get Market Analysis
              </button>
            </div>
          )}
          
          {activeTab === 'schemes' && (
            <div className="schemes-section">
              <h2>🏛️ Government Schemes</h2>
              <button onClick={handleSchemeRecommendations} className="action-btn">
                Find Eligible Schemes
              </button>
            </div>
          )}
        </div>

        {/* API Test Status */}
        {testResult && (
          <div className="api-status">
            <small>🔗 API Status: {testResult}</small>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
