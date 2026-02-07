import React, { useState, useCallback} from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../contexts/themeContext';

const CURRENT_USER_KEY = 'CURRENT_USER'; 

const PaymentDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [defaultAddress, setDefaultAddress] = useState('');


  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      let currentUser: any = null;
      if (userJson) {
        currentUser = JSON.parse(userJson);
        setDefaultAddress(currentUser.deliveryAddress || 'Home Address');
      }

      const storageKey = currentUser ? `ORDER_HISTORY_${currentUser.uid}` : 'ORDER_HISTORY';
      const jsonValue = await AsyncStorage.getItem(storageKey);
      if (jsonValue != null) {
        const rawOrders = JSON.parse(jsonValue).reverse();

        const grouped = rawOrders.reduce((acc: any, order: any) => {
          const dateKey = order.date ? order.date.split(',')[0] : 'Recent';
          
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(order);
          return acc;
        }, {});

        const sections = Object.keys(grouped).map(date => ({
          title: date,
          data: grouped[date]
        }));

        setGroupedData(sections);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (provider: string) => {
    if (provider === 'MasterCard') return require( '../../../assets/images/mastercard.png');
    if (provider === 'Visa') return require('../../../assets/images/visa.png');
    return null; 
  };

  const renderSectionHeader = ({ section: { title } }: any) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: colors.sectionTitle }]}>{title}</Text>
    </View>
  );

const renderItem = ({ item }: any) => {
  const provider = item.paymentDetails?.provider || "Credit Card";
  const last4 = item.paymentDetails?.last4 || "----";
  const address = item.deliveryAddress || defaultAddress;
  const iconSource = getCardIcon(provider);

  return (
    <View style={[
        styles.cardContainer, 
        { backgroundColor: colors.card, borderColor: colors.border }
    ]}>

      <View style={styles.row1}>
        <Text style={[styles.productTitle, { color: colors.text }]}>{item.title}</Text>
      </View>

      <View style={styles.row2}>
        <Text style={[styles.orderId, { color: colors.textMuted }]}>Order ID: {item.id}</Text>
        <Text style={[styles.amountPaid, { color: colors.primary }]}>₹{item.totalPaid}</Text>
      </View>

      <View style={styles.row3}>
        <View style={[styles.cardIconWrapper, { backgroundColor: colors.background }]}>
          {iconSource ? (
            <Image source={iconSource} style={styles.cardIcon} resizeMode="contain" />
          ) : (
            <Ionicons name="card" size={22} color="#EF2A39" />
          )}
        </View>

        <Text style={[styles.cardNumber, { color: colors.text }]}>•••• •••• •••• {last4}</Text>

        <View style={styles.addressWrapper}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={1}>
            {address}
          </Text>
        </View>
      </View>

    </View>
  );
};

  if (loading) {
    return (
        <View style={[styles.container, {justifyContent:'center', backgroundColor: colors.background}]}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    )
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Details</Text>
        <View style={{ width: 28 }} /> 
      </View>
      <SectionList
        sections={groupedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No payment details found.</Text>
        }
        />
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
    padding: 20,
},
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginLeft: 20,
    fontFamily: Platform.select({
      ios: 'Lobster-Regular', 
      android: 'lobster_regular', 
    }),
  },
  sectionHeader: {
    padding: 10
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  productSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF2A39',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10
  },

  cardHiddenDots: {
    fontSize: 10,
    color: '#202020',
    marginTop: 3
  },
  cardLast4: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202020'
  },
emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16 
  },
  cardContainer: {
  marginHorizontal: 10,
  marginBottom: 5,
  borderRadius: 14,
  padding: 16,
  borderWidth: 0.5,
},

row1: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},

cardIconWrapper: {
  width: 32,
  height: 22,
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
},

cardIcon: {
  width: 24,
  height: 24,
},

productTitle: {
  fontSize: 16,
  fontWeight: '600',
},

row2: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

orderId: {
  fontSize: 13,
  fontWeight: '500',
},

amountPaid: {
  fontSize: 15,
  fontWeight: '700',
  color: '#EF2A39',
},
row3: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

cardNumber: {
  fontSize: 13,
  fontWeight: '600',
},

addressWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '55%',
},
addressText: {
  fontSize: 12,
  fontWeight: '500',
},

});

export default PaymentDetailsScreen;