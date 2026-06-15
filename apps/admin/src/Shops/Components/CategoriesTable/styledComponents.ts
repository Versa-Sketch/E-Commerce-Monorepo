import styled from 'styled-components';

export const CategoryImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const CategoryNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CategoryName = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 6px;
`;
