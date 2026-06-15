import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { useShopTypesStore } from '../../Providers/ShopTypesProvider';
import type { ShopTypeDomain } from '../../types/domain';
import { Form, FormGroup, Label, Input, ErrorText, Footer } from './styledComponents';

interface Props {
  shopType: ShopTypeDomain | null;
  onClose: () => void;
}

export const EditShopTypeModal = ({ shopType, onClose }: Props) => {
  const store = useShopTypesStore();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shopType) setName(shopType.name);
  }, [shopType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopType || !name.trim()) { setError('Name is required.'); return; }
    setError(null);
    setLoading(true);
    try {
      await store.updateShopType(shopType.id, { name: name.trim() });
      onClose();
    } catch {
      setError('Failed to update shop type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!shopType} onClose={onClose} title="Edit Shop Type" width={420}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Shop type name"
            autoFocus
          />
        </FormGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <Footer>
          <Button type="button" variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" size="md" loading={loading}>Save</Button>
        </Footer>
      </Form>
    </Modal>
  );
};
