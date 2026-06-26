import { StyleSheet } from 'react-native';

export const addressSheetStyles = StyleSheet.create({
  // Sheet Container
  sheetContent: {
    padding: 20,
    paddingBottom: 32,
  },
  // Header
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  sheetSubtitle: {
    fontSize: 12,
  },
  // Current Location Button
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  currentLocIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  currentLocLabel: {
    fontSize: 14,
  },
  currentLocSub: {
    fontSize: 11,
    marginTop: 2,
  },
  // Divider
  divider: {
    height: 1,
    marginVertical: 14,
    opacity: 0.5,
  },
  // Address List
  addressListScroll: {
    maxHeight: 260,
  },
  // Address Item
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    gap: 12,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 14,
  },
  addressStreet: {
    fontSize: 12,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  // Add New Address Button
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  addAddressIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addAddressLabel: {
    fontSize: 14,
  },
});
