import { Ionicons } from '@expo/vector-icons';
import { Shop } from '../../../types/shared';

interface ShopPlaceholderPalette {
  background: string;
  foreground: string;
}

const PLACEHOLDER_PALETTES: ShopPlaceholderPalette[] = [
  { background: 'rgba(124, 58, 237, 0.12)', foreground: '#7C3AED' },
  { background: 'rgba(13, 148, 136, 0.12)', foreground: '#0D9488' },
  { background: 'rgba(217, 70, 35, 0.12)', foreground: '#D94623' },
  { background: 'rgba(219, 39, 119, 0.12)', foreground: '#DB2777' },
  { background: 'rgba(37, 99, 235, 0.12)', foreground: '#2563EB' },
  { background: 'rgba(217, 119, 6, 0.12)', foreground: '#D97706' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getShopPlaceholderPalette(shop: Shop): ShopPlaceholderPalette {
  return PLACEHOLDER_PALETTES[hashString(shop.id) % PLACEHOLDER_PALETTES.length];
}

export function getShopIconName(shop: Shop): keyof typeof Ionicons.glyphMap {
  const slugs = shop.shop_types.map((type) => type.slug.toLowerCase());
  if (slugs.some((slug) => slug.includes('grocer'))) return 'basket';
  if (slugs.some((slug) => slug.includes('pharma') || slug.includes('medic'))) return 'medkit';
  if (slugs.some((slug) => slug.includes('bakery') || slug.includes('cafe'))) return 'cafe';
  if (slugs.some((slug) => slug.includes('restaurant') || slug.includes('food'))) return 'restaurant';
  return 'storefront';
}
