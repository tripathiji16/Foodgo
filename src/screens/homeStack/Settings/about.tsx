import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/themeContext';

const About = () => {
  const navigation = useNavigation<any>();

  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About Foodgo</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Foodgo is a modern food ordering platform designed to make discovering
          and enjoying great food simple, fast, and reliable.
        </Text>

        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Our goal is to connect users with their favorite meals while delivering
          a smooth, hassle-free experience from browsing to checkout.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>What we focus on</Text>

        <View style={styles.bulletRow}>
          <Ionicons name="checkmark-circle" size={18} color="#EF2A39" />
          <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
            <Text style={styles.bold}>Convenience</Text> – Easy navigation, quick
            ordering, and real-time updates
          </Text>
        </View>

        <View style={styles.bulletRow}>
          <Ionicons name="checkmark-circle" size={18} color="#EF2A39" />
          <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
            <Text style={styles.bold}>Quality</Text> – Carefully curated food
            options and trusted partners
          </Text>
        </View>

        <View style={styles.bulletRow}>
          <Ionicons name="checkmark-circle" size={18} color="#EF2A39" />
          <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
            <Text style={styles.bold}>Reliability</Text> – Consistent performance
            and secure transactions
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 20, color: colors.textSecondary }]}>
          At Foodgo, we believe food should be accessible, enjoyable, and
          stress-free. Whether you’re ordering a quick bite or planning a meal,
          we work behind the scenes to ensure everything runs seamlessly.
        </Text>

        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          We’re continuously improving our platform by listening to user
          feedback and enhancing features to better serve your needs.
        </Text>

        <Text style={styles.footerText}>
          Thank you for choosing Foodgo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    marginLeft: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 12,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 10,
  },
  bold: {
    fontWeight: '600',
  },

  footerText: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: Platform.select({
      ios: 'Lobster-Regular',
      android: 'lobster_regular',
    }),
    fontWeight: '600',
    color: '#EF2A39',
  },
});

export default About;