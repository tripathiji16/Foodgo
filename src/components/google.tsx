import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/themeContext';

const googleIcon = require('../assets/images/google_icon.png');

interface GoogleButtonProps {
    onPress: () => void;
    title: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress, title }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: colors.card, borderColor: colors.border }
      ]} 
      onPress={onPress}
    >
      <Image source={googleIcon} style={styles.icon} />
      <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
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

export default GoogleButton;