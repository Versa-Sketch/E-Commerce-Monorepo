import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { useShopTypesStore } from '../../Providers/ShopTypesProvider';
import { Form, Row, Input, ErrorText, Footer, FooterActions } from './styledComponents';

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyRow = () => ({ name: '', description: '' });

export const CreateShopTypeModal = ({ open, onClose }: Props) => {
  const store = useShopTypesStore();
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateRow = (i: number, patch: Partial<{ name: string; description: string }>) => {
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = rows.filter(r => r.name.trim());
    if (!valid.length) { setError('Enter at least one name.'); return; }
    setError(null);
    setLoading(true);
    try {
      await store.createShopTypes(valid);
      setRows([emptyRow()]);
      onClose();
    } catch {
      setError('Failed to create shop types.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setRows([emptyRow()]); setError(null); onClose(); };

  return (
    <Modal open={open} onClose={handleClose} title="Create Shop Types" width={580}>
      <Form onSubmit={handleSubmit}>
        {rows.map((row, i) => (
          <Row key={i}>
            <Input
              placeholder="Name (e.g. Grocery)"
              value={row.name}
              onChange={e => updateRow(i, { name: e.target.value })}
            />
            <Input
              placeholder="Description (optional)"
              value={row.description}
              onChange={e => updateRow(i, { description: e.target.value })}
            />
            {rows.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                icon={<Trash2 size={13} />}
                onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
              />
            )}
          </Row>
        ))}

        {error && <ErrorText>{error}</ErrorText>}

        <Footer>
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<Plus size={13} />}
            onClick={() => setRows(prev => [...prev, emptyRow()])}
          >
            Add Row
          </Button>
          <FooterActions>
            <Button type="button" variant="outline" size="md" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>Create</Button>
          </FooterActions>
        </Footer>
      </Form>
    </Modal>
  );
};
