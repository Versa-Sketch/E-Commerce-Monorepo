import styled from 'styled-components';

export const PageOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  overflow: hidden;
`;

export const ToolbarRow = styled.div`
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 12px;
`;

export const ToolbarTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ToolbarTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const StatusSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bg};
  outline: none;
  cursor: pointer;
`;
