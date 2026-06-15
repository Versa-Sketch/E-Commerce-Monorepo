import { Pencil, Trash2, ImageIcon } from 'lucide-react';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table/types';
import type { CategoryDomain } from '../../types/domain';
import { ImageThumb, ImagePlaceholder, NameCell, NameText, ActionsRow } from '../CategoriesTable/styledComponents';

export interface SubcategoriesTableProps {
  subcategories: CategoryDomain[];
  onEdit: (subcategory: CategoryDomain) => void;
  onDelete: (id: string) => void;
}

const asRow = (row: Record<string, unknown>) => row as unknown as CategoryDomain;

export const SubcategoriesTable = ({ subcategories, onEdit, onDelete }: SubcategoriesTableProps) => {
  const columns: Column<Record<string, unknown>>[] = [
    {
      id: 'name',
      key: 'name',
      header: 'Subcategory',
      sortable: true,
      render: (_, row) => {
        const s = asRow(row);
        return (
          <NameCell>
            {s.image
              ? <ImageThumb src={s.image} alt={s.name} />
              : <ImagePlaceholder><ImageIcon size={13} /></ImagePlaceholder>
            }
            <NameText>{s.name}</NameText>
          </NameCell>
        );
      },
    },
    {
      id: 'status',
      key: 'isActive',
      header: 'Status',
      width: 110,
      render: (_, row) => {
        const s = asRow(row);
        return s.isActive
          ? <Badge variant="success" dot>Active</Badge>
          : <Badge variant="danger" dot>Inactive</Badge>;
      },
    },
    {
      id: 'actions',
      key: 'id',
      header: '',
      width: 160,
      render: (_, row) => {
        const s = asRow(row);
        return (
          <ActionsRow>
            <Button size="sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => onEdit(s)}>
              Edit
            </Button>
            <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => onDelete(s.id)}>
              Delete
            </Button>
          </ActionsRow>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={subcategories as unknown as Record<string, unknown>[]}
      emptyMessage="No subcategories found."
    />
  );
};
