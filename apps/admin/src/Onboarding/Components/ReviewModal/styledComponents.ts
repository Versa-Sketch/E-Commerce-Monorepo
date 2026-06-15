import styled from 'styled-components';
import { media } from '@/UI/media';

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InfoValue = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const ActionBtn = styled.button<{ $variant: 'approve' | 'reject'; $active: boolean }>`
  flex: 1;
  height: 42px;
  border-radius: 9px;
  border: 1.5px solid;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  ${({ $variant, $active }) =>
    $variant === 'approve'
      ? `
    border-color: ${$active ? '#10b981' : '#d1fae5'};
    background: ${$active ? '#10b981' : 'transparent'};
    color: ${$active ? '#fff' : '#10b981'};
  `
      : `
    border-color: ${$active ? '#ef4444' : '#fee2e2'};
    background: ${$active ? '#ef4444' : 'transparent'};
    color: ${$active ? '#fff' : '#ef4444'};
  `}
`;

export const ReasonLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  margin-bottom: 6px;
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
