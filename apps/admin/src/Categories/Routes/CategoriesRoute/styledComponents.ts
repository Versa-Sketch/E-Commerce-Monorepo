import styled, { keyframes } from 'styled-components';
import { media } from '@/UI/media';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const PageOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: #f9fafb;
  min-height: 100vh;

  ${media.mobile`
    padding: 16px;
    gap: 16px;
  `}
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${media.mobile`
    width: 100%;
    button {
      width: 100%;
    }
  `}
`;

/* Analytics Summary Cards */
export const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  ${media.tablet`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.mobile`
    grid-template-columns: 1fr;
  `}
`;

export const AnalyticsCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981, #059669);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01);
    border-color: rgba(16, 185, 129, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
`;

export const CardIconWrapper = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

export const CardLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetricValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3px;
`;

export const MetricTrend = styled.div<{ $positive?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? '#10B981' : '#F59E0B')};
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
`;

/* Smart Table / Card Wrapper */
export const TableOuterCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  overflow: hidden;
`;

export const FiltersRow = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.7);
  flex-wrap: wrap;
  gap: 14px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 280px;

  ${media.mobile`
    width: 100%;
  `}
`;

export const SearchInputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 12px 0 36px;
  background: #f9fafb;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  font-size: 13.5px;
  color: #111827;
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: #ffffff;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
  }
`;

export const FilterActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  ${media.mobile`
    width: 100%;
    justify-content: space-between;
  `}
`;

export const FilterTabs = styled.div`
  display: flex;
  background: #f3f4f6;
  padding: 3px;
  border-radius: 10px;
  border: 1px solid rgba(229, 231, 235, 0.4);
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#111827' : '#4b5563')};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none')};
  transition: all 0.15s;

  &:hover {
    color: #111827;
  }
`;

export const SortSelect = styled.select`
  height: 38px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  font-size: 13px;
  color: #374151;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
  }
`;

export const SecondaryBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

/* Bulk Actions Toolbar */
export const BulkActionsToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #111827;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  margin: 0 20px 16px;
  animation: ${slideDown} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const BulkText = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: #e5e7eb;
`;

export const BulkButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* Premium Table Layout */
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  ${media.tablet`
    display: none;
  `}
`;

export const PremiumTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const THead = styled.thead`
  background: #f9fafb;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
`;

export const Th = styled.th<{ $width?: number }>`
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
`;

export const TBody = styled.tbody`
  tr:last-child {
    border-bottom: none;
  }
`;

export const Tr = styled.tr<{ $selected?: boolean }>`
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  background: ${({ $selected }) => ($selected ? 'rgba(16, 185, 129, 0.015)' : 'transparent')};
  transition: background 0.15s;

  &:hover {
    background: rgba(249, 250, 251, 0.6);
  }
`;

export const Td = styled.td`
  padding: 14px 20px;
  font-size: 13.5px;
  color: #374151;
  vertical-align: middle;
`;

/* Name Cell Design */
export const CategoryNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CategoryIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-size: 16px;
  flex-shrink: 0;
  border: 1px solid rgba(16, 185, 129, 0.1);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CategoryTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CategoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const CategoryDescription = styled.div`
  font-size: 11.5px;
  color: #6b7280;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Inline Edit input */
export const InlineInput = styled.input`
  border: 1px solid #10b981;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  width: 100%;
  max-width: 200px;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
`;

/* Actions dropdown wrapper */
export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 6px;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  z-index: 100;
  min-width: 160px;
  padding: 4px;
  animation: ${slideDown} 0.15s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DropdownItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 13px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? '#EF4444' : '#374151')};
  transition: all 0.15s;

  &:hover {
    background: ${({ $danger }) => ($danger ? 'rgba(239, 68, 68, 0.05)' : 'rgba(243, 244, 246, 0.8)')};
  }
`;

/* Mobile Responsive Card representation */
export const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  padding: 16px;

  ${media.tablet`
    display: flex;
  `}
`;

export const MobileCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MobileCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  padding: 10px 0;
`;

export const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`;

export const MobileCardLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

export const MobileCardValue = styled.span`
  color: #111827;
  font-weight: 600;
`;

export const MobileFAB = styled.button`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px -3px rgba(16, 185, 129, 0.4);
  }
`;

/* Pagination Styles */
export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
  flex-wrap: wrap;
  gap: 12px;

  ${media.mobile`
    justify-content: center;
    flex-direction: column;
  `}
`;

export const PaginationInfo = styled.div`
  font-size: 13px;
  color: #4b5563;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PaginationButton = styled.button`
  border: 1px solid rgba(229, 231, 235, 0.8);
  background: #ffffff;
  color: #374151;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageNumberBtn = styled.button<{ $active: boolean }>`
  border: ${({ $active }) => ($active ? 'none' : '1px solid rgba(229, 231, 235, 0.8)')};
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #10b981, #059669)' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#374151')};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #10b981, #059669)' : '#f9fafb')};
  }
`;

/* Safety confirm Modal */
export const SafetyOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

export const SafetyCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 440px;
  padding: 24px;
  animation: ${slideDown} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const SafetyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dc2626;
  margin-bottom: 12px;
`;

export const SafetyTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const SafetyDesc = styled.p`
  font-size: 13.5px;
  color: #4b5563;
  line-height: 1.45;
  margin: 0 0 20px 0;
`;

export const SafetyActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

/* Toast Alerts manager */
export const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
  width: 100%;
`;

export const Toast = styled.div<{ $type: 'success' | 'danger' | 'info' }>`
  background: #ffffff;
  border-left: 4px solid ${({ $type }) => ($type === 'success' ? '#10b981' : $type === 'danger' ? '#ef4444' : '#3b82f6')};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  animation: ${slideDown} 0.2s ease;
`;

export const ToastText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

/* Command Palette Overlay */
export const CommandOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const CommandBox = styled.div`
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(229, 231, 235, 0.8);
  width: 100%;
  max-width: 560px;
  overflow: hidden;
`;

export const CommandSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  gap: 10px;
`;

export const CommandSearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #111827;
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const CommandList = styled.div`
  max-height: 280px;
  overflow-y: auto;
  padding: 6px;
`;

export const CommandItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? 'rgba(16, 185, 129, 0.05)' : 'transparent')};
  color: ${({ $selected }) => ($selected ? '#10b981' : '#374151')};
  transition: all 0.1s;
`;

export const CommandLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
`;

export const CommandShortcut = styled.div`
  font-size: 11px;
  background: #f3f4f6;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 4px;
  padding: 2px 6px;
  color: #6b7280;
  font-family: monospace;
`;

/* Skeletons */
export const SkeletonCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.7);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 104px;
`;

export const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '16px'};
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const SkeletonTableRow = styled.tr`
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  td {
    padding: 18px 20px;
  }
`;
