import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Keychain from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';

type AppLockContextType = {
  isAppLockEnabled: boolean;
  isLocked: boolean;
  isBiometricAvailable: () => Promise<boolean>;
  unlockWithBiometrics: () => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;

  enableAppLock: (pin: string) => Promise<void>;
  disableAppLock: () => Promise<void>; 
  unlockApp: (pin: string) => Promise<boolean>;
  lockApp: () => void;
};

const AppLockContext = createContext<AppLockContextType | undefined>(
  undefined
);

const APP_LOCK_KEY = 'FOODGO_APP_LOCK_PIN';
const rnBiometrics = new ReactNativeBiometrics();
export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const [isAppLockEnabled, setIsAppLockEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

const isBiometricAvailable = async (): Promise<boolean> => {
  const { available } = await rnBiometrics.isSensorAvailable();
  return available;
};

const unlockWithBiometrics = async (): Promise<boolean> => {
  try {
    const result = await rnBiometrics.simplePrompt({
      promptMessage: 'Unlock Foodgo',
      cancelButtonText: 'Use PIN',
    });

    if (result.success) {
      setIsLocked(false);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: APP_LOCK_KEY,
        });

        if (credentials) {
          setIsAppLockEnabled(true);
          setIsLocked(true);
        }
      } catch {
        setIsAppLockEnabled(false);
        setIsLocked(false);
      }
    };

    bootstrap();
  }, []);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (isAppLockEnabled) {
          setIsLocked(true);
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => subscription.remove();
  }, [isAppLockEnabled]);

  const enableAppLock = async (pin: string) => {
    await Keychain.setGenericPassword('user', pin, {
      service: APP_LOCK_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    setIsAppLockEnabled(true);
    setIsLocked(true);
  };


  const disableAppLock = async () => {
    await Keychain.resetGenericPassword({ service: APP_LOCK_KEY });
    setIsAppLockEnabled(false);
    setIsLocked(false);
  };


  const unlockApp = async (pin: string): Promise<boolean> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: APP_LOCK_KEY,
      });

      if (credentials && credentials.password === pin) {
        setIsLocked(false);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const lockApp = () => {
    if (isAppLockEnabled) {
      setIsLocked(true);
    }
  };

  return (
    <AppLockContext.Provider
      value={{
        isAppLockEnabled,
        isLocked,
        verifyPin: unlockApp,
        enableAppLock,
        disableAppLock,
        unlockApp,
        lockApp,
        isBiometricAvailable,
        unlockWithBiometrics
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
};

export const useAppLock = () => {
  const context = useContext(AppLockContext);
  if (!context) {
    throw new Error('useAppLock must be used within AppLockProvider');
  }
  return context;
};
