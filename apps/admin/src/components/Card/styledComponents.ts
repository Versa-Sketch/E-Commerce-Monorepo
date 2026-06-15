import styled from 'styled-components';

export const CardOuter = styled.div<{ $hover?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  ${({ $hover }) => $hover && `
    &:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.09);
      transform: translateY(-1px);
    }
  `}
`;
