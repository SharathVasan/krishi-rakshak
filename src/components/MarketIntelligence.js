import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from './ui/Card';
import Button from './ui/Button';
import './MarketIntelligence.css';

const MarketIntelligence = () => {
  const { t } = useTranslation();
  const { state, actions } = useApp();

  const handleGetMarketAnalysis = async () => {
    actions.setMarketLoading(true);
    try {
      // TODO: Implement market analysis
      setTimeout(() => {
        actions.setMarketData({
          crop: 'Tomato',
          currentPrice: '₹25/kg',
          trend: 'up',
          recommendation: 'Good time to sell'
        });
      }, 2000);
    } catch (error) {
      console.error('Market analysis error:', error);
    }
  };

  return (
    <motion.div
      className="market-intelligence"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="market-intelligence__header">
        <h2 className="market-intelligence__title">
          <TrendingUp size={24} />
          {t('market.title')}
        </h2>
        <p className="market-intelligence__subtitle">
          Real-time market insights for better farming decisions
        </p>
      </div>

      <div className="market-intelligence__grid">
        <Card variant="glass" padding="large" hover>
          <div className="market-card">
            <div className="market-card__header">
              <BarChart3 size={20} />
              <span>{t('market.trends')}</span>
            </div>
            <div className="market-card__content">
              <p>Get real-time market trends and price predictions</p>
              <Button
                variant="primary"
                onClick={handleGetMarketAnalysis}
                loading={state.market.loading}
              >
                {t('market.getAnalysis')}
              </Button>
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="large" hover>
          <div className="market-card">
            <div className="market-card__header">
              <MapPin size={20} />
              <span>{t('market.nearbyMarkets')}</span>
            </div>
            <div className="market-card__content">
              <p>Find the best markets near you with competitive prices</p>
              <Button variant="secondary">
                Find Markets
              </Button>
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="large" hover>
          <div className="market-card">
            <div className="market-card__header">
              <Clock size={20} />
              <span>{t('market.bestTime')}</span>
            </div>
            <div className="market-card__content">
              <p>AI-powered recommendations for optimal selling time</p>
              <Button variant="warning">
                Get Timing
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {state.market.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="market-intelligence__results"
        >
          <Card variant="solid" padding="large">
            <h3>Market Analysis Results</h3>
            <div className="market-results">
              <div className="market-result-item">
                <strong>Crop:</strong> {state.market.data.crop}
              </div>
              <div className="market-result-item">
                <strong>Current Price:</strong> {state.market.data.currentPrice}
              </div>
              <div className="market-result-item">
                <strong>Recommendation:</strong> {state.market.data.recommendation}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MarketIntelligence;