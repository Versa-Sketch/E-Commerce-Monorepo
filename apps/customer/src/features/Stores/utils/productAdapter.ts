import { Product, ProductVariant, ShopProduct } from '../../../types/shared';

const pickDefaultVariant = (variants: ProductVariant[]): ProductVariant | undefined => {
  if (variants.length === 0) return undefined;
  const inStock = variants.find((v) => v.is_in_stock);
  return inStock ?? [...variants].sort((a, b) => a.position - b.position)[0];
};

const formatQuantity = (variant: ProductVariant): string => {
  const qty = parseFloat(variant.quantity_per_unit);
  if (Number.isNaN(qty)) return variant.name;
  const qtyText = Number.isInteger(qty) ? qty.toString() : qty.toFixed(2);
  return `${qtyText} ${variant.unit.symbol}`;
};

/**
 * Maps a shop-discovery ShopProduct (variant-based) to the legacy flat Product
 * shape consumed by ProductCard / CartStore. Uses the first in-stock variant
 * (or the lowest-position variant) as the product's price/stock.
 */
export const shopProductToProduct = (
  shopProduct: ShopProduct,
  shopId: string,
  shopName: string
): Product => {
  const variant = pickDefaultVariant(shopProduct.variants);
  const mrp = variant ? parseFloat(variant.mrp) : 0;
  const sellingPrice = variant ? parseFloat(variant.selling_price) : 0;
  const hasDiscount = !!variant && sellingPrice < mrp;
  return {
    id: shopProduct.id,
    storeId: shopId,
    storeName: shopName,
    name: shopProduct.name,
    description: shopProduct.description,
    imageUrl: shopProduct.image || variant?.image,
    price: mrp,
    discountPrice: hasDiscount ? sellingPrice : undefined,
    gstPercent: 0,
    validityDate: variant ? formatQuantity(variant) : undefined,
    inStock: variant?.is_in_stock ?? false,
    stockCount: variant ? Math.floor(parseFloat(variant.available_stock)) : 0,
    category: shopProduct.subcategory?.name ?? shopProduct.category?.name ?? '',
    isBargainable: false,
    rating: 0,
    variantId: variant?.id,
    variantName: variant?.name,
    availableStock: variant ? Math.floor(parseFloat(variant.available_stock)) : undefined,
  };
};
