import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/homeStack/homescreen';
import ProductDetailScreen from '../screens/homeStack/productdetailsscreen';
import OrderScreen from '../screens/homeStack/orderscreen';
import SuccessModal from '../screens/homeStack/paymentsucessModal';
import SettingsScreen from '../screens/homeStack/Settings/settingsscreen';
import SetAppLockScreen from '../screens/homeStack/Settings/AppLock/setAppLockScreen';
import PaymentDetailsScreen from '../screens/homeStack/Settings/paymentDetails';
import OrderHistoryScreen from '../screens/homeStack/Settings/orderHistory';
import About from '../screens/homeStack/Settings/about';
import PrivacyPolicy from '../screens/homeStack/Settings/privacypolicy';
import ManageAppLockScreen from '../screens/homeStack/Settings/AppLock/manageAppLock';

export type HomeStackParamList = {
  HomeMain: undefined;
  //addaddressScreen: undefined;
  ProductDetails: {
    product: {
      id: number;
  title: string;
  subtitle: string;
  imageUrl: string ;
  ratings: number;
  cost: string;
  type: string;
  category: string;
  details: string;
    };
  };
  OrderScreen: { totalCost: number;
        quantity: number;
        product: {
          id: number;
          title: string;
          subtitle: string;
          imageUrl: string;
          cost: string;
        }
   }; 
  SuccessModal: undefined;
  SettingsScreen: undefined;
  SetAppLockScreen: undefined;
  ManageAppLock: undefined;
  OrderHistory: undefined;
  PaymentDetails: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
    name="HomeMain" 
    component={HomeScreen}
     />
    <Stack.Screen 
    name="ProductDetails" 
    component={ProductDetailScreen}
     />
     <Stack.Screen 
     name="OrderScreen" 
     component={OrderScreen} 
     />
     <Stack.Screen 
     name="SuccessModal" 
     component={SuccessModal} 
     />
     <Stack.Screen
     name='SettingsScreen'
     component={SettingsScreen}
     />
     <Stack.Screen
     name='SetAppLockScreen'
     component={SetAppLockScreen}
     />
     <Stack.Screen
     name='ManageAppLock'
     component={ManageAppLockScreen}
     />
     <Stack.Screen
     name='OrderHistory'
      component={OrderHistoryScreen}
      />
      <Stack.Screen
      name='PaymentDetails'
      component={PaymentDetailsScreen}
      />
      <Stack.Screen
      name='About'
      component={About}
      />
      <Stack.Screen
      name='PrivacyPolicy'
      component={PrivacyPolicy}
      />
  </Stack.Navigator>
);

export default HomeStackNavigator;
