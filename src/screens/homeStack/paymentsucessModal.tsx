import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/themeContext';

const SuccessModal = ({ visible, navigation, onClose}: any) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade">
      <View style={styles.overlay}>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          
          <Text style={styles.title}>Success !</Text>
          
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Your payment was successful.{"\n"}
            A receipt for this purchase has{"\n"}
            been sent to your email.
          </Text>
          
          <TouchableOpacity style={styles.button} 
            onPress={() => {
              onClose();
              navigation.reset({index: 0,routes: [{ name: 'Home' }],
            });
          }}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 280,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  iconContainer: {
    backgroundColor: '#EF2A39',
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EF2A39',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#EF2A39',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessModal;