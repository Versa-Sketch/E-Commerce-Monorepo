import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonBase, Spinner, type ButtonVariant, type ButtonSize } from './styledComponents';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary', size = 'md', icon, loading, children, ...props
}: ButtonProps) => (
  <ButtonBase {...props} $variant={variant} $size={size} disabled={props.disabled || loading}>
    {loading ? <Spinner /> : icon}
    {children}
  </ButtonBase>
);
