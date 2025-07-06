import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  LogOut, 
  Settings, 
  Globe, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';
import Button from './ui/Button';
import Card from './ui/Card';
import toast from 'react-hot-toast';
import GoogleButton from 'react-google-button';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { state, actions } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      const user = await authService.signInWithGoogle();
      actions.setUser(user);
      toast.success(t('auth.welcome'));
      
      // Load user profile from Firestore
      const profile = await authService.getUserProfile(user.uid);
      if (profile.farmerProfile) {
        actions.updateFarmerProfile(profile.farmerProfile);
        if (profile.farmerProfile.language) {
          actions.setLanguage(profile.farmerProfile.language);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOutUser();
      actions.signOut();
      toast.success('Signed out successfully');
      setShowProfileMenu(false);
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleLanguageChange = (language) => {
    actions.setLanguage(language);
    setShowLanguageMenu(false);
    toast.success(`Language changed to ${language === 'en' ? 'English' : language === 'kn' ? 'ಕನ್ನಡ' : 'हिंदी'}`);
    
    // Update user profile if authenticated
    if (state.user) {
      const updatedProfile = { ...state.farmerProfile, language };
      actions.updateFarmerProfile(updatedProfile);
      authService.updateFarmerProfile(state.user.uid, updatedProfile);
    }
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === state.language);

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <motion.div 
          className="header__logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="header__title">
            🛡️ {t('app.title')}
          </h1>
          <p className="header__subtitle">
            {t('app.subtitle')}
          </p>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="header__nav header__nav--desktop">
          {/* Language Selector */}
          <div className="header__dropdown">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              leftIcon={<Globe size={16} />}
              rightIcon={<ChevronDown size={16} />}
            >
              {currentLanguage?.nativeName}
            </Button>
            
            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  className="header__dropdown-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card variant="glass" padding="none">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        className={`header__dropdown-item ${
                          state.language === language.code ? 'active' : ''
                        }`}
                        onClick={() => handleLanguageChange(language.code)}
                      >
                        {language.nativeName}
                      </button>
                    ))}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authentication */}
          {state.isAuthenticated ? (
            <div className="header__dropdown">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                leftIcon={
                  state.user?.photoURL ? (
                    <img 
                      src={state.user.photoURL} 
                      alt="Profile" 
                      className="header__avatar"
                    />
                  ) : (
                    <User size={16} />
                  )
                }
                rightIcon={<ChevronDown size={16} />}
              >
                {state.user?.displayName || t('auth.profile')}
              </Button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="header__dropdown-menu header__dropdown-menu--right"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card variant="glass" padding="none">
                      <div className="header__profile-info">
                        {state.user?.photoURL && (
                          <img 
                            src={state.user.photoURL} 
                            alt="Profile" 
                            className="header__profile-image"
                          />
                        )}
                        <div>
                          <div className="header__profile-name">
                            {state.user?.displayName}
                          </div>
                          <div className="header__profile-email">
                            {state.user?.email}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="header__dropdown-item"
                        onClick={() => actions.setActiveTab('profile')}
                      >
                        <Settings size={16} />
                        {t('navigation.profile')}
                      </button>
                      
                      <button
                        className="header__dropdown-item header__dropdown-item--danger"
                        onClick={handleSignOut}
                      >
                        <LogOut size={16} />
                        {t('auth.signOut')}
                      </button>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="header__auth">
              <GoogleButton
                onClick={handleSignIn}
                disabled={signingIn}
                style={{ 
                  background: 'transparent',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="small"
          className="header__mobile-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="glass" padding="medium">
              {/* Language Selection */}
              <div className="header__mobile-section">
                <h4>{t('language.select')}</h4>
                <div className="header__language-grid">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      variant={state.language === language.code ? 'primary' : 'ghost'}
                      size="small"
                      onClick={() => {
                        handleLanguageChange(language.code);
                        setShowMobileMenu(false);
                      }}
                    >
                      {language.nativeName}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Authentication */}
              <div className="header__mobile-section">
                {state.isAuthenticated ? (
                  <div className="header__mobile-profile">
                    <div className="header__profile-info">
                      {state.user?.photoURL && (
                        <img 
                          src={state.user.photoURL} 
                          alt="Profile" 
                          className="header__profile-image"
                        />
                      )}
                      <div>
                        <div className="header__profile-name">
                          {state.user?.displayName}
                        </div>
                        <div className="header__profile-email">
                          {state.user?.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="header__mobile-actions">
                      <Button
                        variant="ghost"
                        size="small"
                        leftIcon={<Settings size={16} />}
                        onClick={() => {
                          actions.setActiveTab('profile');
                          setShowMobileMenu(false);
                        }}
                      >
                        {t('navigation.profile')}
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="small"
                        leftIcon={<LogOut size={16} />}
                        onClick={() => {
                          handleSignOut();
                          setShowMobileMenu(false);
                        }}
                      >
                        {t('auth.signOut')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <GoogleButton
                    onClick={() => {
                      handleSignIn();
                      setShowMobileMenu(false);
                    }}
                    disabled={signingIn}
                    style={{ 
                      width: '100%',
                      background: 'transparent',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }}
                  />
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;