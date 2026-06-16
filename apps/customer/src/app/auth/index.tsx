import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LoginForm } from '../../features/Auth/components/LoginForm';
import { useTheme } from '../../theme/ThemeContext';

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Pressable onPress={() => router.replace('/')} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <View style={styles.header}>
        <Text style={[theme.textPresets.h2, { color: theme.colors.primary }]}>Welcome Back</Text>
        <Text style={[theme.textPresets.bodyMedium, { color: theme.colors.textSecondary, marginTop: 4 }]}>
          Log in to connect with your local shops
        </Text>
      </View>
      <LoginForm onLoginSuccess={() => router.replace('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 64 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 24, padding: 4 },
  header: { marginBottom: 32 },
});
