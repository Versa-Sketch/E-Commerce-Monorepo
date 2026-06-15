import { useState, useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { useCategoriesStore } from '../../Providers/CategoriesProvider';
import type { CategoryDomain } from '../../types/domain';
import { Form, FormGroup, Label, Input, HintText, ErrorText, Footer } from './styledComponents';

export interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: CategoryDomain | null;
  categoryId?: string;
  subId?: string;
  mode: 'category' | 'subcategory';
}

export const CategoryModal = ({ open, onClose, category, categoryId, mode }: CategoryModalProps) => {
  const store = useCategoriesStore();
  const isEdit = !!category;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImage(category.image);
    } else {
      setName('');
      setImage('');
    }
  }, [category, open]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required.'); return; }
    setError(null);
    setLoading(true);

    try {
      const body = { name: name.trim(), ...(image.trim() ? { image: image.trim() } : {}) };

      if (isEdit && category) {
        if (mode === 'subcategory' && categoryId) {
          await store.updateSubcategory(categoryId, category.id, body);
        } else {
          await store.updateCategory(category.id, body);
        }
      } else {
        if (mode === 'subcategory' && categoryId) {
          await store.createSubcategory(categoryId, body);
        } else {
          await store.createCategory(body);
        }
      }
      handleClose();
    } catch {
      setError('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const title = isEdit
    ? mode === 'subcategory' ? 'Edit Subcategory' : 'Edit Category'
    : mode === 'subcategory' ? 'Create Subcategory' : 'Create Category';

  return (
    <Modal open={open} onClose={handleClose} title={title} width={420}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="cat-name">Name *</Label>
          <Input
            id="cat-name"
            placeholder="e.g. Dairy"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cat-image">Image URL</Label>
          <Input
            id="cat-image"
            placeholder="https://example.com/image.png"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          <HintText>Optional. Leave blank if no image.</HintText>
        </FormGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <Footer>
          <Button type="button" variant="outline" size="md" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create'}
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
};
