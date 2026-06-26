import { StyleSheet } from 'react-native';

export const shopsSectionStyles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginTop: 20,
  },
  gridTitle: {
    fontSize: 19,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionCountBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredScrollView: {
    paddingHorizontal: 20,
    gap: 12,
  },
  nearYouSection: {
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    marginBottom: 32,
    marginTop: 20,
  },
  loadingFeaturedSection: {
    marginBottom: 24,
  },
  loadingScrollView: {
    paddingHorizontal: 20,
    gap: 12,
  },
  loadingNearYouSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  shopCardContainer: {
    marginBottom: 16,
  },
});
