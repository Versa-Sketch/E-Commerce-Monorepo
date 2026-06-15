import type { ReactNode } from 'react';
import { BadgeOuter, Dot, type BadgeVariant } from './styledComponents';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
}

export const Badge = ({ variant = 'neutral', children, dot }: BadgeProps) => (
  <BadgeOuter $variant={variant}>
    {dot && <Dot />}
    {children}
  </BadgeOuter>
);
