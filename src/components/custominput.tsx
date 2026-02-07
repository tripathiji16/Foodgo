import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/themeContext';

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName: string;
  isPassword?: boolean;
  isDeliveryAddress?: boolean;
  onPressAddAddress?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  iconName,
  isPassword,
  isDeliveryAddress,
  onPressAddAddress,
  ...props
}) => {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = React.useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather
          name={iconName}
          size={20}
          color={colors.textMuted}
          style={styles.icon}
        />

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            hitSlop={8}
          >
            <Feather
              name={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textMuted}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
        )}

        {isDeliveryAddress && (
          <TouchableOpacity
            onPress={onPressAddAddress}
            hitSlop={8}
          >
            <Feather
              name="plus-circle"
              size={20}
              color={colors.textMuted}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  actionIcon: {
    marginLeft: 6,
    marginRight: 4,
  },
});

export default CustomInput;