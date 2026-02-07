import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/themeContext';

const facebookIcon = require('../assets/images/facebook_icon.png');

interface FacebookButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
}

const FacebookButton: React.FC<FacebookButtonProps> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.card, borderColor: colors.border },
        isDisabled && { opacity: 0.6 }
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <>
          <Image source={facebookIcon} style={styles.icon} />
          <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    marginTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FacebookButton;