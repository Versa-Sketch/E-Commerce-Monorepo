import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Overlay, Panel, Header, Title, CloseButton, Body } from './styledComponents';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export const Modal = ({ open, onClose, title, children, width = 520 }: ModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel $width={width} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>
            <X size={15} />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Overlay>
  );
};
