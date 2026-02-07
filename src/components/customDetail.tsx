import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/themeContext';

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName: string;
  isPassword?: boolean;
  editable: boolean;
}

const CustomDetail: React.FC<CustomInputProps> = ({ 
  label, iconName, isPassword= false, editable= true, ...props }
) => {
  const { colors } = useTheme();

  const [isSecure, setIsSecure] = useState(isPassword);
  useEffect(() => {setIsSecure(isPassword);}, [isPassword]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { backgroundColor: colors.background, color: colors.icon }]}>{label} 
        <Feather 
          name={iconName} 
          size={15} 
          color={colors.icon} 
          style={styles.icon} 
        />
      </Text>
      
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword ? isSecure : false}
          editable={editable}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Feather
              name='eye-off'
              size={20}
              color={colors.textMuted}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    paddingHorizontal: 5,
    fontSize: 14,
    left: 25,
    top: 17,
    zIndex: 1,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15, 
    paddingHorizontal: 5, 
  },
  icon: {
    marginRight: 8,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 10
  },
});

export default CustomDetail;