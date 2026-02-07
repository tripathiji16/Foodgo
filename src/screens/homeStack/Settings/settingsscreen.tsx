import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView, 
  Platform 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/themeContext';
import { useAppLock } from '../../../contexts/applockContext';

interface SettingItem {
  id: string;
  title: string;
  icon?: string;
  navigateTo?: string;
  hasToggle?: boolean;
  isThemeToggle?: boolean; 
}

interface SettingSection {
  header: string;
  items: SettingItem[];
}

const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [shopUpdates, setShopUpdates] = useState(false);
  const { isAppLockEnabled } = useAppLock();

  const sections: SettingSection[] = [
    {
      header: 'GENERAL',
      items: [
        { id: '1', title: 'Order History', icon: 'bag-handle-outline', navigateTo: 'OrderHistory' },
        { id: '2', title: 'Payment Details', icon: 'wallet-outline' , navigateTo: 'PaymentDetails'},
        { id: '9', title: 'App Lock', icon: 'lock-closed-outline' , navigateTo: isAppLockEnabled ? 'ManageAppLock' : 'SetAppLockScreen' },
        { 
          id: '3', 
          title: 'Dark Mode', 
          icon: isDark ? 'moon' : 'sunny-outline', 
          isThemeToggle: true 
        },
        { id: '4', title: 'Language', icon: 'language-outline' },
      ],
    },
    {
      header: 'ABOUT & TERMS',
      items: [
        { id: '5', title: 'About Foodgo', icon: 'business-outline', navigateTo: 'About' },
        { id: '6', title: 'Privacy Policy', icon: 'document-text-outline', navigateTo: 'PrivacyPolicy' },
      ],
    },
    {
      header: 'NOTIFICATIONS',
      items: [
        { id: '7', title: 'Shop Updates', hasToggle: true },
        { id: '8', title: 'Notifications', hasToggle: true },
      ],
    },
  ];

  const handlePress = (item: SettingItem) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo);
      return;
    }
  };

  const renderSection = (section: SettingSection) => (
    <View key={section.header} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>
        {section.header}
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {section.items.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.row,
              idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
            disabled={item.hasToggle || item.isThemeToggle }
          >
            <View style={styles.rowLeft}>
              {item.icon && (
                <Ionicons name={item.icon} size={22} color={colors.icon} />
              )}
              <Text style={[styles.rowText, { color: colors.text }]}>
                {item.title}
              </Text>
            </View>

            <View style={styles.rowRight}>
              {/* Notifications Toggle */}
              {item.hasToggle && item.title === 'Notifications' && (
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications} 
                  trackColor={{ false: colors.switchTrackFalse, true: colors.primary }}
                  thumbColor={Platform.OS === 'android' ? "#f4f3f4" : ""}
                />
              )}
              {item.hasToggle && item.title === 'Shop Updates' && (
                <Switch 
                  value={shopUpdates} 
                  onValueChange={setShopUpdates} 
                  trackColor={{ false: colors.switchTrackFalse, true: colors.primary }}
                  thumbColor={Platform.OS === 'android' ? "#f4f3f4" : ""}
                />
              )}

              {item.isThemeToggle && (
                <Switch 
                  value={isDark} 
                  onValueChange={toggleTheme} 
                  trackColor={{ false: colors.switchTrackFalse, true: colors.primary }}
                  thumbColor={Platform.OS === 'android' ? "#f4f3f4" : ""}
                />
              )}

              {item.navigateTo && (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
  
      <SafeAreaView style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.profile}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.name}>{user?.name ?? 'Unknown User'}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>
            <Ionicons name="create-outline" size={14} color="#ffe8e8cc" />
          </TouchableOpacity>
          <Image
            source={{
              uri:
                user?.photoURL ??
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.avatar}
          />
        </View>
      </SafeAreaView>

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {sections.map(renderSection)}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: { 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  nav: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: { 
    fontFamily: Platform.select({
          ios: 'Lobster-Regular', 
          android: 'lobster_regular', 
        }),
    fontSize: 24,
    fontWeight: '400',
    color: '#ffffff',
    paddingLeft: 20,
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  name: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: '700' 
  },
  email: { 
    color: 'rgba(255,255,255,0.8)', 
    marginTop: 4 
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 15 
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  section: { 
    marginTop: 20 
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: { 
    fontSize: 15, 
    fontWeight: '500', 
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default SettingsScreen;