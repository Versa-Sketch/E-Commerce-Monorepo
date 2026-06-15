import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockHelpTopics } from '../mock';
import { colors, typography } from '../theme';

export function HelpCenterScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.black87} />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>What issue do you need help with?</Text>

        <View style={styles.listCard}>
          {mockHelpTopics.map((topic, index) => (
            <React.Fragment key={topic}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => Alert.alert('Coming soon', `Support for "${topic}" is coming soon.`)}
                activeOpacity={0.7}
              >
                <Text style={styles.rowText}>{topic}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.gray300} />
              </TouchableOpacity>
              {index < mockHelpTopics.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.gray50 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  title: { ...typography.h2, color: colors.black87 },
  scroll: { padding: 16, paddingBottom: 40 },
  heading: { ...typography.h2, color: colors.black87, marginBottom: 20 },
  listCard: {
    backgroundColor: colors.cardBg, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  rowText: { ...typography.body, color: colors.black87 },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: 16 },
});
