import React, { useState, useEffect } from 'react';

interface Props {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export const CurrencyInput: React.FC<Props> = ({ value, onChange, placeholder, style }) => {
  const [displayValue, setDisplayValue] = useState('');

  // Sync external value changes (like initial load)
  useEffect(() => {
    if (value === 0 && !displayValue) {
      setDisplayValue('');
    } else if (value !== undefined) {
      const currentNum = parseFloat(displayValue.replace(/,/g, ''));
      if (currentNum !== value || isNaN(currentNum)) {
        setDisplayValue(new Intl.NumberFormat('en-US').format(value));
      }
    }
  }, [value]); // intentionally not including displayValue to avoid infinite loops

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/,/g, '');
    
    // Allow empty
    if (rawValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(rawValue)) {
      return;
    }

    const num = parseFloat(rawValue);
    if (!isNaN(num)) {
      // Format immediately
      const formatted = new Intl.NumberFormat('en-US').format(num);
      
      // Keep trailing dot if user is typing decimal
      if (rawValue.endsWith('.')) {
        setDisplayValue(formatted + '.');
      } else {
        setDisplayValue(formatted);
      }
      
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (value) {
      setDisplayValue(new Intl.NumberFormat('en-US').format(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      style={style}
    />
  );
};
