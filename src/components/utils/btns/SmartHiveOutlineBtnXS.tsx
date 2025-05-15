import React from 'react';
import { Chip } from '@mui/material';

type SmartHiveOutlineBtnXSProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

const SmartHiveOutlineBtnXS: React.FC<SmartHiveOutlineBtnXSProps> = ({
  label,
  onClick,
  className = '',
}) => {
  return (
    <Chip
      label={label}
      size="small"
      onClick={onClick}
      clickable
      className={className}
      sx={{
        backgroundColor: 'white',
        color: '#36916a',
        border: '1px solid #36916a',
        fontWeight: 500,
        '&:hover': {
          backgroundColor: '#355c4c',
          color: 'white',
          border: '1px solid #355c4c',
          cursor: 'pointer',
        },
      }}
    />
  );
};

export default SmartHiveOutlineBtnXS;
