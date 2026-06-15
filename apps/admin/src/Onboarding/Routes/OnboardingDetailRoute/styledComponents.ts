import styled from 'styled-components';

export const PageOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: background 0.12s;
  &:hover { background: ${({ theme }) => theme.colors.bg}; }
`;

export const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.3px;
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const CardFull = styled(Card)`
  grid-column: 1 / -1;
`;

export const CardHeader = styled.div`
  padding: 13px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 11.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InfoValue = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-all;
`;

export const InfoValueMono = styled(InfoValue)`
  font-family: monospace;
  font-size: 12px;
`;

export const EmptyValue = styled.span`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

export const DocGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

export const DocItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DocLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DocImg = styled.a`
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.15s;
  }

  &:hover img { opacity: 0.85; }
`;

export const DocEmpty = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StepsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StepPill = styled.span<{ $done: boolean }>`
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${({ $done, theme }) => $done ? '#ecfdf5' : theme.colors.bg};
  color: ${({ $done, theme }) => $done ? '#059669' : theme.colors.textMuted};
  border: 1px solid ${({ $done, theme }) => $done ? '#a7f3d0' : theme.colors.border};
`;

export const ReviewSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

export const ReviewTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  max-width: 380px;
`;

export const ActionBtn = styled.button<{ $variant: 'approve' | 'reject'; $active: boolean }>`
  flex: 1;
  height: 42px;
  border-radius: 9px;
  border: 1.5px solid;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  ${({ $variant, $active }) =>
    $variant === 'approve'
      ? `border-color: ${$active ? '#10b981' : '#d1fae5'}; background: ${$active ? '#10b981' : 'transparent'}; color: ${$active ? '#fff' : '#10b981'};`
      : `border-color: ${$active ? '#ef4444' : '#fee2e2'}; background: ${$active ? '#ef4444' : 'transparent'}; color: ${$active ? '#fff' : '#ef4444'};`}
`;

export const ReasonLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: block;
  margin-bottom: 6px;
`;

export const ReasonTextarea = styled.textarea`
  width: 100%;
  max-width: 480px;
  min-height: 80px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 16px;
  box-sizing: border-box;
  &:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export const ErrorText = styled.p`
  font-size: 13px;
  color: #ef4444;
  margin: 0 0 12px;
`;

export const SuccessText = styled.p`
  font-size: 14px;
  color: #059669;
  font-weight: 500;
  margin: 0;
`;
