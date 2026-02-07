import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { RootStackParamList } from '../navigation/types'; 

const burgerLarge = require('../assets/images/burger_large.png');
const burgerSmall = require('../assets/images/burger_small.png');

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(
        StackActions.replace('Login')
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#FF939B', '#EF2A39']}
      style={styles.gradientContainer}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Foodgo</Text>
      </View>
      <View style={styles.burgerContainer}>
      <Image source={burgerLarge} style={styles.burgerLarge} />
      <Image source={burgerSmall} style={styles.burgerSmall} />
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -60 }], 
  },
  logoText: {
    fontFamily: Platform.select({
      ios: 'Lobster-Regular', 
      android: 'lobster_regular', 
    }),
    fontWeight: '400',
    fontSize: wp('10%'),
    lineHeight: wp('10%'),
    color: '#ffffff',
  },
burgerContainer: {
  position: 'absolute',
  bottom: hp('-1%'),
  width: wp('100%'),
  height: wp('50%'),  
},

burgerLarge: {
  width: wp('50%'),
  height: wp('50%'),
  left: wp('-5%'),
  resizeMode: 'contain',
},

burgerSmall: {
  position: 'absolute',
  left: wp('20%'),
  bottom: -10,
  width: wp('40%'),
  height: wp('40%'),
  resizeMode: 'contain',

  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1.5,
  shadowRadius: 7,
},

});

export default SplashScreen;