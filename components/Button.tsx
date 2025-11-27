import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-medium transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-amber-400 hover:bg-amber-500 text-black px-6 py-2 rounded-sm text-sm font-bold uppercase",
    secondary: "bg-transparent text-amber-400 border border-amber-400 hover:bg-amber-400 hover:text-black px-4 py-2 rounded-sm",
    icon: "p-2 bg-slate-800 border border-slate-700 text-red-500 hover:bg-slate-700 hover:text-red-400 transition-colors"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};