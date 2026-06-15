import styled from 'styled-components';

export const TableOuter = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
`;

export const HeaderRow = styled.tr`
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const HeaderCell = styled.th<{ $sortable?: boolean; $width?: number }>`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
`;

export const HeaderLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const BodyRow = styled.tr<{ $isLast?: boolean }>`
  border-bottom: ${({ $isLast, theme }) => ($isLast ? 'none' : `1px solid ${theme.colors.border}`)};
  transition: background 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.bg};
  }
`;

export const BodyCell = styled.td`
  padding: 13px 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
`;

export const EmptyCell = styled.td`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;
