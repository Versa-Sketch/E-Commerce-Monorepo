import styled from 'styled-components';
import { media } from '@/UI/media';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const DetailField = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 10px;
  padding: 12px 14px;
`;

export const FieldLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const FieldValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 4px;
`;

export const DisputeBanner = styled.div`
  background: ${({ theme }) => theme.colors.dangerBg};
  border: 1px solid ${({ theme }) => theme.colors.danger}33;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const DisputeTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

export const DisputeMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 2px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
