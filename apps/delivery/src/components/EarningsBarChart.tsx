import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface BarData {
  label: string;
  value: number;
}

interface Props {
  data: BarData[];
  maxHeight?: number;
}

export function EarningsBarChart({ data, maxHeight = 100 }: Props) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((item) => {
          const barH = Math.max((item.value / maxValue) * maxHeight, item.value > 0 ? 20 : 4);
          return (
            <View key={item.label} style={styles.barCol}>
              <Text style={[styles.valueLabel, { color: item.value > 0 ? colors.black87 : colors.gray300 }]}>
                ₹{item.value}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barH,
                      backgroundColor: item.value > 0 ? colors.black87 : colors.gray100,
                    },
                  ]}
                />
              </View>
              <Text style={styles.axisLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  valueLabel: {
    ...typography.small,
    marginBottom: 4,
    textAlign: 'center',
  },
  barTrack: {
    height: 110,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '80%',
  },
  bar: {
    width: '100%',
    borderRadius: 3,
    minHeight: 4,
  },
  axisLabel: {
    ...typography.small,
    color: colors.gray700,
    marginTop: 6,
    textAlign: 'center',
  },
});
