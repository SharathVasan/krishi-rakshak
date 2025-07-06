import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, FileText, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Button from './ui/Button';
import './GovernmentSchemes.css';

const GovernmentSchemes = () => {
  const { t } = useTranslation();
  const { state, actions } = useApp();

  const handleFindSchemes = async () => {
    actions.setSchemesLoading(true);
    try {
      // TODO: Implement scheme recommendations
      setTimeout(() => {
        actions.setSchemesData([
          {
            id: 1,
            name: 'PM-KISAN Samman Nidhi',
            description: 'Income support of ₹6000 per year for all farmer families',
            eligibility: 'All farmer families with cultivable land',
            deadline: '31st March 2024',
            amount: '₹6,000/year'
          },
          {
            id: 2,
            name: 'Soil Health Card Scheme',
            description: 'Free soil testing and advisory services',
            eligibility: 'All farmers',
            deadline: 'Ongoing',
            amount: 'Free'
          }
        ]);
      }, 2000);
    } catch (error) {
      console.error('Schemes loading error:', error);
    }
  };

  return (
    <motion.div
      className="government-schemes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="government-schemes__header">
        <h2 className="government-schemes__title">
          <Building2 size={24} />
          {t('schemes.title')}
        </h2>
        <p className="government-schemes__subtitle">
          Discover government schemes and subsidies for farmers
        </p>
      </div>

      <div className="government-schemes__actions">
        <Button
          variant="primary"
          size="large"
          onClick={handleFindSchemes}
          loading={state.schemes.loading}
          leftIcon={<FileText size={20} />}
        >
          {t('schemes.findSchemes')}
        </Button>
      </div>

      {state.schemes.eligibleSchemes.length > 0 && (
        <motion.div
          className="government-schemes__results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="government-schemes__results-title">
            Eligible Schemes for You
          </h3>
          
          <div className="schemes-grid">
            {state.schemes.eligibleSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="solid" padding="large" hover>
                  <div className="scheme-card">
                    <div className="scheme-card__header">
                      <h4 className="scheme-card__title">{scheme.name}</h4>
                      <div className="scheme-card__amount">{scheme.amount}</div>
                    </div>
                    
                    <p className="scheme-card__description">
                      {scheme.description}
                    </p>
                    
                    <div className="scheme-card__details">
                      <div className="scheme-detail">
                        <CheckCircle size={16} />
                        <span>
                          <strong>Eligibility:</strong> {scheme.eligibility}
                        </span>
                      </div>
                      
                      <div className="scheme-detail">
                        <Clock size={16} />
                        <span>
                          <strong>Deadline:</strong> {scheme.deadline}
                        </span>
                      </div>
                    </div>
                    
                    <div className="scheme-card__actions">
                      <Button variant="primary" size="small">
                        {t('schemes.apply')}
                      </Button>
                      <Button variant="ghost" size="small">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="government-schemes__info">
        <Card variant="glass" padding="large">
          <h3>How to Apply for Government Schemes</h3>
          <div className="application-steps">
            <div className="step">
              <div className="step__number">1</div>
              <div className="step__content">
                <h4>Check Eligibility</h4>
                <p>Verify if you meet the scheme requirements</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step__number">2</div>
              <div className="step__content">
                <h4>Gather Documents</h4>
                <p>Collect all required documents and certificates</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step__number">3</div>
              <div className="step__content">
                <h4>Submit Application</h4>
                <p>Apply online or at your nearest agriculture office</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default GovernmentSchemes;