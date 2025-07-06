import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Camera, 
  Mic, 
  MicOff, 
  TrendingUp, 
  Building2, 
  User,
  Upload,
  Loader,
  CheckCircle
} from 'lucide-react';
import geminiService from './services/geminiService';
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [isRecording, setIsRecording] = useState(false);
  const [image, setImage] = useState(null);
  const [query, setQuery] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');

  // Test Gemini API on load
  useEffect(() => {
    const testAPI = async () => {
      try {
        const result = await geminiService.testConnection();
        setApiStatus(result || 'Connected');
        toast.success('Gemini API Connected!');
      } catch (error) {
        setApiStatus('Connection failed');
        toast.error('API connection failed');
      }
    };
    testAPI();
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    toast.success(`Language changed to ${lang}`);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      toast.success('Image uploaded!');
    }
  };

  const startCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      // For demo purposes, we'll just show a success message
      toast.success('Camera access granted! (Demo mode)');
    } catch (error) {
      toast.error('Camera access denied');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success('Recording started');
    } else {
      toast.success('Recording stopped');
      // Simulate transcription
      setTimeout(() => {
        setQuery('My tomato plant has yellow leaves');
        toast.success('Voice transcribed!');
      }, 1000);
    }
  };

  const analyzeCrop = async () => {
    if (!image && !query) {
      toast.error('Please add an image or voice query first');
      return;
    }

    setLoading(true);
    try {
      const result = await geminiService.diagnoseCrop(
        image || '', 
        query || 'Analyze this crop', 
        i18n.language
      );
      setDiagnosis(result);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMarketData = async () => {
    setLoading(true);
    try {
      const result = await geminiService.getMarketAdvice(
        'Karnataka', 
        'Tomato', 
        null, 
        i18n.language
      );
      setDiagnosis(result);
      toast.success('Market data loaded!');
    } catch (error) {
      toast.error('Failed to get market data');
    } finally {
      setLoading(false);
    }
  };

  const getSchemes = async () => {
    setLoading(true);
    try {
      const result = await geminiService.getSchemeRecommendations(
        { location: 'Karnataka', farmSize: 'small', crops: ['tomato'] },
        i18n.language
      );
      setDiagnosis(result);
      toast.success('Schemes loaded!');
    } catch (error) {
      toast.error('Failed to get schemes');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'diagnosis', label: t('navigation.diagnosis'), icon: Camera },
    { id: 'market', label: t('navigation.market'), icon: TrendingUp },
    { id: 'schemes', label: t('navigation.schemes'), icon: Building2 },
    { id: 'profile', label: t('navigation.profile'), icon: User }
  ];

  return (
    <div className="min-h-screen p-4 pattern-overlay">
      {/* Header */}
      <div className="glass p-4 mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">🛡️ {t('app.title')}</h1>
        <p className="text-white/80 text-sm mb-4">{t('app.subtitle')}</p>
        
        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-4">
          <button 
            onClick={() => changeLanguage('en')}
            className={`btn-secondary text-xs py-2 px-3 ${i18n.language === 'en' ? 'bg-white/30' : ''}`}
          >
            EN
          </button>
          <button 
            onClick={() => changeLanguage('kn')}
            className={`btn-secondary text-xs py-2 px-3 ${i18n.language === 'kn' ? 'bg-white/30' : ''}`}
          >
            ಕನ್ನಡ
          </button>
          <button 
            onClick={() => changeLanguage('hi')}
            className={`btn-secondary text-xs py-2 px-3 ${i18n.language === 'hi' ? 'bg-white/30' : ''}`}
          >
            हिंदी
          </button>
        </div>

        {/* API Status */}
        <div className="text-xs text-white/60">
          API: {apiStatus}
        </div>
      </div>

      {/* Navigation */}
      <div className="glass p-4 mb-6">
        <div className="nav-grid">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Input - Always visible */}
      <div className="glass p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Mic size={20} />
          {t('voice.title')}
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={toggleRecording}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 recording-pulse' 
                : 'btn-primary'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            {isRecording ? t('voice.stopRecording') : t('voice.startRecording')}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('voice.placeholder')}
            className="input-glass"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass p-4 mb-6">
        {activeTab === 'diagnosis' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera size={24} />
              {t('cropDiagnosis.title')}
            </h2>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="btn-primary flex-1 cursor-pointer text-center">
                  <Upload className="inline mr-2" size={16} />
                  {t('cropDiagnosis.uploadPhoto')}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <button onClick={startCamera} className="btn-secondary">
                  <Camera size={16} />
                </button>
              </div>

              {image && (
                <div className="relative">
                  <img src={image} alt="Crop" className="w-full rounded-lg max-h-64 object-cover" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}

              <button
                onClick={analyzeCrop}
                disabled={loading || (!image && !query)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                {loading ? t('cropDiagnosis.analyzing') : t('cropDiagnosis.analyze')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={24} />
              {t('market.title')}
            </h2>
            <button
              onClick={getMarketData}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <TrendingUp size={16} />}
              {loading ? 'Loading...' : t('market.getAnalysis')}
            </button>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 size={24} />
              {t('schemes.title')}
            </h2>
            <button
              onClick={getSchemes}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <Building2 size={16} />}
              {loading ? 'Loading...' : t('schemes.findSchemes')}
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User size={24} />
              {t('profile.title')}
            </h2>
            <div className="glass-strong p-4 text-center">
              <p className="text-white/80">Profile management coming soon!</p>
              <p className="text-sm text-white/60 mt-2">Sign in with Google to save your preferences</p>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {diagnosis && (
        <div className="glass p-4 mb-6">
          <h3 className="text-lg font-bold mb-3">📊 Results</h3>
          <div className="bg-white/10 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {diagnosis}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;