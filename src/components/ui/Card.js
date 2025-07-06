import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  className = '',
  padding = 'medium',
  hover = true,
  onClick,
  ...props
}) => {
  const cardClass = `
    card 
    card--${variant} 
    card--padding-${padding}
    ${hover ? 'card--hover' : ''}
    ${onClick ? 'card--clickable' : ''}
    ${className}
  `.trim();

  const cardProps = {
    className: cardClass,
    onClick,
    ...props
  };

  if (hover || onClick) {
    return (
      <motion.div
        {...cardProps}
        whileHover={hover ? { y: -4, scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};

export default Card;