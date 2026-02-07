import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/profileStack/profilescreen';
import SelectLocationScreen from '../screens/profileStack/selectLocationScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  SelectLocation: { onAddressSelected: (address: string) => void };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="SelectLocation" component={SelectLocationScreen} options={{ title: 'Select Delivery Location' }} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;