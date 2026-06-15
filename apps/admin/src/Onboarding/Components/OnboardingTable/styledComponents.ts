import styled from 'styled-components';

export const PhoneText = styled.span`
  font-family: monospace;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const BusinessTypePill = styled.span`
  font-size: 11.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 2px 8px;
  text-transform: capitalize;
`;

export const DateText = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StepText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: monospace;
`;
