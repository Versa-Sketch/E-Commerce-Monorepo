import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ─── Orange Header ────────────────────────────────────────────────────────
  headerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerFilterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search bar inside header (on orange bg)
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },

  // ─── Pills + Stats (white strip below header) ─────────────────────────────
  pillsStatsContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    ...Shadows.soft,
  },
  pillTabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pillTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  pillTabButtonActive: {
    backgroundColor: Colors.primary,
  },
  pillTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  pillTabTextActive: {
    color: '#FFFFFF',
  },
  pillTabCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  pillTabCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pillTabCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  pillTabCountTextActive: {
    color: '#FFFFFF',
  },

  // Stats row (₹12,840 / 24 / 3 / ₹536)
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // ─── List Layout ──────────────────────────────────────────────────────────
  list: {
    padding: 16,
    gap: 14,
  },

  // ─── Order Card ───────────────────────────────────────────────────────────
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    ...Shadows.card,
  },

  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  payPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  payPillText: {
    fontSize: 10,
    fontWeight: '800',
  },

  // ─── Chips ────────────────────────────────────────────────────────────────
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 14,
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  badgeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },

  // ─── Progress Bar ─────────────────────────────────────────────────────────
  progressWrap: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  progressPct: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },

  // ─── Action Buttons ───────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  acceptBtn: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rejectBtn: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  rejectBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  viewBtn: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  donePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 12,
  },
  donePillGreen: { backgroundColor: '#DCFCE7' },
  donePillRed: { backgroundColor: '#FEE2E2' },
  donePillText: { fontSize: 13, fontWeight: '800' },

  // ─── Footer Banner ────────────────────────────────────────────────────────
  footerPerformanceBanner: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.12)',
  },
  footerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  footerPerformanceText: {
    flex: 1,
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 15,
  },
  footerLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },

  // ─── Empty State ──────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 56,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // ─── Bottom Sheets ────────────────────────────────────────────────────────
  sheet: { padding: 16 },
  sheetSection: {
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sheetSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  sheetName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#475569',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemName: { flex: 1, fontSize: 12, color: '#0F172A' },
  itemPrice: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemTotalLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  itemTotalValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  timelineRow: { flexDirection: 'row', marginBottom: 10 },
  timelineDotWrap: { alignItems: 'center', width: 16 },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  timelineStatus: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  timelineTime: { fontSize: 10, color: '#94A3B8', marginTop: 1 },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  driverName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  driverMeta: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
});
