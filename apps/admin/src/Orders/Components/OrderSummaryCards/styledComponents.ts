import styled from 'styled-components';
import { Card } from '../../../components/Card';

export const SummaryRow = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled(Card)`
  flex: 1;
  min-width: 140px;
  text-align: center;
  padding: 16px;
`;

export const SummaryValue = styled.div<{ $color: string }>`
  font-size: 26px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

export const SummaryLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
