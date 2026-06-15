import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, width: '100%', padding: 0 },
  scroll: { padding: 16, gap: 16, paddingBottom: 120 },

  // ── Hero "Live Deal Room" dashboard (list screen) ────────────────────────
  heroCard: { marginHorizontal: 16, marginTop: 10, padding: 14, gap: 10, borderRadius: 16 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  heroTitleBlock: { flex: 1, flexShrink: 1, paddingRight: 8 },
  heroEyebrow: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 1, textTransform: 'uppercase' },
  heroTitle: { fontSize: 18, fontWeight: '800', color: Colors.white, marginTop: 2 },
  heroStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, width: '100%' },
  heroStat: { width: '48%', flexShrink: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 10, gap: 2, alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  heroStatLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  secondaryRow: { flexDirection: 'row', gap: 12 },
  secondaryCard: { flex: 1, gap: 4 },
  secondaryValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  secondaryLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  // ── Sections ──────────────────────────────────────────────────────────────
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  sectionCount: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  sectionList: { gap: 12 },

  emptyCard: { alignItems: 'center', gap: 6, paddingVertical: 28 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 12, fontWeight: '400', color: Colors.textSecondary, textAlign: 'center' },

  // ── Deal card (list) ─────────────────────────────────────────────────────
  dealCard: { gap: 12 },
  dealCardTopRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dealImage: { width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.surfaceElevated },
  dealInfo: { flex: 1, gap: 2 },
  dealProduct: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  dealCustomerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dealCustomer: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  dealPricesRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 },
  dealOriginal: { fontSize: 13, fontWeight: '500', color: Colors.textMuted, textDecorationLine: 'line-through' },
  dealOffer: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  discountPill: { backgroundColor: Colors.errorBg, borderRadius: 50, paddingHorizontal: 8, paddingVertical: 3 },
  discountPillText: { fontSize: 11, fontWeight: '800', color: Colors.error },
  dealMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealActionsRow: { flexDirection: 'row', gap: 8 },
  dealActionBtn: { flex: 1 },
  miniBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border },
  miniBtnAccept: { backgroundColor: Colors.successBg, borderColor: Colors.success },
  miniBtnReject: { backgroundColor: Colors.errorBg, borderColor: Colors.error },
  miniBtnText: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  miniBtnTextAccept: { color: Colors.success },
  miniBtnTextReject: { color: Colors.error },
  miniBtnDisabled: { opacity: 0.6 },

  // ── Toast ─────────────────────────────────────────────────────────────────
  toastBanner: {
    position: 'absolute',
    top: 12,
    left: 20,
    right: 20,
    zIndex: 50,
    backgroundColor: Colors.textPrimary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Shadows.soft,
  },
  toastError: { backgroundColor: Colors.error },
  toastText: { color: Colors.white, fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // ── Resolved deal card (accepted / rejected / expired) ───────────────────
  resolvedCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resolvedIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resolvedInfo: { flex: 1, gap: 2 },
  resolvedTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  resolvedSub: { fontSize: 11, fontWeight: '400', color: Colors.textSecondary },
  resolvedPrice: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },



  // ── Deal Room (session screen) — Premium Redesigned Styles ─────────────────────
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerStatus: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  // Collapsible Sticky Deal Summary (Below Header)
  stickySummaryBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    ...Shadows.soft,
    zIndex: 10,
  },
  stickySummaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickySummaryProduct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
  },
  stickySummaryCollapseBtn: {
    padding: 2,
  },
  stickySummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },

  // Connection status banner
  connectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FCA5A5',
  },
  connectionBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
  },

  // Timeline / Chat Wallpaper
  chatWallpaper: { flex: 1, backgroundColor: '#F1F5F9' },
  timeline: { padding: 16, paddingBottom: 40, gap: 12 },

  // Date Separator Center Align
  dateSeparatorRow: {
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 14,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dateSeparatorPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },

  // Message Group container
  messageGroupContainer: {
    gap: 4,
  },

  // Alignments (Customer: Right, Merchant: Left)
  messageRow: {
    width: '100%',
    flexDirection: 'row',
  },
  messageRowCustomer: {
    justifyContent: 'flex-end',
  },
  messageRowMerchant: {
    justifyContent: 'flex-start',
  },

  // Customer Chat Bubble (Right Aligned)
  bubbleCustomer: {
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
    ...Shadows.soft,
  },
  bubbleCustomerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  bubbleCustomerMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  bubbleCustomerTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },

  // Merchant Chat Bubble (Left Aligned)
  bubbleMerchant: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
    ...Shadows.soft,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleMerchantText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0F172A',
  },
  bubbleMerchantMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  bubbleMerchantTime: {
    fontSize: 10,
    color: '#94A3B8',
  },

  // Center-aligned System Divider Messages
  systemDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  systemDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  systemDividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 12,
    textAlign: 'center',
  },

  // Alignment modifiers for offer/counter cards, based on who sent the message
  cardAlignLeft: {
    alignSelf: 'flex-start',
  },
  cardAlignRight: {
    alignSelf: 'flex-end',
  },

  // Special Offer Card in Timeline (Customer Offer)
  offerInlineCard: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    ...Shadows.soft,
    marginVertical: 4,
  },
  offerInlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  offerInlineLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  offerInlineStatus: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  offerInlineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  offerInlineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerInlineValueBlock: {
    gap: 2,
  },
  offerInlineValueLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  offerInlineValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  offerInlineDiscount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
  },
  offerInlineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  offerInlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerInlineBtnAccept: {
    backgroundColor: '#10B981',
  },
  offerInlineBtnCounter: {
    backgroundColor: '#0F172A',
  },
  offerInlineBtnReject: {
    backgroundColor: '#EF4444',
  },
  offerInlineBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Counter Offer Card in Timeline (Merchant Counter)
  counterInlineCard: {
    width: '85%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 10,
    ...Shadows.soft,
    marginVertical: 4,
  },
  counterInlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  counterInlineLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  counterInlineStatus: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  counterInlineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterInlinePriceBlock: {
    gap: 2,
  },
  counterInlinePrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Floating New Messages Navigation Overlay
  floatingNewMsgsBtn: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    ...Shadows.strong,
    zIndex: 100,
  },
  floatingNewMsgsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty state container
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  emptyStateBtn: {
    marginTop: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyStateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Composer / Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputField: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#93C5FD',
  },

  // Ended state banner
  endedBanner: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    gap: 6,
  },
  endedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  endedText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },

  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },

  // Deal closed celebration overlay
  successOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 999,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    ...Shadows.strong,
  },
  successEmoji: {
    fontSize: 56,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  successSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  successStatsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginVertical: 4,
  },
  successStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  successStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  successStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  successActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  successActionBtn: {
    flex: 1,
  },

  // Bottom Sheet Smart Counters
  sheet: {
    padding: 20,
    gap: 14,
    backgroundColor: '#FFFFFF',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sheetHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  cartItemsContainer: {
    gap: 10,
    marginVertical: 4,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3B82F6',
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#EFF6FF',
    gap: 10,
  },
  cartItemCardUnselected: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  cartItemIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemMiddle: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cartItemPrice: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  cartItemCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCheckInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  cartItemCheckUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },

  offerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 2,
  },
  offerInputPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 4,
  },
  offerInputField: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    padding: 0,
  },
  percentOffPill: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentOffPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },

  quickPercentRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  quickPercentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  quickPercentBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  quickPercentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickPercentBtnTextActive: {
    color: '#FFFFFF',
  },

  sendCounterBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sendCounterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  sheetProduct: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  sheetSubtitle: { fontSize: 12, fontWeight: '500', color: Colors.textSecondary },
  counterBox: { backgroundColor: Colors.surfaceElevated, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 },
  counterLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  counterPrice: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  counterActions: { flexDirection: 'row', gap: 10, marginTop: 4, width: '100%' },
  stepButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  stepButtonActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  stepTextActive: { color: Colors.white },
  chipsLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, borderRadius: 12, padding: 10, gap: 2, alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipLabel: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  chipLabelActive: { color: Colors.primaryDark },
  chipSub: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
  chipSubActive: { color: Colors.primaryDark },
  previewRow: { flexDirection: 'row', gap: 10 },
  previewCard: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 10 },
  previewValue: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  previewLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary },
});
