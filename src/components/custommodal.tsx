import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../contexts/themeContext';

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<Props> = ({
  visible,
  title = "",
  message = "",
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: colors.card }]}>
        
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          
          {message ? (
            <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.cancelBtn, { borderColor: colors.border }]} 
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  box: {
    width: '100%',
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#EF2A39',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default CustomModal;