import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ChevronRight, ImageIcon } from 'lucide-react';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { Table } from '../../../components/Table';
import type { Column } from '../../../components/Table/types';
import type { CategoryDomain } from '../../types/domain';
import { ImageThumb, ImagePlaceholder, NameCell, NameText, ActionsRow } from './styledComponents';

export interface CategoriesTableProps {
  categories: CategoryDomain[];
  onEdit: (category: CategoryDomain) => void;
  onDelete: (id: string) => void;
}

const asRow = (row: Record<string, unknown>) => row as unknown as CategoryDomain;

export const CategoriesTable = ({ categories, onEdit, onDelete }: CategoriesTableProps) => {
  const navigate = useNavigate();

  const columns: Column<Record<string, unknown>>[] = [
    {
      id: 'name',
      key: 'name',
      header: 'Category',
      sortable: true,
      render: (_, row) => {
        const c = asRow(row);
        return (
          <NameCell>
            {c.image
              ? <ImageThumb src={c.image} alt={c.name} />
              : <ImagePlaceholder><ImageIcon size={13} /></ImagePlaceholder>
            }
            <NameText>{c.name}</NameText>
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
        const c = asRow(row);
        return c.isActive
          ? <Badge variant="success" dot>Active</Badge>
          : <Badge variant="danger" dot>Inactive</Badge>;
      },
    },
    {
      id: 'actions',
      key: 'id',
      header: '',
      width: 260,
      render: (_, row) => {
        const c = asRow(row);
        return (
          <ActionsRow>
            <Button
              size="sm"
              variant="outline"
              icon={<ChevronRight size={13} />}
              onClick={() => navigate(`/categories/${c.id}/subcategories`, { state: { categoryName: c.name } })}
            >
              Subcategories
            </Button>
            <Button size="sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => onEdit(c)}>
              Edit
            </Button>
            <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => onDelete(c.id)}>
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
      data={categories as unknown as Record<string, unknown>[]}
      emptyMessage="No categories found."
    />
  );
};
