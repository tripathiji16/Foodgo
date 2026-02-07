import React, {useState} from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/homeStackNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import SuccessModal from './paymentsucessModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/themeContext';


type ProductParams = {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    cost: string;
};
type OrderScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'OrderScreen'> ;
type OrderScreenRouteProp = RouteProp<HomeStackParamList, 'OrderScreen'> & 
{
  params: {
    totalCost: number;
    quantity: number;
    product?: ProductParams;
  }
};

const OrderScreen = () => {
  const navigation = useNavigation<OrderScreenNavigationProp>();
  const route = useRoute<OrderScreenRouteProp>();
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'mastercard' | 'visa'>('mastercard');
  const [checked, setChecked] = useState(false);
  const { totalCost, product, quantity=1 } = route.params || {};
  const orderPrice = totalCost ? parseFloat(String(totalCost)): 0;
  const tax = 0.50;
  const deliveryFee = 3.40;
  const grandTotal = (orderPrice + tax + deliveryFee).toFixed(2);
  const { user } = useAuth();

const handlePayNow = async () => {
  try {
    const ORDER_HISTORY_KEY = user ? `ORDER_HISTORY_${user.uid}` : null;
    if (!ORDER_HISTORY_KEY) return;

    const paymentInfo =
      selectedCard === "mastercard"
        ? { provider: "MasterCard", type: "Credit Card", last4: "0505" }
        : { provider: "Visa", type: "Credit Card", last4: "8963" };

    const newOrder = {
      id: `ORD-${Date.now()}`,
      title: product?.title || "Unknown Item",
      subtitle: product?.subtitle,
      imageUrl: product?.imageUrl || "",
      quantity: quantity,
      totalPaid: grandTotal,
      status: "Ongoing",
      timestamp: Date.now(),
      deliveryAddress: user?.deliveryAddress || "Home Address",
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      paymentDetails: paymentInfo,
      
    };

    const existingData = await AsyncStorage.getItem(ORDER_HISTORY_KEY);
    let history = existingData ? JSON.parse(existingData) : [];

    history.push(newOrder);

    await AsyncStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));

    setModalVisible(true);
  } catch (e) {
    console.error("Failed to save order", e);
    setModalVisible(true);
  }
};

