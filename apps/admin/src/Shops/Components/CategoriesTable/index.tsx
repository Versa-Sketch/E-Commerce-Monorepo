import { observer } from 'mobx-react-lite';
import { Star, Trash2 } from 'lucide-react';
import { Table } from '../../../components/Table';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Button';
import { theme } from '../../../UI/theme';
import { useShopTypeCategoriesStore } from '../../Providers/ShopTypeCategoriesProvider';
import type { Column } from '../../../types';
import { CategoryImage, CategoryNameCell, CategoryName, ActionRow } from './styledComponents';

type Row = Record<string, unknown>;

const CategoriesTableComponent = () => {
  const store = useShopTypeCategoriesStore();

  const columns: Column<Row>[] = [
    {
      id: 'col-name',
      key: 'name',
      header: 'Category',
      width: 260,
      render: (v, row) => (
        <CategoryNameCell>
          {row.image ? (
            <CategoryImage src={String(row.image)} alt={String(v)} />
          ) : null}
          <CategoryName>{String(v)}</CategoryName>
        </CategoryNameCell>
      ),
    },
    {
      id: 'col-active',
      key: 'isActive',
      header: 'Status',
      width: 100,
      render: v =>
        v ? <Badge variant="success" dot>Active</Badge> : <Badge variant="danger" dot>Inactive</Badge>,
    },
    {
      id: 'col-actions',
      key: 'mappingId',
      header: '',
      width: 180,
      render: (mappingId, row) => (
        <ActionRow>
          <Button
            size="sm"
            variant="outline"
            icon={(
              <Star
                size={13}
                fill={row.isPrimary ? theme.colors.warning : 'none'}
                color={theme.colors.warning}
              />
            )}
            title={row.isPrimary ? 'Unset Primary' : 'Set Primary'}
            onClick={() => store.updateMapping(String(mappingId), !row.isPrimary)}
          >
            {row.isPrimary ? 'Primary' : 'Standard'}
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 size={13} />}
            onClick={() => store.deleteMapping(String(mappingId))}
          />
        </ActionRow>
      ),
    },
  ];

  const rows = store.categories.map(c => ({ ...c }) as unknown as Row);

  return (
    <Table
      columns={columns}
      data={rows}
      emptyMessage="No categories mapped to this shop type yet."
    />
  );
};

export const CategoriesTable = observer(CategoriesTableComponent);
