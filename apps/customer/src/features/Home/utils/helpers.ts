import { Dimensions } from 'react-native';
import { AddressApi } from '../../../types/shared';
import { CART_DELETE_ACTION_WIDTH } from '../Constants';

/**
 * Calculate cart bottom sheet snap points based on cart content
 *
 * Calculation breakdown:
 * - overhead = handle (20) + header (70) + scroll padding top/bottom (60) + swipe hint (25) + footer (64) = 239
 * - rowHeight = 82 per cart item
 * - emptyState = 45% of screen height
 * - maxHeight = 80% of screen height
 *
 * @param cartCount - Number of carts/groups in shopping cart
 * @param bottomInset - Safe area bottom inset (for notch devices)
 * @returns Array with calculated snap point height
 */
export function calculateCartSnapPoints(
  cartCount: number,
  bottomInset: number,
): number[] {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');

  const overhead = 239 + bottomInset;
  const rowHeight = 82;

  // Empty state: show a taller sheet so the empty illustration fits
  const contentHeight = cartCount === 0
    ? SCREEN_HEIGHT * 0.45
    : overhead + cartCount * rowHeight;

  const maxHeight = SCREEN_HEIGHT * 0.80;
  return [Math.min(contentHeight, maxHeight)];
}

/**
 * Format address display string from AddressApi object
 *
 * @param address - Address object with address_line1 and optional address_line2
 * @returns Formatted address string
 */
export function formatAddressLabel(address: AddressApi | undefined): string {
  if (!address) {
    return 'Add a delivery address';
  }

  const line1 = address.address_line1 || '';
  const line2 = address.address_line2 ? `, ${address.address_line2}` : '';

  return `${line1}${line2}`;
}

/**
 * Get the currently active address from a list of addresses and selected ID
 *
 * @param selectedAddressId - Currently selected address ID
 * @param addresses - List of available addresses
 * @returns The active address or undefined
 */
export function getActiveAddress(
  selectedAddressId: string | null,
  addresses: AddressApi[],
): AddressApi | undefined {
  if (!selectedAddressId) {
    return undefined;
  }

  return addresses.find((a) => a.id === selectedAddressId);
}

/**
 * Get the default address from a list
 * Priority: defaultAddress > first address > undefined
 *
 * @param addresses - List of available addresses
 * @param defaultAddress - Optional explicitly marked default address
 * @returns The default address or undefined
 */
export function getDefaultAddress(
  addresses: AddressApi[],
  defaultAddress?: AddressApi,
): AddressApi | undefined {
  return defaultAddress ?? addresses[0];
}

/**
 * Calculate if floating search bar should be visible based on scroll position
 *
 * @param currentScrollY - Current scroll position
 * @param gradientHeaderHeight - Height of gradient header section
 * @param threshold - Default scroll threshold
 * @returns Boolean indicating if floating search should be shown
 */
export function shouldShowFloatingSearch(
  currentScrollY: number,
  gradientHeaderHeight: number,
  threshold: number,
): boolean {
  const floatingSearchThreshold =
    gradientHeaderHeight > 0 ? gradientHeaderHeight : threshold;

  return currentScrollY > floatingSearchThreshold;
}

/**
 * Determine status bar style based on scroll position and theme
 *
 * @param currentScrollY - Current scroll position
 * @param gradientHeaderHeight - Height of gradient header section
 * @param isDark - Whether dark mode is enabled
 * @param threshold - Default scroll threshold
 * @returns Status bar style: 'light-content' or 'dark-content'
 */
export function getStatusBarStyle(
  currentScrollY: number,
  gradientHeaderHeight: number,
  isDark: boolean,
  threshold: number,
): 'light-content' | 'dark-content' {
  const floatingSearchThreshold =
    gradientHeaderHeight > 0 ? gradientHeaderHeight : threshold;

  if (currentScrollY > floatingSearchThreshold) {
    return isDark ? 'light-content' : 'dark-content';
  }

  return 'light-content';
}

/**
 * Determine if tab bar should be visible based on scroll direction
 *
 * @param currentScrollY - Current scroll position
 * @param lastScrollY - Previous scroll position
 * @param isCurrentlyVisible - Current tab bar visibility state
 * @returns Boolean indicating if tab bar should be shown
 */
export function shouldTabBarBeVisible(
  currentScrollY: number,
  lastScrollY: number,
  isCurrentlyVisible: boolean,
): boolean {
  const diff = currentScrollY - lastScrollY;
  const minScrollThreshold = 10; // Minimum scroll distance to trigger change

  // If scrolled to top, always show
  if (currentScrollY <= 0) {
    return true;
  }

  // If scroll difference is too small, don't change
  if (Math.abs(diff) <= minScrollThreshold) {
    return isCurrentlyVisible;
  }

  // If scrolling down (positive diff), hide tab bar
  if (diff > 0) {
    return false;
  }

  // If scrolling up (negative diff), show tab bar
  return true;
}

/**
 * Group cart items by store/shop
 *
 * @param cartItems - Flat array of cart items
 * @returns Array of grouped items by store
 */
export function groupCartItemsByStore(cartItems: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  cartItems.forEach((item) => {
    const storeId = item.storeId;
    if (!grouped.has(storeId)) {
      grouped.set(storeId, []);
    }
    grouped.get(storeId)?.push(item);
  });

  return grouped;
}

/**
 * Calculate total price across multiple store carts
 *
 * @param groupedCarts - Array of cart groups with totals
 * @param getTotalFunction - Function to calculate total for each group
 * @returns Total sum of all carts
 */
export function calculateGrandTotal(
  groupedCarts: any[],
  getTotalFunction: (storeId: string) => number,
): number {
  return groupedCarts.reduce((sum, group) => {
    return sum + getTotalFunction(group.storeId);
  }, 0);
}

/**
 * Validate scroll offset is within bounds
 *
 * @param offset - Proposed scroll offset
 * @param minOffset - Minimum allowed offset
 * @param maxOffset - Maximum allowed offset
 * @returns Clamped offset value
 */
export function clampScrollOffset(
  offset: number,
  minOffset: number,
  maxOffset: number,
): number {
  return Math.max(minOffset, Math.min(offset, maxOffset));
}
