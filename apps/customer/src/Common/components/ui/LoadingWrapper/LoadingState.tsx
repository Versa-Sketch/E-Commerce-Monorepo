import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
interface LoadingStateProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}
export const LoadingState: React.FC<LoadingStateProps> = ({
  text = 'Loading...',
  size = 'large',
  color = '#16A34A',
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
    {!!text && <Text style={styles.text}>{text}</Text>}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
