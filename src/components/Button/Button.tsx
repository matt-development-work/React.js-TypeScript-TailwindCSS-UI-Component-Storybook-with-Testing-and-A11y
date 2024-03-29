import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick: () => void;
  round?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onClick, round, variant = 'contained', ...props }, ref) => {
    // TODO: Move class names to stories file or theme
    const color: string = 'green';
    const classes: { [key: string]: string } = {
      contained: `bg-${color}-700 hover:brightness-90 shadow-md hover:shadow-xl text-white`,
      outlined: `border border-${color}-500 hover:bg-${color}-100`,
      text: `hover:bg-${color}-100`,
    };
    return (
      <button
        className={`${classes[variant]}${
          round ? ' rounded-full h-8 w-8' : ''
        } p-2 transition ease-in-out duration-300 filter cursor-pointer flex justify-center items-center select-none focus:outline-none focus-visible`}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
