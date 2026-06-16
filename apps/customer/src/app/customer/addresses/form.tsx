import { Ionicons } from "@expo/vector-icons";
import { pickedLocationToAddressFields } from "@ecommerce/maps";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Button } from "../../../Common/components/ui/Button";
import { Chip } from "../../../Common/components/ui/Chip";
import { Input } from "../../../Common/components/ui/Input";
import { LocationPickerSheet } from "../../../features/Addresses/components/LocationPickerSheet";
import { useAddressStore } from "../../../features/Addresses/Providers/useAddressStore";
import { consumePendingPickedLocation } from "../../../features/Addresses/Store/mapPickerBridge";
import { AddressType } from "../../../types/shared";
import { useTheme } from "../../../theme/ThemeContext";

const ADDRESS_TYPES: AddressType[] = ["HOME", "WORK", "OTHER"];

export default observer(function AddressFormScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    lat?: string;
    lng?: string;
    line1?: string;
    state?: string;
    pincode?: string;
    formatted?: string;
  }>();
  const { id } = params;
  const addressStore = useAddressStore();
  const isEditMode = !!id;

  const [addressType, setAddressType] = useState<AddressType>("HOME");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    const existing = addressStore.addresses.find((a) => a.id === id);
    if (existing) {
      setAddressType(existing.address_type);
      setAddressLine1(existing.address_line1);
      setAddressLine2(existing.address_line2 ?? "");
      setState(existing.state);
      setPincode(existing.pincode);
      setLatitude(existing.latitude);
      setLongitude(existing.longitude);
      setIsDefault(existing.is_default);
    }
  }, [id, addressStore.addresses.length]);

  useFocusEffect(
    useCallback(() => {
      const picked = consumePendingPickedLocation();
      if (!picked) return;
      const fields = pickedLocationToAddressFields(picked);
      setLatitude(String(fields.latitude));
      setLongitude(String(fields.longitude));
      if (fields.state) setState(fields.state);
      if (fields.pincode) setPincode(fields.pincode);
      // Prepend flat/floor number to the geocoded street address when provided
      const geocodedLine1 = fields.address_line1 ?? "";
      setAddressLine1(
        picked.flatNo ? `${picked.flatNo}, ${geocodedLine1}` : geocodedLine1,
      );
      if (picked.landmark) setAddressLine2(picked.landmark);
      if (picked.addressType) setAddressType(picked.addressType);
    }, []),
  );

  const handleSave = async () => {
    setSubmitting(true);
    const input = {
      address_line1: addressLine1.trim(),
      address_line2: addressLine2.trim() || undefined,
      state: state.trim(),
      pincode: pincode.trim(),
      latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
      longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined,
      address_type: addressType,
      is_default: isDefault,
    };
    const result = isEditMode
      ? await addressStore.updateAddress(id, input)
      : await addressStore.createAddress(input);
    setSubmitting(false);
    if (result) {
      router.back();
    }
  };

  const isValid =
    addressLine1.trim().length > 0 &&
    state.trim().length > 0 &&
    pincode.trim().length > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </Pressable>
        <Text
          style={[
            theme.textPresets.bodyLarge,
            {
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fonts.bold,
            },
          ]}
        >
          {isEditMode ? "Edit Address" : "Add New Address"}
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            theme.textPresets.label,
            { color: theme.colors.textPrimary, marginBottom: 8 },
          ]}
        >
          Address Type
        </Text>
        <View style={styles.chipRow}>
          {ADDRESS_TYPES.map((type) => (
            <Chip
              key={type}
              label={type.charAt(0) + type.slice(1).toLowerCase()}
              selected={addressType === type}
              onPress={() => setAddressType(type)}
              style={{ marginRight: 8 }}
            />
          ))}
        </View>

        <Input
          label="Address Line 1"
          value={addressLine1}
          onChangeText={setAddressLine1}
          placeholder="House no., building, street"
          containerStyle={{ marginBottom: 16 }}
        />
        <Input
          label="Address Line 2 (optional)"
          value={addressLine2}
          onChangeText={setAddressLine2}
          placeholder="Landmark, area"
          containerStyle={{ marginBottom: 16 }}
        />
        <Input
          label="State"
          value={state}
          onChangeText={setState}
          placeholder="State"
          containerStyle={{ marginBottom: 16 }}
        />
        <Input
          label="Pincode"
          value={pincode}
          onChangeText={setPincode}
          placeholder="Pincode"
          keyboardType="numeric"
          containerStyle={{ marginBottom: 16 }}
        />
        <Button
          label="Set location on map"
          variant="outline"
          leftIcon={
            <Ionicons
              name="map-outline"
              size={18}
              color={theme.colors.primary}
            />
          }
          onPress={() => setLocationSheetVisible(true)}
          style={{ marginBottom: 16 }}
        />

        <Input
          label="Latitude (optional)"
          value={latitude}
          onChangeText={setLatitude}
          placeholder="e.g. 12.9716"
          keyboardType="numeric"
          containerStyle={{ marginBottom: 16 }}
        />
        <Input
          label="Longitude (optional)"
          value={longitude}
          onChangeText={setLongitude}
          placeholder="e.g. 77.5946"
          keyboardType="numeric"
          containerStyle={{ marginBottom: 16 }}
        />

        <View style={styles.defaultRow}>
          <Text
            style={[
              theme.textPresets.bodyMedium,
              { color: theme.colors.textPrimary },
            ]}
          >
            Set as default address
          </Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: "#D1D5DB", true: theme.colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Button
          label={isEditMode ? "Save Changes" : "Save Address"}
          onPress={handleSave}
          disabled={!isValid}
          loading={submitting}
        />
      </View>

      <LocationPickerSheet
        visible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
        onSelectUsingMaps={() => {
          setLocationSheetVisible(false);
          router.push("/customer/addresses/map-picker");
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
  },
  backBtn: { padding: 4 },
  rightPlaceholder: { width: 32 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  chipRow: { flexDirection: "row", marginBottom: 16 },
  defaultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footer: { padding: 16, borderTopWidth: 1.5, paddingBottom: 32 },
});
