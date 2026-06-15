import React, { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
interface ButtonLoaderProps {
  isLoading: boolean;
  loadingText: string;
  children: ReactNode;
  spinnerSize?: number;
  spinnerColor?: string;
}
export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  isLoading,
  loadingText,
  children,
  spinnerSize = 16,
  spinnerColor = '#FFFFFF',
}) => {
  if (isLoading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator
          size={spinnerSize as any}
          color={spinnerColor}
          style={styles.spinner}
        />
        <Text style={[styles.text, { color: spinnerColor }]}>{loadingText}</Text>
      </View>
    );
  }
  return <>{children}</>;
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});
export default ButtonLoader;
