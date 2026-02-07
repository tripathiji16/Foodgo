import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './src/navigation/types';

import SplashScreen from './src/screens/splashscreen';
import LoginScreen from './src/screens/loginscreen';
import RegisterScreen from './src/screens/registerscreen';
import AppNavigator from './src/navigation/mainTabNavigation';
import { AppLockProvider, useAppLock } from './src/contexts/applockContext';
import AppLockScreen from './src/screens/applockscreen';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/themeContext';
import { FavouritesProvider } from './src/contexts/favouritesContext';
import { TabBarAnimationProvider } from './src/contexts/tabBarAnimationContext';
import { OrderProvider } from './src/contexts/orderContext';
import { ChatProvider } from './src/contexts/chatContext';
import { registerNotificationListeners, requestNotificationPermission, getFCMToken } from './src/services/notificationService';

const Stack = createStackNavigator<RootStackParamList>();
const RootWithAppLock = () => {
  const { isAppLockEnabled, isLocked } = useAppLock();

  if (isAppLockEnabled && isLocked) {
    return <AppLockScreen />;
  }

  return <RootNavigation />;
};
const RootNavigation = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    const initNotifications = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await getFCMToken();
        registerNotificationListeners();
      }
    };

    if (!loading) {
      initNotifications();
    }
  }, [loading]);

  if (loading) {
    return <SplashScreen />;
  }


  return (
    <Stack.Navigator  key={user ? 'app' : 'auth'} screenOptions={{ headerShown: false }}>
      {user ? (<Stack.Screen name="MainApp" component={AppNavigator} />
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppLockProvider>
      <ThemeProvider>
      <FavouritesProvider>
        <OrderProvider>
          <ChatProvider>
            <TabBarAnimationProvider>
            <NavigationContainer>
             <RootWithAppLock />
            </NavigationContainer>
           </TabBarAnimationProvider>
          </ChatProvider>
        </OrderProvider>
      </FavouritesProvider>
      </ThemeProvider>
      </AppLockProvider>
    </AuthProvider>
  );
};

export default App;