import React, { createContext, useRef, useContext } from 'react';
import { Animated } from 'react-native';

type ContextType = {
  animated: Animated.Value;
  show: () => void;
  hide: () => void;
};

const TabBarAnimationContext = createContext<ContextType | null>(null);

export const TabBarAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const animated = useRef(new Animated.Value(0)).current; 

  const show = () => {
    Animated.timing(animated, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  };

  const hide = () => {
    Animated.timing(animated, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  };

  return (
    <TabBarAnimationContext.Provider value={{ animated, show, hide }}>
      {children}
    </TabBarAnimationContext.Provider>
  );
};

export const useTabBarAnimation = () => {
  const ctx = useContext(TabBarAnimationContext);
  if (!ctx) throw new Error('useTabBarAnimation must be used within TabBarAnimationProvider');
  return ctx;
};
