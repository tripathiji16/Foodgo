import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './homeStackNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomTabBar from '../components/customtabbar';
import HomeScreen from '../screens/homeStack/homescreen';
import CustomerSupport from '../screens/tabs/customersupport';
import Favourites from '../screens/tabs/favourites';
import ProfileStackNavigator from './profileStackNavigation';
// ProductDetailScreen moved into Home stack navigator file


const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
  Support: { focused: 'chatbubble-ellipses', default: 'chatbubble-ellipses-outline' },
  Favourites: { focused: 'heart', default: 'heart-outline' },
};

const renderTabIcon = (routeName: string) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    const icon = TAB_ICONS[routeName];
    if (!icon) return null;
    return (
      <Ionicons
        name={focused ? icon.focused : icon.default}
        size={size}
        color={color}
      />
    );
  };
  

const MainTabNavigator = () => {
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: renderTabIcon(route.name),
        tabBarStyle: { display: 'flex' }
        
      })}
    >
      <Tab.Screen 
      name="Home" 
      component={HomeStackNavigator}
      />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      {/* Center FAB placeholder */}
      <Tab.Screen
        name="Add"
        component={HomeScreen}
        options={{
          tabBarIcon: () => null, 
        }}
      />  

      <Tab.Screen name="Support" component={CustomerSupport} />
      <Tab.Screen name="Favourites" component={Favourites} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
