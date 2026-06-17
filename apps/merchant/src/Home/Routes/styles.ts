import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Shadows } from '../../theme/shadows';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    paddingBottom: 100,
  },

  // Hero Container (Gradients and blobs)
  heroContainer: {
    backgroundColor: '#0F8F5F',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  radialBlobLeft: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  radialBlobRight: {
    position: 'absolute',
    bottom: -80,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Top Nav Row
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  navCircButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  storeNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 1,
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  navActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifAlertDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0F8F5F',
  },
  notifAlertText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.white,
  },
  profileAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
  },

  // Revenue Hero Card (Inside Green Section)
  revenueHeroCard: {
    backgroundColor: '#0B6B49',
    borderRadius: 24,
    padding: 18,
    marginTop: 4,
    ...Shadows.card,
  },
  revenueCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  revenueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  periodSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  periodSelectorText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  revenueMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  revenueValueText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
  },
  growthIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  growthIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  revenueChartWrap: {
    alignItems: 'flex-end',
  },
  chartTimeLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 3,
  },
  analyticsActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 14,
  },
  analyticsActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  innerStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  innerStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  innerStatLbl: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginTop: 2,
  },
  innerStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  ratingInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // Performance Banner Card (White Box)
  performanceBannerWrapper: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  perfBannerIconCol: {
    marginRight: 12,
  },
  perfBagIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfBannerMiddleCol: {
    flex: 1,
    marginRight: 8,
  },
  perfBannerHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  perfBannerSubheading: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  perfBannerRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderLight,
    paddingLeft: 12,
    minWidth: 72,
  },
  trendStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendStatText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  trendSubLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  carouselDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  carouselDotActive: {
    backgroundColor: Colors.primary,
    width: 16,
  },

  // Quick Actions Grid Wrap
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'space-evenly',
  },
  quickActionItem: {
    alignItems: 'center',
    // width: (SCREEN_WIDTH - 32 - 24) / 3,
    marginBottom: 16,
  },
  quickActionIconBg: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Colors.primary, // Correct green theme
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Section Heading Row
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  viewAllActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Horizontal Card List Scroll
  horizontalCardListScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },

  // New Orders Card
  horizontalOrderCard: {
    width: SCREEN_WIDTH - 48,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  orderCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderInitialsAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInitialsText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  orderCardHeaderMid: {
    flex: 1,
    marginLeft: 10,
  },
  orderCardCustomerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  orderPaymentBadgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  orderPayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderPayBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  orderCardHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderAmountValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  newBadgePill: {
    backgroundColor: '#0F8F5F',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
  },
  orderCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 12,
  },
  orderMetaTextItem: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  orderMetaDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  orderCardActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  orderCardAcceptBtn: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCardAcceptText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  orderCardRejectBtn: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCardRejectText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },

  // Inventory Alert Card
  inventoryAlertCard: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  inventoryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inventoryItemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'contain',
  },
  inventoryImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  inventoryDetailsCol: {
    flex: 1,
  },
  stockStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  stockStatusText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inventoryItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inventoryItemQty: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1,
  },
  inventoryItemSubtext: {
    fontSize: 8,
    color: Colors.textMuted,
    marginTop: 1,
  },
  inventoryRestockBtn: {
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryRestockText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // AI Insights & Store Health Container
  sideBySideContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 12,
  },
  aiInsightsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  aiInsightRowItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  aiInsightGreenIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiInsightPurpleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiInsightParagraphText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  boldText: {
    fontWeight: '800',
  },
  aiInsightRecommendationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  confidencePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginTop: 6,
  },
  confidencePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  dividerLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  inlineCreateOfferBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 6,
  },
  inlineCreateOfferText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B5CF6',
  },

  // Store Health Card
  storeHealthCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  storeHealthDetailsLink: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  healthGaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 10,
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeScore: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  gaugePercent: {
    fontSize: 8,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: -2,
  },
  healthScoreTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  healthNumberText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  healthOutOfText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  healthLevelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  healthLevelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  healthBreakdownRows: {
    gap: 8,
    marginTop: 10,
  },
  healthBreakdownRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthBreakdownLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  healthBreakdownValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  healthCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
  },
  healthFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // Revenue Snapshot Card
  snapshotCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  snapshotLabelText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  snapshotValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  snapshotTrendRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  snapshotTrendPercentText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  snapshotPeriodText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  snapshotSparklineWrap: {
    marginTop: 8,
  },

  // Your Activity Timeline
  timelineWrapper: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  timelineNodeItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLeftColumn: {
    alignItems: 'center',
    width: 24,
  },
  timelineCircleBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineConnectorLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#DCFCE7',
    marginVertical: 4,
  },
  timelineRightColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineLabelTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timelineTimeText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
