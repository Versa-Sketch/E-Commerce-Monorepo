import styled from 'styled-components';
import { media } from '@/UI/media';

export const SidebarOuter = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? 68 : 256)}px;
  height: 100vh;
  bottom: 0;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(229, 231, 235, 0.6);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  overflow: hidden;

  ${media.tablet`
    width: 256px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  `}
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateX(${props => (props.$mobileOpen ? '0' : '-100%')});
  }
`;

export const SidebarBackdrop = styled.div<{ $visible: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.2);
  backdrop-filter: blur(4px);
  z-index: 150;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;

  ${media.tablet`
    display: block;
  `}
`;

export const LogoBlock = styled.div<{ $collapsed: boolean }>`
  padding: ${({ $collapsed }) => ($collapsed ? '20px 0' : '20px 20px')};
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  min-height: 65px;
  flex-shrink: 0;
`;

export const LogoMark = styled.div<{ $collapsed: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.deepPrimary});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: ${({ $collapsed }) => ($collapsed ? '16px' : '0')};
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  color: #fff;
`;

export const LogoTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
`;

export const LogoSubtitle = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

export const Nav = styled.nav`
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const NavLinkItem = styled.div<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0' : '10px 14px')};
  border-radius: 12px;
  margin-bottom: 4px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(4, 120, 87, 0.03))' : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  font-size: 13.5px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  text-decoration: none;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(16, 185, 129, 0.12)' : 'transparent')};

  &:hover {
    background: ${({ $active }) => ($active ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(4, 120, 87, 0.04))' : 'rgba(243, 244, 246, 0.7)')};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(${({ $collapsed }) => ($collapsed ? 0 : 3)}px);
  }
`;

export const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
`;

export const NavLabel = styled.span`
  white-space: nowrap;
`;

export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;

export const BottomBlock = styled.div`
  padding: 12px 8px;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
  flex-shrink: 0;
`;

export const BottomButton = styled.button<{ $collapsed: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 0' : '10px 14px')};
  width: 100%;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.textSecondary)};
  font-size: 13.5px;
  font-weight: 500;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  transition: all 0.2s;
  margin-bottom: 2px;

  &:hover {
    background: ${({ $danger, theme }) => ($danger ? theme.colors.dangerBg : 'rgba(243, 244, 246, 0.7)')};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.primary)};
  }
`;

export const UserProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.08);
  border-radius: 12px;
  animation: fadeIn 0.3s ease;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: left;
`;

export const UserProfileName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavSectionTitle = styled.div<{ $collapsed: boolean }>`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: ${({ $collapsed }) => ($collapsed ? '12px 0 4px' : '16px 14px 6px')};
  text-align: ${({ $collapsed }) => ($collapsed ? 'center' : 'left')};
  transition: all 0.2s;
`;

export const HelpCard = styled.div`
  background: rgba(16, 185, 129, 0.03);
  border: 1px solid rgba(16, 185, 129, 0.08);
  border-radius: 12px;
  padding: 12px;
  margin: 10px 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;
  align-items: flex-start;
  text-align: left;
  animation: fadeIn 0.3s ease;
`;

export const HelpCardTitle = styled.div`
  font-size: 12.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const HelpCardSubtitle = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.35;
`;

export const HelpCardButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
    transform: translateY(-1px);
  }
`;


