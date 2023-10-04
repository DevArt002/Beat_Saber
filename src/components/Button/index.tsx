import React, { FC, memo } from 'react';

import { ICommonComponentProps } from 'src/types';
import clsx from 'clsx';

interface IButtonProps extends ICommonComponentProps {
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: FC<IButtonProps> = memo(
  ({ className, style, type = 'button', children, disabled = false, onClick, ...rest }) => {
    return (
      <button
        className={clsx(
          'rounded bg-red-400 p-2 text-white',
          disabled ? 'opacity-50' : 'hover:bg-red-500 active:bg-red-600',
          className,
        )}
        type={type}
        style={style}
        onClick={onClick}
        disabled={disabled}
        {...rest}>
        {children}
      </button>
    );
  },
);
