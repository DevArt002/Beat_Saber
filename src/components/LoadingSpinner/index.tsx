import React, { FC, HTMLAttributes } from 'react';

import { LoadingIcon } from 'src/components';
import clsx from 'clsx';

interface ILoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {}

export const LoadingSpinner: FC<ILoadingSpinnerProps> = ({ className, style, ...rest }) => {
  return (
    <div className={clsx('', className)} style={style} {...rest}>
      <LoadingIcon className="animate-spin text-white" width={100} height={100} />
    </div>
  );
};
