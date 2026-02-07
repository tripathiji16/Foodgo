import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppLock } from '../../../../contexts/applockContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../../contexts/themeContext';
import CustomModal from '../../../../components/custommodal';

const ManageAppLockScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { disableAppLock } = useAppLock();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const handleDisablePress = () => {
    setShowDisableModal(true);
  };
  const onConfirmDisable = async () => {
    setShowDisableModal(false);
    await disableAppLock();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>App Lock</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <TouchableOpacity
          style={[styles.row, { borderColor: colors.border }]}
          onPress={() => navigation.navigate('SetAppLockScreen' as never)}
        >
          <Text style={[styles.rowText, { color: colors.text }]}>Reset PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.dangerRow, { borderColor: colors.border }]}
          onPress={handleDisablePress}
        >
          <Text style={[styles.rowText, styles.dangerText]}>
            Disable App Lock
          </Text>
        </TouchableOpacity>
      </View>
      <CustomModal
        visible={showDisableModal}
        title="Disable App Lock"
        message="Are you sure you want to disable app lock?"
        confirmText="Disable"
        cancelText="Cancel"
        onCancel={() => setShowDisableModal(false)}
        onConfirm={onConfirmDisable}
      />
    </SafeAreaView>
  );
};

export default ManageAppLockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    gap: 20,
    alignItems: 'center', 
    padding: 20,
  },
  headerTitle: {
    fontSize: 24, 
    fontFamily: Platform.select({ 
      ios: 'Lobster-Regular', 
      android: 'lobster_regular' 
    }) 
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  rowText: {
    fontSize: 16,
  },
  dangerRow: {
    marginTop: 24,
  },
  dangerText: {
    color: '#EF2A39', 
  },
});