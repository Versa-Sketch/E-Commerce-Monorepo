import { StyleSheet } from 'react-native';
import { CART_DELETE_ACTION_WIDTH } from '../../Constants';

export const cartSheetStyles = StyleSheet.create({
  // Sheet Container
  customHandleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    position: 'relative',
    overflow: 'visible',
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  floatingCloseBtn: {
    position: 'absolute',
    top: -56,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  // Sheet Header
  sheetHeaderWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'left',
    marginTop: 10,
  },
  sheetSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 4,
  },
  // Empty State
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyCartIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 18,
    marginBottom: 6,
  },
  emptyCartSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Bottom Sheet Scroll
  bottomSheetScrollView: {
    paddingHorizontal: 20,
  },
  // Cart Row (Item)
  cartRowSwipeContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  cartThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    flexShrink: 0,
  },
  cartThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cartRowInfo: {
    flex: 1,
    marginRight: 8,
  },
  cartCardShopName: {
    fontSize: 15,
    marginBottom: 2,
  },
  cartItemCount: {
    fontSize: 11,
  },
  cartPriceCol: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
    marginRight: 8,
  },
  cartPriceVal: {
    fontSize: 14,
  },
  cartViewBtn: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cartViewBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  cartRowDeleteToggle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Delete Action (Swipe)
  cartRowDeleteAction: {
    width: CART_DELETE_ACTION_WIDTH,
    height: '100%',
    position: 'relative',
  },
  cartRowDeleteBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: 'right',
  },
  cartRowDeleteInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartRowDeleteText: {
    fontSize: 14,
  },
  swipeHint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  // Footer
  cartSheetFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  checkoutAllBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
  },
  checkoutAllLeft: {
    flex: 1,
    gap: 1,
  },
  checkoutAllSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
  },
  checkoutAllText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkoutAllRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkoutAllPrice: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  checkoutAllCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
