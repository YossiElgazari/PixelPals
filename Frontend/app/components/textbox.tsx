import React from 'react';

type MyTextboxProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const MyTextbox: React.FC<MyTextboxProps> = ({
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

export default MyTextbox;
