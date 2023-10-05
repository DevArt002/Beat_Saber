import { Button, TextInput } from 'src/components';
import { ICommonComponentProps, TPeerId } from 'src/types';
import React, { FC, FormEvent, useCallback, useState } from 'react';

import clsx from 'clsx';

interface IConnectFormProps extends ICommonComponentProps {
  peerId: string;
  onConnect: (destPeerId: TPeerId) => void;
}

export const ConnectForm: FC<IConnectFormProps> = ({
  className,
  style,
  peerId,
  onConnect,
  ...rest
}) => {
  const [destPeerId, setDestPeerId] = useState<TPeerId>('');

  // Handler for changing dest peer id
  const onChangeDestPeerId = useCallback((val: string) => {
    setDestPeerId(val);
  }, []);

  // Handler for submit
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      onConnect(destPeerId);
    },
    [destPeerId, onConnect],
  );

  return (
    <form
      className={clsx('flex w-96 flex-col gap-4', className)}
      style={style}
      onSubmit={onSubmit}
      {...rest}>
      <p className="text-white">Your peer ID</p>
      <TextInput placeholder="...Wait one moment" value={peerId} readonly />
      <p className="text-white">Destination peer ID</p>
      <TextInput
        placeholder="Input target peer ID, or 'single'"
        value={destPeerId}
        onChange={onChangeDestPeerId}
        autoFocus
      />
      <Button type="submit" disabled={!peerId || !destPeerId}>
        Connect
      </Button>
    </form>
  );
};
