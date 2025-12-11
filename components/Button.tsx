import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-3xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    // Soft Teal / Mint
    primary: "bg-teal-400 text-white hover:bg-teal-500 shadow-lg shadow-teal-100",
    // Soft Lavender
    secondary: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    // Outline
    outline: "border-2 border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50",
    // Soft Red
    danger: "bg-rose-50 text-rose-500 hover:bg-rose-100",
    // Ghost
    ghost: "bg-transparent text-stone-400 hover:bg-stone-100 hover:text-stone-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};