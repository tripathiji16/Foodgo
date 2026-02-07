import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const THEME = {
  primary: '#EF2A39',
  white: '#FFFFFF',
  inactive: '#FFFFFF',
  active: '#FFFFFF',
  shadow: '#000',
};

type CustomTabBarProps = BottomTabBarProps & {
  fabIconName?: string;
  fabOnPress?: () => void;
};

const hiddenScreensMap: Record<string, string[]> = {
  Home: ['SettingsScreen','PaymentDetails', 'OrderHistory', 'About', 'PrivacyPolicy', 
    'ProductDetails', 'OrderScreen', 'SuccessModal', 'SetAppLockScreen', 'ManageAppLock'],
  Profile: ['SelectLocation']
};
const hiddenTabs = ['Support'];


const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  fabIconName = 'add',
  fabOnPress,
}: CustomTabBarProps) => {
  const { width } = useWindowDimensions();

  const TAB_BAR_WIDTH = width * 1.01;
  const TAB_BAR_HEIGHT = 65;
  const FAB_SIZE = 80;
  const TAB_BAR_OFFSET = 0.1;
  const NOTCH_RADIUS = FAB_SIZE / 2;

  const path = useMemo(() => {
    const notchWidth = FAB_SIZE + 50;
    const center = TAB_BAR_WIDTH / 2;

    const leftStart = center - notchWidth / 2;
    const rightEnd = center + notchWidth / 2;

    return `
      M 0 0
      L ${leftStart} 0
      C ${leftStart + 35} 0, ${center - NOTCH_RADIUS} ${NOTCH_RADIUS}, ${center} ${NOTCH_RADIUS}
      C ${center + NOTCH_RADIUS} ${NOTCH_RADIUS}, ${rightEnd - 35} 0, ${rightEnd} 0
      L ${TAB_BAR_WIDTH} 0
      L ${TAB_BAR_WIDTH} ${TAB_BAR_HEIGHT}
      L 0 ${TAB_BAR_HEIGHT}
      Z
    `;
  }, [NOTCH_RADIUS, TAB_BAR_WIDTH]);

const focusedTab = state.routes[state.index].name;

if (hiddenTabs.includes(focusedTab)) {
  return null;
}

const focusedScreen =
  getFocusedRouteNameFromRoute(state.routes[state.index]) ??
  (focusedTab === 'Home' ? 'HomeMain' : 'ProfileMain');

if (hiddenScreensMap[focusedTab]?.includes(focusedScreen)) {
  return null;
}

  const middleIndex = Math.floor(state.routes.length / 2);

  return (
    <View
      style={[
        styles.tabBarContainer,
        { width: TAB_BAR_WIDTH, bottom: TAB_BAR_OFFSET, height: TAB_BAR_HEIGHT },
      ]}
    >
      <Svg width={TAB_BAR_WIDTH} height={TAB_BAR_HEIGHT} style={StyleSheet.absoluteFill}>
        <Path d={path} fill={THEME.primary} />
      </Svg>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          if (fabOnPress) return fabOnPress();
          const fabRoute = state.routes[middleIndex];
          const event = navigation.emit({
            type: 'tabPress',
            target: fabRoute.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) navigation.navigate(fabRoute.name, fabRoute.params);
        }}
      >
        <Ionicons name={fabIconName} size={32} color={THEME.white} />
      </Pressable>

      {/* Tab Items */}
      <View style={styles.tabItemsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          if (index === middleIndex) return <View key={route.key} style={styles.tabItem} />;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={styles.tabItem}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? THEME.active : THEME.inactive,
                  size: 26,
                })}
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    alignSelf: 'center',
    elevation: 8,
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabItemsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    top: -45,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 72 / 2,
    backgroundColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 10,
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: THEME.active,
    position: 'absolute',
    bottom: 10,
  },
});

export default CustomTabBar;
