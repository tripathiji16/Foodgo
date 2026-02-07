import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';
import { auth } from '../firebaseConfig'; 

export type User = {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  username: string;
  deliveryAddress: string;
  password: string | undefined;
  provider: 'google' | 'email' | 'facebook';
};

export type EmailSignInResult =
  | { success: true }
  | {
      success: false;
      reason: 'WRONG_PASSWORD' | 'USER_NOT_FOUND' | 'PROVIDER_MISMATCH';
    };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  emailSignUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<EmailSignInResult>;
  logout: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
};

const CURRENT_USER_KEY = 'CURRENT_USER';
const WEB_CLIENT_ID = '539962237180-cv2k20pv04n87ntm384042gicc5jlgui.apps.googleusercontent.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }, []);

useEffect(() => {
  let isMounted = true;

  const hydrateFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);

      if (storedUser && isMounted) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to hydrate user from storage', e);
    }
  };

  hydrateFromStorage();

  const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
    if (!isMounted) return;

    try {

      if (!fbUser) {
        setUser(null);
        return;
      }

      const providerId = fbUser.providerData[0]?.providerId;

      if (providerId === 'password' && !fbUser.emailVerified) {
        setUser(null);
        return;
      }

      const name = fbUser.displayName ?? 'User';

      const provider: User['provider'] =
        providerId === 'google.com'
          ? 'google'
          : providerId === 'facebook.com'
          ? 'facebook'
          : 'email';

      const reconstructedUser: User = {
        uid: fbUser.uid,
        name,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        username: '@' + name.toLowerCase().replace(/\s+/g, '_'),
        deliveryAddress: '',
        password: undefined,
        provider,
      };

      setUser(reconstructedUser);
      await AsyncStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(reconstructedUser)
      );
    } catch (error) {
      console.error('Auth State Restoration Error', error);
    } finally {
      setLoading(false);
    }
  });

  return () => {
    isMounted = false;
    unsubscribe();
  };
}, []);

  const saveUser = async (profile: User) => {
    setUser(profile);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  };

const googleSignIn = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      const googleResp = await GoogleSignin.signIn();

      const idToken = googleResp?.data?.idToken;
      
      if (!idToken) throw new Error('No ID Token returned');

      const credential = GoogleAuthProvider.credential(idToken);
      const userCred = await signInWithCredential(auth, credential);
      const fbUser = userCred.user;

      const name = fbUser.displayName ?? '';
      const username = '@' + name.toLowerCase().replace(/\s+/g, '_') || `@user_${Date.now()}`;

      const profile: User = {
        uid: fbUser.uid,
        name,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        username,
        deliveryAddress: '',
        password: '',
        provider: 'google',
      };

      await saveUser(profile);
    } 
    catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) 
      return;
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

const facebookSignIn = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'ios') {
        const status = await getTrackingStatus();
        if (status === 'authorized') {
            Settings.setAdvertiserTrackingEnabled(true);

            LoginManager.setLoginBehavior('browser'); 
        } 
        else {
             Settings.setAdvertiserTrackingEnabled(true); 
             LoginManager.setLoginBehavior('web_only'); 
        }
      }

      LoginManager.logOut(); 
      
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        setLoading(false);
        return;
      }
      
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) throw new Error('Unable to obtain Facebook access token');
      if (!data.accessToken.startsWith("EAA")) {
         console.warn("Limited Login Token received. This may fail with Firebase.");
      }

      const fbCredential = FacebookAuthProvider.credential(data.accessToken);
      const userCred = await signInWithCredential(auth, fbCredential);
      const fbUser = userCred.user;
      
      const name = fbUser.displayName ?? '';
      const username = '@' + name.toLowerCase().replace(/\s+/g, '_') || `@user_${Date.now()}`;

      const profile: User = {
        uid: fbUser.uid,
        name,
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        username,
        deliveryAddress: '',
        password: '',
        provider: 'facebook',
      };

      await saveUser(profile);

    } catch (error: any) {
      console.error('Facebook Sign In Error:', error);
      Alert.alert('Facebook Login Failed', error?.message);
    } finally {
      setLoading(false);
    }
  };

const emailSignUp = async (name: string, email: string, password: string) => {
  try {
    setLoading(true);
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCred.user);
    await firebaseSignOut(auth);
  } catch (error: any) {
    Alert.alert('Signup failed', error.message);
  } finally {
    setLoading(false);
  }
};

const signInWithEmail = async (
  email: string,
  password: string
): Promise<EmailSignInResult> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { success: false, reason: 'USER_NOT_FOUND' };
    }

    if (error.code === 'auth/wrong-password') {
      return { success: false, reason: 'WRONG_PASSWORD' };
    }

    if (error.code === 'auth/account-exists-with-different-credential') {
      return { success: false, reason: 'PROVIDER_MISMATCH' };
    }

    throw error;
  }
};

  const logout = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);

      LoginManager.logOut();

      try {
        await GoogleSignin.signOut();
      } catch (e) {e}
    
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      
    } catch (error: any) {
      Alert.alert('Logout failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        googleSignIn,
        emailSignUp,
        signInWithEmail,
        facebookSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
