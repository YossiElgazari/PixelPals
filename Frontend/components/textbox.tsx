import React from 'react';

type TextboxProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Textbox: React.FC<TextboxProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
}) => {
  const style = {
    border: '2px solid #e91e63', // Pink border color
    borderRadius: '5px',
    padding: '8px',
    // Add more styles as needed
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`textbox ${className}`}
      style={style}
    />
  );
};

export default Textbox;
