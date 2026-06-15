import styled from 'styled-components';

export const ImageThumb = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ImagePlaceholder = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
`;

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NameText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;
