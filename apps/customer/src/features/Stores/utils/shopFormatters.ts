import { Shop } from '../../../types/shared';

export function formatReviewCount(count?: number): string | undefined {
  if (count === undefined || count === null || count <= 0) return undefined;
  if (count >= 1000) {
    const thousands = count / 1000;
    const rounded = thousands >= 10 ? thousands.toFixed(0) : thousands.toFixed(1).replace(/\.0$/, '');
    return `${rounded}K+`;
  }
  return `${count}+`;
}

export function formatEta(shop: Shop): string | undefined {
  if (shop.eta_min_minutes == null || shop.eta_max_minutes == null) return undefined;
  return `${shop.eta_min_minutes}-${shop.eta_max_minutes} mins`;
}

export function formatDistance(shop: Shop): string | undefined {
  if (shop.distance_km == null) return undefined;
  return `${shop.distance_km.toFixed(1)} km`;
}
