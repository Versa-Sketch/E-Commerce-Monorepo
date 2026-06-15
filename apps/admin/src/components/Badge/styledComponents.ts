import styled, { css } from 'styled-components';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

const variantStyles = {
  success: css`
    background: ${({ theme }) => theme.colors.successBg};
    color: #059669;
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningBg};
    color: ${({ theme }) => theme.colors.secondaryHover};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerBg};
    color: #DC2626;
  `,
  info: css`
    background: ${({ theme }) => theme.colors.infoBg};
    color: #2563EB;
  `,
  neutral: css`
    background: #F3F4F6;
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.successBg};
    color: ${({ theme }) => theme.colors.primary};
  `,
} satisfies Record<BadgeVariant, ReturnType<typeof css>>;

export const BadgeOuter = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant]}
`;

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  background: currentColor;
`;
