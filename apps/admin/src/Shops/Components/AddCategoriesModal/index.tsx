import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { useShopTypeCategoriesStore } from '../../Providers/ShopTypeCategoriesProvider';
import { useCategoriesStore } from '../../../Categories/Providers/CategoriesProvider';
import type { MapCategoriesRequestApi } from '../../types/api';
import {
  Form, MappingRow, Select, CheckboxLabel, ErrorText, Footer, FooterActions,
} from './styledComponents';

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyRow = (): MapCategoriesRequestApi => ({ category_id: '', is_primary: false });

const AddCategoriesModalComponent = ({ open, onClose }: Props) => {
  const store = useShopTypeCategoriesStore();
  const categoriesStore = useCategoriesStore();
  const [rows, setRows] = useState<MapCategoriesRequestApi[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) categoriesStore.fetchCategories();
  }, [open, categoriesStore]);

  const mappedIds = new Set(store.categories.map(c => c.id));

  const availableCategories = (index: number) => {
    const chosenElsewhere = new Set(
      rows.filter((_, i) => i !== index).map(r => r.category_id),
    );
    return categoriesStore.categories.filter(
      c => !mappedIds.has(c.id) && !chosenElsewhere.has(c.id),
    );
  };

  const noCategoriesLeft = availableCategories(0).length === 0 && rows.length === 1 && !rows[0].category_id;

  const updateRow = (index: number, patch: Partial<MapCategoriesRequestApi>) => {
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = rows.filter(r => r.category_id.trim());
    if (!valid.length) {
      setError('Enter at least one category ID.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await store.mapCategories(valid);
      setRows([emptyRow()]);
      onClose();
    } catch {
      setError('Failed to map categories. Check for duplicates.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRows([emptyRow()]);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Map Categories" width={560}>
      <Form onSubmit={handleSubmit}>
        {rows.map((row, i) => (
          <MappingRow key={i}>
            <Select
              value={row.category_id}
              onChange={e => updateRow(i, { category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {availableCategories(i).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={row.is_primary}
                onChange={e => updateRow(i, { is_primary: e.target.checked })}
              />
              Primary
            </CheckboxLabel>
            {rows.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                icon={<Trash2 size={13} />}
                onClick={() => removeRow(i)}
              />
            )}
          </MappingRow>
        ))}

        {error && <ErrorText>{error}</ErrorText>}
        {noCategoriesLeft && <ErrorText>All categories are already mapped to this shop type.</ErrorText>}

        <Footer>
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<Plus size={13} />}
            disabled={availableCategories(rows.length).length === 0}
            onClick={() => setRows(prev => [...prev, emptyRow()])}
          >
            Add Row
          </Button>
          <FooterActions>
            <Button type="button" variant="outline" size="md" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading} disabled={noCategoriesLeft}>
              Map Categories
            </Button>
          </FooterActions>
        </Footer>
      </Form>
    </Modal>
  );
};

export const AddCategoriesModal = observer(AddCategoriesModalComponent);
