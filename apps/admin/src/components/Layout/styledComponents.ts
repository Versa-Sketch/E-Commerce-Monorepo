import styled, { keyframes } from 'styled-components';
import { media } from '@/UI/media';

export const LayoutOuter = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

export const ContentColumn = styled.div<{ $sidebarWidth: number }>`
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth}px;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;

  ${media.tablet`
    margin-left: 0;
  `}
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Main = styled.main`
  flex: 1;
  padding: 28px;
  animation: ${fadeIn} 0.25s ease;
  min-width: 0;

  ${media.tablet`
    padding: 16px;
  `}
`;
