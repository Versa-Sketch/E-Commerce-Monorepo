export interface ShopTypeFixture {
  id: string;
  name: string;
  description: string;
}

export const shopTypesFixture: ShopTypeFixture[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Grocery',
    description: 'Daily essentials, vegetables, fruits, and household items',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Electronics',
    description: 'Mobile phones, laptops, accessories, and gadgets',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Fashion',
    description: 'Clothing, footwear, and lifestyle accessories',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    name: 'Pharmacy',
    description: 'Medicines, health supplements, and personal care products',
  },
];
