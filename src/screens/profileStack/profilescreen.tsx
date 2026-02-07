import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Image, ScrollView, TouchableOpacity,
  ActivityIndicator, Platform, KeyboardAvoidingView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs'; 
import { useAuth } from '../../contexts/AuthContext';
import * as yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomDetail from '../../components/customDetail';
import CustomInput from '../../components/custominput';
import CustomModal from '../../components/custommodal';
import { useTheme } from '../../contexts/themeContext';

const USER_DB_KEY = 'USER_DATABASE';
const CURRENT_USER_KEY = 'CURRENT_USER';

const ProfileUpdateSchema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  username: yup.string().required("Username is required"),
  deliveryAddress: yup.string().required("Delivery address is required"),
  password: yup.string().optional(),
});

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const { user: authUser, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const blank = {
    fullname: '',
    username: '',
    email: '',
    deliveryAddress: '',
    password: '',
    dp: '' as string | null,
  };

  const [userData, setUserData] = useState({ ...blank });
  const [editData, setEditData] = useState({ ...blank });

  useEffect(() => {
    if (authUser) {
      const mapped = {
        fullname: authUser.name || '',
        username: authUser.username || '',
        email: authUser.email || '',
        deliveryAddress: authUser.deliveryAddress || '',
        password: authUser.password || '',
        dp: authUser.photoURL || null
      };

      setUserData(mapped);
      setEditData(mapped);
    }
    setLoading(false);
  }, [authUser]);

  const pickImage = async () => {
    if (!isEditing) return;

    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo'
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      setErrorMessage(errorMessage);
      setErrorModalVisible(true);
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setEditData(prev => ({ ...prev, dp: asset.uri || null }));
  };

  const saveProfileUpdates = async () => {
    try {
      await ProfileUpdateSchema.validate(editData, { abortEarly: false });
    } catch (err: any) {
  setErrorMessage(err?.errors?.[0] || 'Invalid inputs');
  setErrorModalVisible(true);
  return;
}
    setLoading(true);

    try {
      
      let finalDP = userData.dp;
      
      if (editData.dp !== userData.dp && editData.dp) {
        const fileName = `dp_${editData.username.replace(/\s+/g, '')}_${Date.now()}.jpg`;
        const dest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        try {
         
            const sourcePath = editData.dp.startsWith('file://') ? editData.dp : `file://${editData.dp}`;
            
    
            await RNFS.copyFile(editData.dp.replace("file://", ""), dest);
            finalDP = `file://${dest}`;
        } catch (err) {
            console.log("Image copy failed, using original uri", err);
            finalDP = editData.dp; 
        }
      } else if (editData.dp === null) {
          finalDP = null;
      }

      const updatedUser = {
        ...authUser, 
        name: editData.fullname,
        username: editData.username,
        deliveryAddress: editData.deliveryAddress,
        password: editData.password || userData.password,
        photoURL: finalDP,
        email: userData.email 
      };

      const dbRaw = await AsyncStorage.getItem(USER_DB_KEY);
      const users = dbRaw ? JSON.parse(dbRaw) : [];

      const idx = users.findIndex((u: any) => u.uid === authUser?.uid || u.email === authUser?.email);
      
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updatedUser };
      } else {

        users.push(updatedUser);
      }

      await AsyncStorage.setItem(USER_DB_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update Local UI
      const uiMapped = {
        fullname: updatedUser.name || '',
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        deliveryAddress: updatedUser.deliveryAddress || '',
        password: updatedUser.password || '',
        dp: updatedUser.photoURL || null
      };

      setUserData(uiMapped);
      setEditData(uiMapped);
      setIsEditing(false);
      setErrorMessage("Success! Profile updated successfully.");
      setErrorModalVisible(true);
    } catch (e: any) {
      console.error(e);
      setErrorMessage('Unable to save profile.');
      setErrorModalVisible(true);

    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      saveProfileUpdates();
    } else {
      setEditData(userData);
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', backgroundColor: colors.primary }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: colors.primary }]} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.bgBurgercontainer}>
        <Image source={require('../../assets/images/burger_small.png')} style={styles.burger1} />
        <Image source={require('../../assets/images/burger_small.png')} style={styles.burger2} />
      </View>

      <View style={[styles.subcontainerwhite, { backgroundColor: colors.background }]}>
        
        <TouchableOpacity 
            onPress={pickImage} 
            disabled={!isEditing} 
            style={styles.dpContainer}
        >
          <Image 
            source={{ 
              uri: isEditing && editData.dp ? editData.dp : (userData.dp ? userData.dp : 'https://cdn-icons-png.flaticon.com/512/149/149071.png') 
            }} 
            style={[styles.dp, { borderColor: colors.primary }]} 
          />
          {isEditing && (
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={24} color="#FFF" />
            </View>
          )}
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.subcontainer} showsVerticalScrollIndicator={false}>

          {isEditing ? (
            <CustomInput
              label="Full Name"
              value={editData.fullname}
              onChangeText={(text: string) => setEditData({...editData, fullname: text})}
              iconName="user"
              placeholder="Change full name"
            />
          ) : (
            <CustomDetail
              label="Name "
              value={userData.fullname || 'not set'}
              editable={false}
              iconName='user'
            />
          )}

          {isEditing ? (
            <CustomInput
              label="Username"
              value={editData.username}
              onChangeText={(text: string) => setEditData({...editData, username: text})}
              iconName="at-sign"
              placeholder="Change username"
              autoCapitalize="none"
            />
          ) : (
            <CustomDetail
              label="Username "
              value={userData.username}
              editable={false}
              iconName='at-sign'
            />
          )}
          
          {isEditing ? (
            <CustomInput
              label="Email"
              value={editData.email}
              editable={false}
              iconName="mail"
              style={[styles.mail, { color: colors.textMuted }]}
            />
          ) :
          <CustomDetail
              label="Email "
              value={userData.email}
              editable={false}
              iconName='mail'
          />
        }
        
  {isEditing ? (
  <CustomInput
    label="Delivery Address"
    value={editData.deliveryAddress}
    iconName="map-pin"
    placeholder="Add delivery address"
    multiline 
    isDeliveryAddress
    onPressAddAddress={() => {
      navigation.navigate('SelectLocation', {
        onAddressSelected: (address: string) => {
          setEditData(prev => ({
            ...prev,
            deliveryAddress: address,
          }));
        },
      });
    }}
  />
) : (
  <CustomDetail
    label="Delivery Address "
    value={userData.deliveryAddress}
    editable={false}
    iconName="map-pin"
  />
)}


          {isEditing ? (
            <CustomInput
              label="Password"
              value={editData.password}
              onChangeText={(text: string) => setEditData({...editData, password: text})}
              iconName="lock"
              placeholder="Change Password"
              isPassword={true}
            />
          ) : (
            <CustomDetail
              label="Password "
              value={userData.password}
              editable={false}
              iconName='lock'
              isPassword={true}
            />
          )}

          <View style={styles.buttonArea}>
            
            <TouchableOpacity 
                style={[
                    styles.editprofileButton, 
                    { backgroundColor: isEditing ? colors.primary : colors.text },
                    isEditing && styles.saveButtonState
                ]} 
                onPress={toggleEdit}
            >
              <Text style={[styles.editprofileText, { color: colors.background }]}>
                {isEditing ? "Save Edits" : "Edit Profile"}
              </Text>
              <Ionicons 
                name={isEditing ? 'checkmark-circle-outline' : 'create-outline'} 
                size={20} 
                color={colors.background} 
              />
            </TouchableOpacity>

            <CustomModal
                visible={showLogoutModal}
                title="Log Out"
                message="Do you really want to end your session?"
                cancelText="Cancel"
                confirmText="Log Out"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={async () => {
                    setShowLogoutModal(false);
                    await logout(); 
                }}
            />
            <CustomModal
            visible={errorModalVisible}
            message={errorMessage}
            confirmText="OK"
            onConfirm={() => setErrorModalVisible(false)}
            />

            <TouchableOpacity 
                style={[
                    styles.logoutButton, 
                    { backgroundColor: colors.background, borderColor: colors.primary }
                ]} 
                onPress={isEditing ? cancelEdit : () => setShowLogoutModal(true)}
            >
              <Text style={styles.logoutText}>
                {isEditing ? "Cancel" : "Log Out"}
              </Text>
              <Ionicons 
                name={isEditing ? 'close-circle-outline' : 'log-out-outline'} 
                size={20} 
                color='#EF2A39' 
              />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  subcontainerwhite: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '80%',
    borderRadius: 30,
    paddingTop: 20,
  },
  subcontainer: {
    alignItems: 'center',
    paddingBottom: 50,
    maxWidth: 'auto'
  },
  dpContainer: {
    marginTop: -120,
    borderRadius: 20,
    elevation: 5,
    position: 'relative'
  },
  dp: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 4,
    backgroundColor: '#556080'
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 16, 
  },
  bgBurgercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  burger1: {
    width: 150,
    height: 150,
    left: -60,
    opacity: 0.2,
  },
  burger2: {
    width: 150,
    height: 150,
    right: -60,
    opacity: 0.2,
  },
  
  buttonArea: {
    flexDirection: 'row', 
    gap: 20, 
    marginTop: 40,
    alignItems: 'center', 
    marginBottom: 50 
  },
  editprofileButton: {
    height: 60,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    shadowColor: '#FF9633',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    gap: 10
  },
  saveButtonState: {
    backgroundColor: '#EF2A39',
  },
  editprofileText: {
    fontSize: 17,
    fontWeight: "bold"
  },
  logoutButton: {
    height: 60,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 10
  },
  logoutText: {
    fontSize: 17,
    color: '#EF2A39',
    fontWeight: "bold"
  },
  inputContainer: {
    width: '85%',
    marginBottom: 15,
  },
  inputLabel: {
    color: '#838383',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '600'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0
  },
  mail:{
    height: 50,
    fontWeight: '500'
  }
});

export default ProfileScreen;