return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
         <SuccessModal
         visible={modalVisible}
         onClose={() => setModalVisible(false)}
         navigation={navigation} />
      
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Order Summary</Text>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Order</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>${orderPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Taxes</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Delivery Fees</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>${deliveryFee.toFixed(2)}</Text>
      </View>
      
       {/* Dynamic Divider Color */}
       <View style={[styles.line, { backgroundColor: colors.border }]}/>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>${grandTotal}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Estimated delivery time:</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>20-30 mins</Text>
      </View>

      <Text style={[styles.title2, { color: colors.text }]}>Payment Methods</Text>

       <TouchableOpacity 
        style={[
          styles.card1Button, 
          { backgroundColor: selectedCard === 'mastercard' ? '#2a1919ff' : colors.card },
          selectedCard !== 'mastercard' && { borderWidth: 1, borderColor: colors.border }
        ]}
        onPress={() => setSelectedCard('mastercard')}
      > 
        <Image source={require( '../../assets/images/mastercard.png')} style={styles.image1} />
        <View style={styles.carddetailContainer}>
            <Text style={[
                styles.card1text, 
                { color: selectedCard === 'mastercard' ? '#ffffff' : colors.text }
            ]}>
                Credit Card
            </Text>
            <Text style={[styles.cardsubtext, { color: colors.textMuted }]}>5105 **** **** 0505</Text>
        </View>
        <Ionicons 
            name={selectedCard === 'mastercard' ? "radio-button-on-outline" : "radio-button-off-outline"}
            size={25} 
            color={selectedCard === 'mastercard' ? "#ffffff" : colors.primary}
        />
      </TouchableOpacity>

      {/* Card 2: Visa */}
      <TouchableOpacity 
        style={[
          styles.card2Button, 
          { marginTop: 20 },
          { backgroundColor: selectedCard === 'visa' ? '#2a1919ff' : colors.card },
          selectedCard !== 'visa' && { borderWidth: 1, borderColor: colors.border }
        ]}
        onPress={() => setSelectedCard('visa')}
      > 
        <Image source={require('../../assets/images/visa.png')} style={styles.image2} />
        <View style={styles.carddetailContainer}>
            <Text style={[
                styles.card2text, 
                { color: selectedCard === 'visa' ? '#ffffff' : colors.text }
            ]}>
                Credit Card
            </Text>
            <Text style={[styles.cardsubtext, { color: colors.textMuted }]}>3566 **** **** 8963</Text>
        </View>
        <Ionicons 
            name={selectedCard === 'visa' ? "radio-button-on-outline" : "radio-button-off-outline"}
            size={25} 
            color={selectedCard === 'visa' ? "#ffffff" : colors.primary} 
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7}
      onPress={() => setChecked(prev => !prev)} style={{flexDirection: 'row',  alignSelf:'flex-start', margin: 22, }}>
         <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={20}
        color={checked ? '#EF2A39' : colors.textMuted}
      />
         <Text style={[styles.cardsubtext, { color: colors.textMuted, marginLeft: 10 }]}>Save card details for future payments</Text>
      </TouchableOpacity>
     
      <View style={{flexDirection: 'row', gap: 110, paddingHorizontal: 10 }}>
       <View style={styles.costContainer}> 
        <Text style={[styles.costLabel, { color: colors.textMuted }]}>Total Price</Text>
        <Text style={[styles.cost, { color: colors.text }]}>${grandTotal}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.paynowButton, { backgroundColor: colors.text }]} 
        onPress={handlePayNow}
      > 
        <Text style={[styles.paynowtext, { color: colors.background }]}>Pay Now</Text>
      </TouchableOpacity>
     </View>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingLeft: 20, 
  },
   title2: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 40,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  infoContainer: { 
  width: '85%',
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  marginBottom: 10,
},
infoLabel: { 
  fontSize: 16, 
  fontWeight: '400'
},
infoValue: { 
  fontSize: 16, 
  fontWeight: '400'
},
line: { 
    width: '85%', 
    height: 0.8, 
    marginVertical: 15
  },
totalLabel: { 
  fontSize: 16, 
  fontWeight: '600',
  marginTop: 15
},
totalValue: { 
  fontSize: 16, 
  fontWeight: '600',
  marginTop: 15
},
card1Button:{
  flexDirection: 'row',
  alignItems: 'center',
  height: 70, 
  width: 355, 
  borderRadius: 15,  
  shadowColor: '#000000ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 8,
},
card2Button:{
  flexDirection: 'row',
  alignItems: 'center',
  height: 70, 
  width: 355, 
  borderRadius: 15,  
  shadowColor: '#000000ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 8,
  marginTop: 20
},

image1:{
    height:32,
    width: 55,
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: 20
},
image2:{
    height:20,
    width: 62,
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: 18
},
card1text:{
    fontSize: 12,
    fontWeight: '600',
},
card2text:{
    fontSize: 12,
    fontWeight: '600',
},
cardsubtext:{
    fontSize: 12,
    fontWeight: '500',
    marginTop:5,
},
costContainer:{
    flexDirection:'column',
  justifyContent: 'center', 
   bottom:-80
},
carddetailContainer:{
    alignItems:'flex-start', 
    justifyContent:'flex-start', 
    marginRight:95
},
cost: {
  fontSize:30,
  fontWeight:"bold"
},
costLabel: { 
  fontSize: 14, 
  fontWeight: '700',
  alignItems: 'flex-start'
},
paynowButton:{
  height: 60, 
  width: 180, 
  alignItems: 'center', 
   justifyContent: 'center', 
   borderRadius: 15,  
   bottom:-80,
   shadowColor: '#000000ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 8,
},
paynowtext:{
  fontSize:17,
  fontWeight:"bold"
}
});

export default OrderScreen;