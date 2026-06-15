import { Eye } from 'lucide-react';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table/types';
import { OrderModel } from '../../Models/OrderModel';
import { NoDispute } from './styledComponents';

export interface OrdersTableProps {
  orders: OrderModel[];
  onView: (order: OrderModel) => void;
}

const asModel = (row: Record<string, unknown>) => row as unknown as OrderModel;

export const OrdersTable = ({ orders, onView }: OrdersTableProps) => {
  const columns: Column<Record<string, unknown>>[] = [
    { id: 'orderId', key: 'id', header: 'Order ID', width: 110, sortable: true, render: (_, row) => asModel(row).getId() },
    { id: 'customer', key: 'customer', header: 'Customer', width: 150, sortable: true, render: (_, row) => asModel(row).getCustomerName() },
    { id: 'store', key: 'store', header: 'Store', width: 160, sortable: true, render: (_, row) => asModel(row).getStoreName() },
    { id: 'status', key: 'status', header: 'Status', width: 150, render: (_, row) => (
      <Badge variant={asModel(row).getStatusVariant()} dot>{asModel(row).getStatusLabel()}</Badge>
    ) },
    { id: 'amount', key: 'amount', header: 'Amount', width: 100, sortable: true, render: (_, row) => asModel(row).getFormattedAmount() },
    { id: 'payment', key: 'payment', header: 'Payment', width: 110, render: (_, row) => asModel(row).getPaymentMethod() },
    { id: 'items', key: 'items', header: 'Items', width: 60, render: (_, row) => String(asModel(row).getItems()) },
    { id: 'dispute', key: 'hasDispute', header: 'Dispute', width: 90, render: (_, row) =>
      asModel(row).hasDispute() ? <Badge variant="danger" dot>Open</Badge> : <NoDispute>—</NoDispute>
    },
    { id: 'date', key: 'date', header: 'Date', width: 100, render: (_, row) => asModel(row).getFormattedDate() },
    { id: 'view', key: 'view', header: '', width: 80, render: (_, row) => (
      <Button size="sm" variant="ghost" icon={<Eye size={13} />} onClick={() => onView(asModel(row))}>View</Button>
    ) },
  ];

  return <Table columns={columns} data={orders as unknown as Record<string, unknown>[]} emptyMessage="No orders found." />;
};
