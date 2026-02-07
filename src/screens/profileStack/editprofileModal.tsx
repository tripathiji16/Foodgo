//NOT IN USE ANYMORE

import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import CustomInput from '../../components/custominput';
import RNFS from 'react-native-fs';


interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (updatedData: any) => void;
  initialData: any;
  
}

const EditProfileModal = ({ visible, onClose, onSubmit, initialData }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    deliveryAddress: '',
    dp: null as string | null,
    password: ''
  });

  useEffect(() => {
    if (visible && initialData) {
      setFormData({
        fullname: initialData.fullname || '',
        username: initialData.username || '',
        password: initialData.password || '',
        deliveryAddress: initialData.deliveryAddress || '',
        dp: initialData.dp || null,
      });
    }
  }, [visible, initialData]);

  const passwordSchema = yup.string()
   .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least 1 lower case letter")
    .matches(/[A-Z]/, "Password must contain at least 1 upper case letter")
    .matches(/[0-9]/, "Password must contain at least 1 number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
    .required("Password is required");

    const EditProfileSchema = yup.object().shape({
  fullname: yup.string().required("Full name is required"),
  username: yup.string().required("Username is required"),
  deliveryAddress: yup.string().required("Delivery address is required"),
  password: passwordSchema, 
});

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const saveImagePermanently = async (tempUri: string) => {
  try {
    const fileName = `dp_${Date.now()}.jpg`;
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.copyFile(tempUri, destPath);
    return `file://${destPath}`;
  } catch (error) {
    console.log("Image save failed:", error);
    Alert.alert("Error", "Unable to save image securely");
    return null;
  }
};

  const handleSelectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8, 
      maxWidth: 800,
      maxHeight: 800,
      selectionLimit: 1,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        const MAX_SIZE = 2 * 1024 * 1024; 
        if (asset.fileSize && asset.fileSize > MAX_SIZE) {
          Alert.alert('File too large', 'Please select an image under 2MB.');
          return;
        }
        if (asset.uri) {
          const savedUri = await saveImagePermanently(asset.uri);
          if(savedUri){
          handleChange('dp', asset.uri);
          }
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleImagePickOptions = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Choose from Library", 
        onPress: handleSelectImage 
      },
      { 
        text: "Remove Photo", 
        style: 'destructive', 
        onPress: () => handleChange('dp', '') 
      }
    ]);
  };

const handleSave = async () => {
  try {
    await EditProfileSchema.validate(formData, { abortEarly: false });
    onSubmit(formData);
  } catch (err: any) {
    if (err.inner && err.inner.length > 0) {
      Alert.alert("Validation Error", err.inner[0].message);
    } else {
      Alert.alert("Validation Error", err.message);
    }
  }
};

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleImagePickOptions}>
                <Image 
                  source={{ 
                    uri: formData.dp 
                      ? formData.dp 
                      : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
                  }} 
                  style={styles.profileImage} 
                />
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>

            <CustomInput
                label="Full Name"
                iconName="user"
                value={formData.fullname}
                onChangeText={(t) => handleChange('fullname', t)}
                placeholder="Change full name"
            />

            <CustomInput
                label="Username"
                iconName="at-sign"
                value={formData.username}
                onChangeText={(t) => handleChange('username', t)}
                placeholder="Change username"
                autoCapitalize="none"
            />

            <CustomInput
                label="Password"
                iconName="lock"
                value={formData.password}
                onChangeText={(t) => handleChange('password', t)}
                placeholder="Change Password"
                isPassword
            />

            <CustomInput
                label="Delivery Address"
                iconName="map-pin"
                value={formData.deliveryAddress}
                onChangeText={(t) => handleChange('deliveryAddress', t)}
                placeholder="Change your address"
                multiline={true}
                style={styles.daInput} 
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF2A39',
    fontFamily: Platform.select({
        ios: 'Lobster-Regular', 
        android: 'lobster_regular', 
      }),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  daInput: { 
    height: 65, 
    textAlignVertical: 'top', 
    paddingVertical: 15 
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#EF2A39',
    padding: 6,
    borderRadius: 15,
  },
  saveButton: {
    backgroundColor: '#EF2A39',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    
  },
});

export default EditProfileModal;