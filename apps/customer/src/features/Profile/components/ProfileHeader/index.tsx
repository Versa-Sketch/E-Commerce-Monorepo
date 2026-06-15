import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeContext';
import { Avatar } from '@/Common/components/ui/Avatar';
import {
  avatarBorderStyle,
  profileHeaderStyle,
  profileNameStyle,
  settingsGearBtnStyle,
} from './styledcomponents';
interface ProfileHeaderProps {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, phone, avatarUrl }) => {
  const { theme } = useTheme();
  return (
    <View style={[profileHeaderStyle, { backgroundColor: theme.colors.primary }]}>
      <Pressable style={settingsGearBtnStyle}>
        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
      </Pressable>
      <Avatar uri={avatarUrl} name={name || 'User'} size={80} style={avatarBorderStyle} />
      <Text style={[theme.textPresets.h2, profileNameStyle, { color: '#FFFFFF', fontFamily: theme.typography.fonts.bold, marginTop: 12 }]}>
        Hi, {name || 'Guest'} 👋
      </Text>
      <Text style={[theme.textPresets.bodySmall, { color: '#E0F2F1', fontSize: 14, marginTop: 2 }]}>
        {phone || '+91 98765 43210'}
      </Text>
    </View>
  );
};
export default ProfileHeader;
