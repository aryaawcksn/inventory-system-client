// src/components/ui/button.jsx
import React from 'react';
import classNames from 'classnames';

export const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 transition-all';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(baseStyle, variants[variant], className, {
        'opacity-50 cursor-not-allowed': disabled,
      })}
    >
      {children}
    </button>
  );
};
