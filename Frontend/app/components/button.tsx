import React from 'react';

type MyButtonProps = {
  text: string;
  onClick: () => void;
  className?: string;
};

const MyButton: React.FC<MyButtonProps> = ({ text, onClick, className = '' }) => {
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

export default MyButton;
