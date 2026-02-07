import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Android Permission denied');
        return false;
      }
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    }
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};


export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM TOKEN (Copy this):', token); 
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const registerNotificationListeners = () => {

  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived in Foreground!', remoteMessage);
    
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || ''
    );
  });


  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App caused to open from background state:', remoteMessage.notification);
  });


  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('App caused to open from quit state:', remoteMessage.notification);
      }
    });

  return unsubscribe;
};