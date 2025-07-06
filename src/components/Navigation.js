import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Stethoscope, 
  TrendingUp, 
  Building2, 
  User 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from './ui/Button';
import './Navigation.css';

const Navigation = () => {
  const { t } = useTranslation();
  const { state, actions } = useApp();

  const tabs = [
    {
      id: 'diagnosis',
      label: t('navigation.diagnosis'),
      icon: Stethoscope,
      color: '#4ecdc4'
    },
    {
      id: 'market',
      label: t('navigation.market'),
      icon: TrendingUp,
      color: '#ffa726'
    },
    {
      id: 'schemes',
      label: t('navigation.schemes'),
      icon: Building2,
      color: '#9c27b0'
    },
    {
      id: 'profile',
      label: t('navigation.profile'),
      icon: User,
      color: '#667eea'
    }
  ];

  return (
    <nav className="navigation">
      <div className="navigation__container">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = state.activeTab === tab.id;
          
          return (
            <motion.div
              key={tab.id}
              className="navigation__item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={isActive ? 'primary' : 'ghost'}
                size="medium"
                onClick={() => actions.setActiveTab(tab.id)}
                leftIcon={<Icon size={20} />}
                className={`navigation__button ${isActive ? 'navigation__button--active' : ''}`}
                style={{
                  '--tab-color': tab.color
                }}
              >
                <span className="navigation__label">
                  {tab.label}
                </span>
              </Button>
              
              {isActive && (
                <motion.div
                  className="navigation__indicator"
                  layoutId="activeTab"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;