import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../components/custominput';
import GoogleButton from '../components/google';
import FacebookButton from '../components/facebook';
import { useAuth, EmailSignInResult } from '../contexts/AuthContext';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/themeContext';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

type LoginValues = {
  email: string;
  password: string;
};

const USER_DB_KEY = 'USER_DATABASE';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const { googleSignIn, facebookSignIn, signInWithEmail } = useAuth();

  const [fbLoading, setFbLoading] = useState(false);

  const handleEmailLogin = async (
    values: LoginValues,
    formikHelpers: FormikHelpers<LoginValues>
  ) => {
    const { email, password } = values;
    formikHelpers.setSubmitting(true);

    try {
      const result: EmailSignInResult = await signInWithEmail(email, password);

      if (result.success) {
        console.log('Login success');
      } else {
        switch (result.reason) {
          case 'USER_NOT_FOUND':
            Alert.alert('Login failed', 'User not found');
            break;
          case 'WRONG_PASSWORD':
            Alert.alert('Login failed', 'Incorrect password');
            break;
          case 'PROVIDER_MISMATCH':
            Alert.alert(
              'Login failed',
              'This email is registered with a different provider'
            );
            break;
        }
      }
    } catch (error: any) {
      Alert.alert('Login failed', error.message || 'Unknown error');
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error: any) {
      Alert.alert('Google Login failed', error.message || 'Try again');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setFbLoading(true);
      await facebookSignIn();
    } catch (error: any) {
      Alert.alert('Facebook Login failed', error.message || 'Try again');
    } finally {
      setFbLoading(false);
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Welcome Back!</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleEmailLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View>
            <CustomInput
              label="Email"
              iconName="user"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Enter your email"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <CustomInput
              label="Password"
              iconName="lock"
              isPassword={true}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.loginButton,
                isSubmitting && styles.loginButtonDisabled,
                { backgroundColor: colors.primary }
              ]}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              <Text style={styles.loginButtonText}>
                {isSubmitting ? 'Logging in…' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={[styles.orText, { color: colors.textMuted }]}>OR</Text>

      <GoogleButton title="Sign in with Google" onPress={handleGoogleSignIn} />

      <FacebookButton
        title="Sign in with Facebook"
        onPress={handleFacebookSignIn}
        loading={fbLoading}
        disabled={fbLoading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.switchText, { color: colors.textMuted }]}>
          Don't have an account?{' '}
          <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
    fontWeight: '400',
    fontSize: wp('10%'),
    lineHeight: wp('10%'),
    textAlign: 'center',
    marginBottom: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
  },
  errorText: {
    color: '#EF2A39',
    fontSize: 12,
    marginLeft: 5,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default LoginScreen;