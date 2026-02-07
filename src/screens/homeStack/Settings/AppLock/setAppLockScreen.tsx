import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppLock } from '../../../../contexts/applockContext';
import { useTheme } from '../../../../contexts/themeContext';
import CustomModal from '../../../../components/custommodal';

const SetAppLockScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { enableAppLock } = useAppLock();
  
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handlePinChange = (value: string) => {
    if (value.length > 4) return;
    setError('');

    if (step === 'enter') {
      setPin(value);
      if (value.length === 4) {
        setTimeout(() => setStep('confirm'), 300);
      }
    } else {
      setConfirmPin(value);
    }
  };

  const handleSave = async () => {
    if (pin !== confirmPin) {
      setError('PINs do not match. Please try again.');
      setPin('');
      setConfirmPin('');
      setStep('enter');
      return;
    }

    try {
      await enableAppLock(pin);
      setShowSuccessModal(true);
    } catch (e) {
      setShowErrorModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>  
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          {step === 'enter' ? 'Set App Lock PIN' : 'Confirm PIN'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {step === 'enter'
            ? 'Enter a 4-digit PIN'
            : 'Re-enter the PIN to confirm'}
        </Text>
      </View>

      <TextInput
        value={step === 'enter' ? pin : confirmPin}
        onChangeText={handlePinChange}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        autoFocus
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {step === 'confirm' && confirmPin.length === 4 && (
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: colors.primary }
          ]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}

      <CustomModal
        visible={showSuccessModal}
        title="App Lock Enabled"
        message="Your app lock has been set successfully."
        confirmText="OK"
        cancelText="Close"
        onConfirm={handleSuccessClose}
        onCancel={handleSuccessClose}
      />

      <CustomModal
        visible={showErrorModal}
        title="Error"
        message="Something went wrong while saving the PIN."
        confirmText="Retry"
        cancelText="Cancel"
        onConfirm={() => setShowErrorModal(false)}
        onCancel={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
};

export default SetAppLockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
  },
  headerTitle: {
    fontSize: 24, 
    fontFamily: Platform.select({ 
      ios: 'Lobster-Regular', 
      android: 'lobster_regular' 
    }),
  },
  subtitle: {
    fontSize: 14,
    marginVertical: 20,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 24,
    letterSpacing: 16,
    paddingVertical: 12,
    marginTop: 24,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  error: {
    color: '#EF2A39',
    marginTop: 12,
    marginHorizontal: 40,
    textAlign: 'center'
  },
  button: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 40,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
});