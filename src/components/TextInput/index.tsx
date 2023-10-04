import React, { ChangeEvent, FC, memo, useCallback } from 'react';

import { ICommonComponentProps } from 'src/types';
import clsx from 'clsx';

interface ITextInputProps extends ICommonComponentProps {
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  value: string;
  disabled?: boolean;
  autoFocus?: boolean;
  readonly?: boolean;
  onChange?: (value: string) => void;
}

export const TextInput: FC<ITextInputProps> = memo(
  ({
    className,
    style,
    type = 'text',
    placeholder = '',
    value,
    disabled = false,
    autoFocus = false,
    readonly = false,
    onChange,
    ...rest
  }) => {
    // Handler of input change
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
      },
      [onChange],
    );

    return (
      <input
        className={clsx('outline-none rounded p-2', disabled && 'opacity-50', className)}
        type={type}
        style={style}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        readOnly={readonly}
        {...rest}
      />
    );
  },
);
