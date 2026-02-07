import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../components/custominput';
import GoogleButton from '../components/google';
import FacebookButton from '../components/facebook';
import { useAuth } from '../contexts/AuthContext';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from '../contexts/themeContext';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  username: Yup.string().min(4, 'Username must be at least 4 characters').required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must include a lowercase letter')
    .matches(/[A-Z]/, 'Password must include an uppercase letter')
    .matches(/[0-9]/, 'Password must include a number')
    .matches(/[^A-Za-z0-9]/, 'Password must include a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm Password is required'),
});

type RegisterValues = {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  // 2. Initialize Theme
  const { colors } = useTheme();

  const { emailSignUp, googleSignIn, facebookSignIn } = useAuth();
  const [fbLoading, setFbLoading] = useState(false);

  const handleRegisterSubmit = async (
    values: RegisterValues,
    { setSubmitting }: FormikHelpers<RegisterValues>
  ) => {
    setSubmitting(true);
    try {
      await emailSignUp(values.name, values.email, values.password);

      Alert.alert(
        'Verify your email',
        'A verification link has been sent to your email. Please verify before login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login')  }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error: any) {
      Alert.alert('Google Sign-Up Failed', error.message || 'Try again later.');
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setFbLoading(true);
      await facebookSignIn();
    } catch (error: any) {
      Alert.alert('Facebook Sign-Up Failed', error.message || 'Try again later.');
    } finally {
      setFbLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Create an Account</Text>

        <Formik
          initialValues={{
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegisterSubmit}
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
                label="Full Name"
                iconName="user"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Enter your full name"
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <CustomInput
                label="Email Address"
                iconName="mail"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <CustomInput
                label="Username"
                iconName="at-sign"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                placeholder="Choose a username"
                autoCapitalize="none"
              />
              {touched.username && errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              <CustomInput
                label="Password"
                iconName="lock"
                isPassword
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Create a password"
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <CustomInput
                label="Confirm Password"
                iconName="lock"
                isPassword
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Confirm your password"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.registerButton, 
                  isSubmitting && styles.registerButtonDisabled,
                  { backgroundColor: colors.primary }
                ]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                <Text style={styles.registerButtonText}>
                  {isSubmitting ? 'Registering…' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <Text style={[styles.orText, { color: colors.textMuted }]}>OR</Text>

        <GoogleButton title="Sign up with Google" onPress={handleGoogleSignUp} />
        <FacebookButton
          title="Sign up with Facebook"
          onPress={handleFacebookSignUp}
          loading={fbLoading}
          disabled={fbLoading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.switchText, { color: colors.textMuted }]}>
            Already have an account? <Text style={[styles.linkText, { color: colors.primary }]}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Platform.select({ ios: 'Lobster-Regular', android: 'lobster_regular' }),
    fontSize: wp('8%'),
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
    fontFamily: Platform.select({ ios: 'Lobster-Regular', android: 'lobster_regular' }),
  },
  registerButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'Lobster-Regular', android: 'lobster_regular' }),
  },
  errorText: {
    color: '#EF2A39',
    fontSize: 12,
    marginLeft: 5,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default RegisterScreen;