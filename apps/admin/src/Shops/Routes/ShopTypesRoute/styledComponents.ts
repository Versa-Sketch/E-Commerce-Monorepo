import styled, { keyframes } from 'styled-components';
import { media } from '@/UI/media';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const PageOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${fadeIn} 0.35s ease-out;
  padding: 12px 28px 36px;

  ${media.tablet`
    padding: 8px 16px 24px;
    gap: 16px;
  `}
`;

// Page Header
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding-bottom: 20px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MainTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  ${media.mobile`
    width: 100%;
    & > button {
      flex: 1;
    }
  `}
`;

// Analytics Grid & Cards
export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  ${media.laptop`
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  `}

  ${media.mobile`
    grid-template-columns: 1fr;
    gap: 12px;
  `}
`;

export const AnalyticsCard = styled.div<{ $gradient: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 20px -2px rgba(17, 24, 39, 0.03);
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${({ $gradient }) => $gradient};
    opacity: 0.85;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -4px rgba(16, 185, 129, 0.06), 0 4px 12px -2px rgba(17, 24, 39, 0.03);
    border-color: rgba(16, 185, 129, 0.15);
  }
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const CardIconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CardValue = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.1;
  letter-spacing: -0.03em;
`;

export const CardDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

// Smart Table Elements
export const TableOuterCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 16px;
  box-shadow: 0 4px 20px -2px rgba(17, 24, 39, 0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const FiltersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  gap: 16px;
  flex-wrap: wrap;

  ${media.mobile`
    padding: 12px 14px;
    flex-direction: column;
    align-items: stretch;
  `}
`;

export const FiltersLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 240px;

  ${media.mobile`
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
  `}
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 360px;

  svg {
    position: absolute;
    left: 12px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 13.5px;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  outline: none;
  background: rgba(249, 250, 251, 0.5);
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const TabsList = styled.div`
  display: flex;
  background: rgba(243, 244, 246, 0.6);
  padding: 3px;
  border-radius: 10px;
  border: 1px solid rgba(229, 231, 235, 0.4);
`;

export const TabItem = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.textPrimary : theme.colors.textSecondary)};
  font-size: 12.5px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none')};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FiltersRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${media.mobile`
    justify-content: space-between;
  `}
`;

export const BulkActionsContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  padding: 10px 16px;
  margin: 0 20px;
  margin-top: 14px;
  justify-content: space-between;
  animation: ${slideDown} 0.2s ease-out;

  ${media.mobile`
    margin: 10px 12px 0;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  `}
`;

export const SelectedCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepPrimary};
`;

export const BulkButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  ${media.mobile`
    width: 100%;
    justify-content: flex-end;
  `}
`;

// Responsive Table Layout
export const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;

  ${media.tablet`
    display: none; // Hide actual table on mobile/tablet, show card layouts
  `}
`;

export const PremiumTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const THead = styled.thead`
  background: rgba(249, 250, 251, 0.7);
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Th = styled.th<{ $width?: number; $sortable?: boolean }>`
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;

  &:hover {
    color: ${({ $sortable, theme }) => ($sortable ? theme.colors.primary : 'inherit')};
  }
`;

export const TBody = styled.tbody`
  & > tr {
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const Tr = styled.tr<{ $selected?: boolean }>`
  background: ${({ $selected }) => ($selected ? 'rgba(16, 185, 129, 0.02)' : 'transparent')};
  transition: background 0.15s;

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(16, 185, 129, 0.03)' : 'rgba(249, 250, 251, 0.7)')};
  }
`;

export const Td = styled.td`
  padding: 14px 20px;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  vertical-align: middle;
`;

export const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid rgba(156, 163, 175, 0.6);
  outline: none;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Badges
export const StatusIndicator = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${({ $active }) => ($active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.08)')};
  color: ${({ $active, theme }) => ($active ? theme.colors.deepPrimary : theme.colors.danger)};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)')};
`;

export const StatusDot = styled.span<{ $active: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.danger)};
  box-shadow: 0 0 6px ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.danger)};
`;

// Actions Dropdown
export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownTrigger = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: rgba(243, 244, 246, 0.8);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.75);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  width: 170px;
  z-index: 50;
  padding: 4px;
  animation: ${slideDown} 0.15s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.textPrimary)};
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s;

  &:hover {
    background: ${({ $danger, theme }) => ($danger ? theme.colors.dangerBg : 'rgba(243, 244, 246, 0.8)')};
  }
`;

// Inline Editing styled
export const InlineWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InlineInput = styled.input`
  padding: 4px 8px;
  font-size: 13.5px;
  font-weight: 600;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  outline: none;
  width: 150px;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
`;

// Pagination
export const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
  background: rgba(249, 250, 251, 0.2);

  ${media.mobile`
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  `}
`;

export const PaginationInfo = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const PaginationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Mobile Cards Layout
export const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  background: rgba(249, 250, 251, 0.4);

  ${media.tablet`
    display: flex;
  `}
`;

export const MobileCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
`;

export const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MobileCardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: rgba(249, 250, 251, 0.5);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(229, 231, 235, 0.3);
`;

export const MobileLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MobileValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// FAB (Floating Action Button) for Mobile
export const FloatingActionButton = styled.button`
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.deepPrimary});
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.92);
  }

  ${media.tablet`
    display: flex;
  `}
`;

// Empty State
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(16, 185, 129, 0.05);
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 6px;
`;

export const EmptySubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 300px;
  margin: 0;
`;

// Skeleton loaders
export const SkeletonCard = styled.div`
  background: #fff;
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 16px;
  padding: 20px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

export const SkeletonLine = styled.div<{ $width: string; $height: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  background: rgba(229, 231, 235, 0.7);
  border-radius: 6px;
`;

export const SkeletonTableRow = styled.tr`
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

// Command Palette
export const CmdPaletteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.25);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const CmdPaletteModal = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 16px;
  box-shadow: 0 24px 48px -12px rgba(17, 24, 39, 0.12), 0 8px 16px -8px rgba(17, 24, 39, 0.05);
  width: 100%;
  max-width: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const CmdPaletteSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  gap: 10px;
  background: rgba(249, 250, 251, 0.5);
`;

export const CmdInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const CmdBadge = styled.span`
  background: rgba(243, 244, 246, 0.9);
  border: 1px solid rgba(229, 231, 235, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: monospace;
`;

export const CmdList = styled.div`
  max-height: 280px;
  overflow-y: auto;
  padding: 8px;
`;

export const CmdGroupTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 6px 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CmdItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? 'rgba(16, 185, 129, 0.05)' : 'transparent')};
  color: ${({ $selected, theme }) => ($selected ? theme.colors.primary : theme.colors.textPrimary)};
  font-size: 13.5px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  transition: all 0.15s;

  &:hover {
    background: rgba(16, 185, 129, 0.05);
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CmdItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Toast Notification styling
export const ToastWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 320px;
  pointer-events: none;
`;

export const ToastAlert = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  pointer-events: auto;
  background: #ffffff;
  border-left: 4px solid ${({ $type, theme }) => {
    if ($type === 'success') return theme.colors.primary;
    if ($type === 'error') return theme.colors.danger;
    return theme.colors.info;
  }};
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.04);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  animation: ${slideDown} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const ToastText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ToastClose = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  padding: 2px;
  border-radius: 4px;
  &:hover {
    background: rgba(243, 244, 246, 0.8);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

// Delete Safety confirmation modal
export const ConfirmBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
`;

export const ConfirmHeading = styled.h4`
  font-size: 14.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

export const ConfirmText = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

export const DangerWarning = styled.div`
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.12);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
