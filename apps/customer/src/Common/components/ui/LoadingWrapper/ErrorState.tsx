import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
interface ErrorStateProps {
  message?: string;
  retry?: () => void | Promise<void>;
}
export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  retry,
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Ionicons name="cloud-offline-outline" size={40} color="#EF4444" />
    </View>
    <Text style={styles.title}>Oops!</Text>
    <Text style={styles.message}>{message}</Text>
    {!!retry && (
      <Pressable onPress={retry} style={styles.retryBtn}>
        <Ionicons name="refresh-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    )}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
