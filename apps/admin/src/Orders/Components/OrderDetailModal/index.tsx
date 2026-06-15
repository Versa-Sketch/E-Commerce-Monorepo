import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { useTheme } from 'styled-components';
import type { OrderModel } from '../../Models/OrderModel';
import {
  Body, DetailGrid, DetailField, FieldLabel, FieldValue,
  DisputeBanner, DisputeTitle, DisputeMessage, Actions,
} from './styledComponents';

export interface OrderDetailModalProps {
  order: OrderModel | null;
  onClose: () => void;
  onIssueRefund: (orderId: string) => void;
}

export const OrderDetailModal = ({ order, onClose, onIssueRefund }: OrderDetailModalProps) => {
  const theme = useTheme();

  const fields = order ? [
    ['Customer', order.getCustomerName()],
    ['Store', order.getStoreName()],
    ['City', order.getCity()],
    ['Payment', order.getPaymentMethod()],
    ['Items', String(order.getItems())],
    ['Amount', order.getFormattedAmount()],
    ['Date', order.getFormattedDate()],
    ['Status', order.getStatusLabel()],
  ] : [];

  return (
    <Modal open={!!order} onClose={onClose} title={`Order ${order?.getId() ?? ''}`} width={520}>
      {order && (
        <Body>
          <DetailGrid>
            {fields.map(([label, value]) => (
              <DetailField key={label}>
                <FieldLabel>{label}</FieldLabel>
                <FieldValue>{value}</FieldValue>
              </DetailField>
            ))}
          </DetailGrid>
          {order.hasDispute() && (
            <DisputeBanner>
              <AlertTriangle size={16} color={theme.colors.danger} />
              <div>
                <DisputeTitle>Open Dispute</DisputeTitle>
                <DisputeMessage>Customer has raised a dispute for this order.</DisputeMessage>
              </div>
            </DisputeBanner>
          )}
          <Actions>
            <Button variant="outline" onClick={onClose}>Close</Button>
            {order.hasDispute() && (
              <Button variant="primary" icon={<RefreshCw size={14} />} onClick={() => onIssueRefund(order.getId())}>
                Issue Refund &amp; Resolve
              </Button>
            )}
          </Actions>
        </Body>
      )}
    </Modal>
  );
};
