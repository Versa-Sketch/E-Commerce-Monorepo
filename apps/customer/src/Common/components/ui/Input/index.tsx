import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeContext';
import {
  clearBtnStyle,
  containerStyle,
  inputStyle,
  leftIconStyle,
  rightIconWrapperStyle,
  toggleBtnStyle,
} from './styledcomponents';
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  leftComponent?: React.ReactNode;
  rightIcon?: React.ReactNode;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}
export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  secureTextEntry = false,
  leftIcon,
  leftComponent,
  rightIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle: inputStyleProp,
  labelStyle,
  onClear,
  containerStyle: containerStyleProp,
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const showPasswordToggle = secureTextEntry;
  const iconColor = error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary;
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleTogglePassword = () => setPasswordVisible((v) => !v);
  const renderLabel = () => (
    <Text
      style={[
        theme.textPresets.label,
        { color: error ? theme.colors.error : theme.colors.textPrimary, marginBottom: theme.spacing.xxs },
        labelStyle,
      ]}
    >
      {label}
    </Text>
  );
  const renderLeftIcon = () => (
    <Ionicons name={leftIcon!} size={20} color={iconColor} style={leftIconStyle} />
  );
  const renderClearButton = () => (
    <Pressable onPress={onClear} style={clearBtnStyle}>
      <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
    </Pressable>
  );
  const renderPasswordToggle = () => (
    <Pressable onPress={handleTogglePassword} style={toggleBtnStyle}>
      <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color={theme.colors.textSecondary} />
    </Pressable>
  );
  const renderRightIcon = () => (
    <View style={rightIconWrapperStyle}>{rightIcon}</View>
  );
  return (
    <View style={[containerStyle, style]}>
      {label && renderLabel()}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            height: 48,
            backgroundColor: isDark ? theme.colors.surfaceSecondary : '#FFFFFF',
            borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : 'transparent',
            borderWidth: (error || isFocused) ? 1.5 : 0,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.sm,
            shadowColor: 'rgba(0, 60, 70, 0.06)',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: (error || isFocused) ? 0 : 2,
          },
          containerStyleProp,
        ]}
      >
        {leftIcon && renderLeftIcon()}
        {leftComponent}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={showPasswordToggle && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[theme.textPresets.bodyMedium, inputStyle, { color: theme.colors.textPrimary }, inputStyleProp]}
        />
        {value.length > 0 && onClear && renderClearButton()}
        {showPasswordToggle && renderPasswordToggle()}
        {rightIcon && renderRightIcon()}
      </View>
      {error && (
        <Text style={[theme.textPresets.caption, { color: theme.colors.error, marginTop: theme.spacing.xxs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};
export default Input;
