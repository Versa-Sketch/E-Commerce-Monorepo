import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
    ...Shadows.soft,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  headerAddButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  fab: {
    position: 'absolute',
    right: 18,
    width: 58,
    height: 58,
    alignItems: 'center',
    borderRadius: 29,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    ...Shadows.strong,
  },

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastBanner: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    zIndex: 50,
    backgroundColor: Colors.textPrimary,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 18,
    ...Shadows.medium,
  },
  toastText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  toastError: { backgroundColor: Colors.error },

  // ── Search ────────────────────────────────────────────────────────────────
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },

  // ── Filter chips ──────────────────────────────────────────────────────────
  chipsRail: { height: 52, marginTop: 8 },
  chipsScroll: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  chipDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
    alignSelf: 'center',
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  loadMoreRow: { paddingVertical: 20, alignItems: 'center' },

  // ── Product card ──────────────────────────────────────────────────────────
  productCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    // borderLeftColor is set per-card inline
    overflow: 'hidden',
    minHeight: 110,
    ...Shadows.card,
  },
  productCardInactive: {
    opacity: 0.6,
  },

  // Image column
  productImgCol: {
    width: 96,
    backgroundColor: '#F8F9FC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  productImg: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
  },
  productImgPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  inactiveChip: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: Colors.errorBg,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inactiveChipText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.error,
    letterSpacing: 0.5,
  },

  // Info section
  productInfo: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 4,
    justifyContent: 'center',
    gap: 3,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  productCat: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  productBrand: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // Pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 7,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  metricPillText: { fontSize: 10, fontWeight: '700' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusPillText: { fontSize: 10, fontWeight: '700' },

  // Action buttons column
  cardActionsCol: {
    width: 44,
    paddingVertical: 14,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  cardActionEdit: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActionMore: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F0F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Swipe actions ──────────────────────────────────────────────────────────
  swipeLeft: {
    backgroundColor: Colors.error,
    borderRadius: 20,
    marginVertical: 2,
    marginLeft: 2,
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  swipeRight: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginVertical: 2,
    marginRight: 2,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  swipeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Skeleton ──────────────────────────────────────────────────────────────
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  skeletonImgCol: {
    width: 96,
    height: 110,
    backgroundColor: '#F0F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonBlock: { backgroundColor: '#E8EAF0', borderRadius: 8 },

  // ── States ────────────────────────────────────────────────────────────────
  stateWrap: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  stateIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateIconError: { backgroundColor: Colors.errorBg },
  stateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  stateSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },

  // ── Action sheet rows ─────────────────────────────────────────────────────
  sheetContent: { paddingHorizontal: 20, paddingTop: 4 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  actionRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actionRowSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  actionRowDanger: { color: Colors.error },
  confirmText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 18,
  },
  confirmActions: { flexDirection: 'row', gap: 10 },

  // ── Product detail (unchanged) ────────────────────────────────────────────
  detailScroll: { paddingHorizontal: 20, paddingTop: 14 },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  detailTopRow: { flexDirection: 'row', gap: 14 },
  detailImg: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: Colors.background,
  },
  detailName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  detailDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginTop: 10 },
  metaGrid: { marginTop: 14, gap: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  metaValue: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  detailActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  variantCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 10,
  },
  variantCardInactive: { opacity: 0.62 },
  variantTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  variantImg: { width: 44, height: 44, borderRadius: 10, backgroundColor: Colors.background },
  variantName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  variantSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  variantPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  variantPrice: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  variantMrp: { fontSize: 12, color: Colors.textMuted, textDecorationLine: 'line-through' },
  variantMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    rowGap: 6,
  },
  variantMetaItem: { width: '50%' },
  variantMetaLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  variantMetaValue: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600', marginTop: 1 },
  variantActions: { flexDirection: 'row', gap: 10, marginTop: 12 },

  // Legacy — pill used in non-card contexts
  pill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  pillText: { fontSize: 10, fontWeight: '700' },
  commerceBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  productImgPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  productCardInactive2: { opacity: 0.62 },
  backButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.soft,
  },
});
