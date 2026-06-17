import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header Panel
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSquareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.soft,
  },
  redBadgeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },

  // KPIs Horizontal Metric Cards
  kpiCardsScroll: {
    marginTop: 8,
    marginBottom: 4,
  },
  kpiCardsContent: {
    gap: 12,
    paddingRight: 16,
  },
  kpiCardItem: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Shadows.soft,
  },
  kpiIconBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
  kpiValueText: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
  kpiSubText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },

  // Pill tabs style
  pillTabsWrap: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
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
    backgroundColor: '#0F172A',
  },
  pillTabText: {
    fontSize: 12,
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
    backgroundColor: '#334155',
  },
  pillTabCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  pillTabCountTextActive: {
    color: '#FFFFFF',
  },

  // List layout
  list: {
    padding: 16,
    gap: 14,
  },

  // Order Card layout
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  newOrderTagContainer: {
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 12,
  },
  newOrderTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E7F8F0',
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

  // Badges / Chips
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

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },

  // Actions
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#E7F8F0',
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
  donePillGreen: {
    backgroundColor: '#DCFCE7',
  },
  donePillRed: {
    backgroundColor: '#FEE2E2',
  },
  donePillText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Bottom Banner
  footerPerformanceBanner: {
    backgroundColor: '#E7F8F0',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 143, 95, 0.12)',
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

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 56,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E7F8F0',
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

  // Bottom sheets
  sheet: {
    padding: 16,
  },
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
  itemName: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineDotWrap: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: '#E7F8F0',
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  timelineStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  timelineTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
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
    backgroundColor: '#E7F8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  driverMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
});
