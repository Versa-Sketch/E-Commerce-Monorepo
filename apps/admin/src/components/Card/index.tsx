import type { HTMLAttributes } from 'react';
import { CardOuter } from './styledComponents';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ hover, children, ...props }: CardProps) => (
  <CardOuter $hover={hover} {...props}>
    {children}
  </CardOuter>
);
