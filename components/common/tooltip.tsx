import React from 'react';

interface TooltipButtonProps {
  label: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  children,
  position = 'bottom',
}) => {
  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return '-top-9 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-[-110%] top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      default:
        return '-top-9 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className="relative group inline-block">
      <div>
        {children}
      </div>

      <div
        className={`absolute ${getTooltipPosition()} whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10`}
      >
        {label}
      </div>
    </div>
  );
};

export default TooltipButton;
