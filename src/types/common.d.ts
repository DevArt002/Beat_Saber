import { CSSProperties } from 'react';

// Common props for components
export interface ICommonComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

// Generic object
export interface IGenericObject<T> {
  [key: string]: T;
}
