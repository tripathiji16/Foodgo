import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppLock } from '../contexts/applockContext';
import { useTheme } from '../contexts/themeContext';

const AppLockScreen = () => {
  const { colors } = useTheme();
  const { unlockApp, unlockWithBiometrics, isBiometricAvailable } =
    useAppLock();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const [showPin, setShowPin] = useState(false);
  const [biometricInProgress, setBiometricInProgress] = useState(true);
  useEffect(() => {
    const tryBiometric = async () => {
      const available = await isBiometricAvailable();

      if (!available) {
        setBiometricInProgress(false);
        setShowPin(true);
        return;
      }

      const success = await unlockWithBiometrics();

      if (!success) {
        setBiometricInProgress(false);
        setShowPin(true);
      }
    };

    tryBiometric();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );
      return () => backHandler.remove();
    }
  }, []);

  const handleUnlock = async () => {
    const success = await unlockApp(pin);

    if (!success) {
      setAttempts(prev => prev + 1);
      setError('Incorrect PIN. Please try again.');
      setPin('');
      return;
    }

    setError('');
    setPin('');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.primary }]}>
          App Locked
        </Text>
        {biometricInProgress && (
          <View style={styles.biometricContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.biometricText, { color: colors.textMuted }]}>
              Unlocking with biometrics…
            </Text>

            <TouchableOpacity
              onPress={() => {
                setBiometricInProgress(false);
                setShowPin(true);
              }}
            >
              <Text
                style={[styles.usePinText, { color: colors.primary }]}
              >
                Use PIN instead
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {showPin && (
          <>
            <Text
              style={[styles.subtitle, { color: colors.textMuted }]}
            >
              Enter your 4-digit PIN to continue
            </Text>

            <TextInput
              value={pin}
              onChangeText={value => {
                if (value.length > 4) return;
                setPin(value);
                setError('');
              }}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
              autoFocus
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />

            {error ? (
              <Text style={[styles.error, { color: colors.primary }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                pin.length < 4 && styles.buttonDisabled,
              ]}
              onPress={handleUnlock}
              disabled={pin.length < 4}
            >
              <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>

            {attempts >= 3 && (
              <Text
                style={[styles.hint, { color: colors.textMuted }]}
              >
                Having trouble? Please verify your PIN carefully.
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppLockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
  },
  biometricContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  biometricText: {
    marginTop: 16,
    fontSize: 14,
  },
  usePinText: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    marginTop: 32,
    borderBottomWidth: 1,
    fontSize: 26,
    letterSpacing: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
  error: {
    textAlign: 'center',
    marginTop: 12,
  },
  button: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
  },
});
