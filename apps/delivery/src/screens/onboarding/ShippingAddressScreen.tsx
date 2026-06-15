import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

export function ShippingAddressScreen({ navigation }: any) {
  const [form, setForm] = useState({
    house: '', building: '', landmark: '', pincode: '', city: '', state: '',
  });

  const requiredFilled =
    form.house.trim() && form.building.trim() && form.pincode.trim() &&
    form.city.trim() && form.state.trim();

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.black87} />
        </TouchableOpacity>

        <Text style={styles.heading}>Shipping address for t-shirt / bag delivery</Text>

        {[
          { key: 'house', label: 'House / Flat Number *', placeholder: 'e.g. 4B, Flat 202' },
          { key: 'building', label: 'Building / Locality Name *', placeholder: 'e.g. Sunrise Apartments' },
          { key: 'landmark', label: 'Landmark (Optional)', placeholder: 'e.g. Near Metro Station' },
          { key: 'pincode', label: 'Pin Code *', placeholder: '6-digit pincode', keyboard: 'number-pad' as const },
          { key: 'city', label: 'City *', placeholder: 'Your city' },
          { key: 'state', label: 'State *', placeholder: 'Your state' },
        ].map((f) => (
          <View key={f.key} style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{f.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChangeText={(v) => update(f.key, v)}
              keyboardType={f.keyboard ?? 'default'}
              placeholderTextColor={colors.gray300}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btn, !requiredFilled && styles.btnDisabled]}
          onPress={() => requiredFilled && navigation.navigate('ApplicationSubmitted')}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  back: { marginBottom: 24 },
  heading: { ...typography.h2, color: colors.black87, marginBottom: 28 },
  fieldWrap: { marginBottom: 20 },
  fieldLabel: { ...typography.small, color: colors.gray700, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: colors.gray100, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, ...typography.body, color: colors.black87,
  },
  btn: {
    marginTop: 8, backgroundColor: colors.orange, borderRadius: 10,
    paddingVertical: 16, alignItems: 'center',
  },
  btnDisabled: { backgroundColor: colors.gray300 },
  btnText: { ...typography.h3, color: colors.white },
});
