import React, { ChangeEvent, FC, memo, useCallback } from 'react';

import clsx from 'clsx';
import { ICommonComponentProps } from 'src/types';

interface ITextInputProps extends ICommonComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: FC<ITextInputProps> = memo(
  ({ className, style, value, onChange, ...rest }) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );

    return (
      <input
        className={clsx('', className)}
        style={style}
        value={value}
        onChange={handleChange}
        {...rest}
      />
    );
  },
);
