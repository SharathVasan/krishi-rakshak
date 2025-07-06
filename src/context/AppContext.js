import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  language: 'en',
  theme: 'light',
  activeTab: 'diagnosis',
  farmerProfile: {
    name: '',
    location: 'Karnataka',
    farmSize: 'small',
    crops: ['mixed'],
    experience: '',
    phoneNumber: '',
    category: 'general'
  },
  cropDiagnosis: {
    image: null,
    query: '',
    result: null,
    loading: false
  },
  voice: {
    isRecording: false,
    audioURL: null,
    transcription: '',
    loading: false
  },
  market: {
    data: null,
    loading: false,
    selectedCrop: null
  },
  schemes: {
    eligibleSchemes: [],
    loading: false
  }
};

// Action types
export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SIGN_OUT: 'SIGN_OUT',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  UPDATE_FARMER_PROFILE: 'UPDATE_FARMER_PROFILE',
  SET_CROP_IMAGE: 'SET_CROP_IMAGE',
  SET_CROP_QUERY: 'SET_CROP_QUERY',
  SET_CROP_RESULT: 'SET_CROP_RESULT',
  SET_CROP_LOADING: 'SET_CROP_LOADING',
  SET_VOICE_RECORDING: 'SET_VOICE_RECORDING',
  SET_VOICE_AUDIO: 'SET_VOICE_AUDIO',
  SET_VOICE_TRANSCRIPTION: 'SET_VOICE_TRANSCRIPTION',
  SET_VOICE_LOADING: 'SET_VOICE_LOADING',
  SET_MARKET_DATA: 'SET_MARKET_DATA',
  SET_MARKET_LOADING: 'SET_MARKET_LOADING',
  SET_SCHEMES_DATA: 'SET_SCHEMES_DATA',
  SET_SCHEMES_LOADING: 'SET_SCHEMES_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    
    case ActionTypes.SIGN_OUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        loading: false 
      };
    
    case ActionTypes.SET_LANGUAGE:
      return { ...state, language: action.payload };
    
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ActionTypes.UPDATE_FARMER_PROFILE:
      return { 
        ...state, 
        farmerProfile: { ...state.farmerProfile, ...action.payload } 
      };
    
    case ActionTypes.SET_CROP_IMAGE:
      return { 
        ...state, 
        cropDiagnosis: { ...state.cropDiagnosis, image: action.payload } 
      };
    
    case ActionTypes.SET_CROP_QUERY:
      return { 
        ...state, 
        cropDiagnosis: { ...state.cropDiagnosis, query: action.payload } 
      };
    
    case ActionTypes.SET_CROP_RESULT:
      return { 
        ...state, 
        cropDiagnosis: { ...state.cropDiagnosis, result: action.payload, loading: false } 
      };
    
    case ActionTypes.SET_CROP_LOADING:
      return { 
        ...state, 
        cropDiagnosis: { ...state.cropDiagnosis, loading: action.payload } 
      };
    
    case ActionTypes.SET_VOICE_RECORDING:
      return { 
        ...state, 
        voice: { ...state.voice, isRecording: action.payload } 
      };
    
    case ActionTypes.SET_VOICE_AUDIO:
      return { 
        ...state, 
        voice: { ...state.voice, audioURL: action.payload } 
      };
    
    case ActionTypes.SET_VOICE_TRANSCRIPTION:
      return { 
        ...state, 
        voice: { ...state.voice, transcription: action.payload, loading: false } 
      };
    
    case ActionTypes.SET_VOICE_LOADING:
      return { 
        ...state, 
        voice: { ...state.voice, loading: action.payload } 
      };
    
    case ActionTypes.SET_MARKET_DATA:
      return { 
        ...state, 
        market: { ...state.market, data: action.payload, loading: false } 
      };
    
    case ActionTypes.SET_MARKET_LOADING:
      return { 
        ...state, 
        market: { ...state.market, loading: action.payload } 
      };
    
    case ActionTypes.SET_SCHEMES_DATA:
      return { 
        ...state, 
        schemes: { ...state.schemes, eligibleSchemes: action.payload, loading: false } 
      };
    
    case ActionTypes.SET_SCHEMES_LOADING:
      return { 
        ...state, 
        schemes: { ...state.schemes, loading: action.payload } 
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { i18n } = useTranslation();

  // Load saved data on app start
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const savedProfile = localStorage.getItem('farmerProfile');
    const savedUser = localStorage.getItem('user');

    if (savedLanguage && savedLanguage !== state.language) {
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: savedLanguage });
      i18n.changeLanguage(savedLanguage);
    }

    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        dispatch({ type: ActionTypes.UPDATE_FARMER_PROFILE, payload: profile });
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: ActionTypes.SET_USER, payload: user });
      } catch (error) {
        console.error('Error loading saved user:', error);
      }
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('language', state.language);
  }, [state.language]);

  useEffect(() => {
    localStorage.setItem('farmerProfile', JSON.stringify(state.farmerProfile));
  }, [state.farmerProfile]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    signOut: () => dispatch({ type: ActionTypes.SIGN_OUT }),
    setLanguage: (language) => {
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
      i18n.changeLanguage(language);
    },
    setActiveTab: (tab) => dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab }),
    updateFarmerProfile: (profile) => dispatch({ type: ActionTypes.UPDATE_FARMER_PROFILE, payload: profile }),
    setCropImage: (image) => dispatch({ type: ActionTypes.SET_CROP_IMAGE, payload: image }),
    setCropQuery: (query) => dispatch({ type: ActionTypes.SET_CROP_QUERY, payload: query }),
    setCropResult: (result) => dispatch({ type: ActionTypes.SET_CROP_RESULT, payload: result }),
    setCropLoading: (loading) => dispatch({ type: ActionTypes.SET_CROP_LOADING, payload: loading }),
    setVoiceRecording: (recording) => dispatch({ type: ActionTypes.SET_VOICE_RECORDING, payload: recording }),
    setVoiceAudio: (audio) => dispatch({ type: ActionTypes.SET_VOICE_AUDIO, payload: audio }),
    setVoiceTranscription: (transcription) => dispatch({ type: ActionTypes.SET_VOICE_TRANSCRIPTION, payload: transcription }),
    setVoiceLoading: (loading) => dispatch({ type: ActionTypes.SET_VOICE_LOADING, payload: loading }),
    setMarketData: (data) => dispatch({ type: ActionTypes.SET_MARKET_DATA, payload: data }),
    setMarketLoading: (loading) => dispatch({ type: ActionTypes.SET_MARKET_LOADING, payload: loading }),
    setSchemesData: (schemes) => dispatch({ type: ActionTypes.SET_SCHEMES_DATA, payload: schemes }),
    setSchemesLoading: (loading) => dispatch({ type: ActionTypes.SET_SCHEMES_LOADING, payload: loading })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;