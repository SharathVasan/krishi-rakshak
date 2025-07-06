import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  MapPin, 
  Crop, 
  Calendar, 
  Phone, 
  Edit3, 
  Save,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';
import Card from './ui/Card';
import Button from './ui/Button';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const { state, actions } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(state.farmerProfile);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(state.farmerProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(state.farmerProfile);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update local state
      actions.updateFarmerProfile(formData);
      
      // Update in Firebase if user is authenticated
      if (state.user) {
        await authService.updateFarmerProfile(state.user.uid, formData);
      }
      
      setIsEditing(false);
      toast.success(t('profile.save') + ' successful!');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error('Profile save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const cropOptions = [
    { value: 'rice', label: t('crops.rice') },
    { value: 'wheat', label: t('crops.wheat') },
    { value: 'maize', label: t('crops.maize') },
    { value: 'tomato', label: t('crops.tomato') },
    { value: 'onion', label: t('crops.onion') },
    { value: 'potato', label: t('crops.potato') },
    { value: 'sugarcane', label: t('crops.sugarcane') },
    { value: 'cotton', label: t('crops.cotton') },
    { value: 'mixed', label: t('crops.mixed') }
  ];

  const farmSizeOptions = [
    { value: 'small', label: t('farmSize.small') },
    { value: 'medium', label: t('farmSize.medium') },
    { value: 'large', label: t('farmSize.large') }
  ];

  const experienceOptions = [
    { value: '0-5', label: '0-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-20', label: '10-20 years' },
    { value: '20+', label: '20+ years' }
  ];

  return (
    <motion.div
      className="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile__header">
        <h2 className="profile__title">
          <User size={24} />
          {t('profile.title')}
        </h2>
        
        {!isEditing && (
          <Button
            variant="primary"
            leftIcon={<Edit3 size={16} />}
            onClick={handleEdit}
          >
            {t('profile.edit')}
          </Button>
        )}
      </div>

      <div className="profile__content">
        {/* User Info Card */}
        {state.user && (
          <Card variant="glass" padding="large" className="profile__user-card">
            <div className="profile__user-info">
              <div className="profile__avatar">
                {state.user.photoURL ? (
                  <img 
                    src={state.user.photoURL} 
                    alt="Profile"
                    className="profile__avatar-image"
                  />
                ) : (
                  <div className="profile__avatar-placeholder">
                    <User size={40} />
                  </div>
                )}
                <button className="profile__avatar-edit">
                  <Camera size={16} />
                </button>
              </div>
              
              <div className="profile__user-details">
                <h3 className="profile__user-name">
                  {state.user.displayName || 'Farmer'}
                </h3>
                <p className="profile__user-email">
                  {state.user.email}
                </p>
                {state.user.phoneNumber && (
                  <p className="profile__user-phone">
                    <Phone size={16} />
                    {state.user.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Farmer Profile Card */}
        <Card variant="glass" padding="large" className="profile__farmer-card">
          <h3 className="profile__section-title">
            {t('profile.title')} Details
          </h3>
          
          {isEditing ? (
            <motion.div
              className="profile__form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="profile__form-grid">
                <div className="profile__form-group">
                  <label className="profile__label">
                    <MapPin size={16} />
                    {t('profile.location')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                    className="profile__input"
                  />
                </div>

                <div className="profile__form-group">
                  <label className="profile__label">
                    <Crop size={16} />
                    {t('profile.farmSize')}
                  </label>
                  <select
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                    className="profile__select"
                  >
                    {farmSizeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="profile__form-group">
                  <label className="profile__label">
                    <Crop size={16} />
                    {t('profile.crops')}
                  </label>
                  <select
                    value={formData.crops[0] || 'mixed'}
                    onChange={(e) => handleInputChange('crops', [e.target.value])}
                    className="profile__select"
                  >
                    {cropOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="profile__form-group">
                  <label className="profile__label">
                    <Calendar size={16} />
                    {t('profile.experience')}
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="profile__select"
                  >
                    <option value="">Select experience</option>
                    {experienceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="profile__form-group profile__form-group--full">
                  <label className="profile__label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                    className="profile__input"
                  />
                </div>
              </div>

              <div className="profile__form-actions">
                <Button
                  variant="success"
                  leftIcon={<Save size={16} />}
                  onClick={handleSave}
                  loading={saving}
                >
                  {t('common.save')}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="profile__display">
              <div className="profile__display-grid">
                <div className="profile__display-item">
                  <div className="profile__display-label">
                    <MapPin size={16} />
                    {t('profile.location')}
                  </div>
                  <div className="profile__display-value">
                    {state.farmerProfile.location || 'Not specified'}
                  </div>
                </div>

                <div className="profile__display-item">
                  <div className="profile__display-label">
                    <Crop size={16} />
                    {t('profile.farmSize')}
                  </div>
                  <div className="profile__display-value">
                    {farmSizeOptions.find(opt => opt.value === state.farmerProfile.farmSize)?.label || 'Not specified'}
                  </div>
                </div>

                <div className="profile__display-item">
                  <div className="profile__display-label">
                    <Crop size={16} />
                    {t('profile.crops')}
                  </div>
                  <div className="profile__display-value">
                    {cropOptions.find(opt => opt.value === state.farmerProfile.crops[0])?.label || 'Not specified'}
                  </div>
                </div>

                <div className="profile__display-item">
                  <div className="profile__display-label">
                    <Calendar size={16} />
                    {t('profile.experience')}
                  </div>
                  <div className="profile__display-value">
                    {experienceOptions.find(opt => opt.value === state.farmerProfile.experience)?.label || 'Not specified'}
                  </div>
                </div>

                {state.farmerProfile.phoneNumber && (
                  <div className="profile__display-item">
                    <div className="profile__display-label">
                      <Phone size={16} />
                      Phone Number
                    </div>
                    <div className="profile__display-value">
                      {state.farmerProfile.phoneNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Statistics Card */}
        <Card variant="glass" padding="large" className="profile__stats-card">
          <h3 className="profile__section-title">
            Your Farming Journey
          </h3>
          
          <div className="profile__stats">
            <div className="profile__stat">
              <div className="profile__stat-number">12</div>
              <div className="profile__stat-label">Diagnoses</div>
            </div>
            
            <div className="profile__stat">
              <div className="profile__stat-number">5</div>
              <div className="profile__stat-label">Market Queries</div>
            </div>
            
            <div className="profile__stat">
              <div className="profile__stat-number">3</div>
              <div className="profile__stat-label">Schemes Applied</div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;