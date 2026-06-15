import styled from 'styled-components';
import { media } from '@/UI/media';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px;
  background: rgba(249, 250, 251, 0.5);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 12px;

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const Input = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 8px;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: #ffffff;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const ErrorText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 8px;
`;
