import React from 'react';
import { Chip } from '@mui/material';

type SmartHivePrimaryBtnXSProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const SmartHivePrimaryBtnXS: React.FC<SmartHivePrimaryBtnXSProps> = ({
  label,
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <Chip
      label={label}
      size="small"
      onClick={disabled ? undefined : onClick}
      clickable={!disabled}
      className={className}
      sx={{
        backgroundColor: '#36916a',
        color: 'white',
        fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#355c4c',
          boxShadow: '0 4px 10px rgba(53, 92, 76, 0.4)',
          transform: 'scale(1.03)',
        },
      }}
    />
  );
};

export default SmartHivePrimaryBtnXS;
