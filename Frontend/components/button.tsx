import React from 'react';

type ButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ text, onClick, className = '' }) => {
  const style = {
    backgroundColor: '#e91e63', // Pink color
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    // Add more styles as needed
  };

  return (
    <button onClick={onClick} className={`button ${className}`} style={style}>
      {text}
    </button>
  );
};

export default Button;
