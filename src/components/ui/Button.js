import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClass = `
    btn 
    btn--${variant} 
    btn--${size} 
    ${disabled ? 'btn--disabled' : ''} 
    ${loading ? 'btn--loading' : ''} 
    ${className}
  `.trim();

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <div className="btn__spinner">
          <div className="spinner"></div>
        </div>
      )}
      
      {leftIcon && !loading && (
        <span className="btn__icon btn__icon--left">
          {leftIcon}
        </span>
      )}
      
      <span className={`btn__text ${loading ? 'btn__text--hidden' : ''}`}>
        {children}
      </span>
      
      {rightIcon && !loading && (
        <span className="btn__icon btn__icon--right">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;