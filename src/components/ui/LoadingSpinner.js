import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'white' }) => {
  const sizeClass = `spinner--${size}`;
  const colorClass = `spinner--${color}`;

  return (
    <div className={`spinner-container ${sizeClass}`}>
      <motion.div
        className={`spinner ${sizeClass} ${colorClass}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;