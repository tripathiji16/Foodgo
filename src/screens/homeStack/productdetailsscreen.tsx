import React, { useState } from 'react';
import { Text, StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { HomeStackParamList } from '../../navigation/homeStackNavigation';
import { useTheme } from '../../contexts/themeContext';

type ProductDetailsRouteProp = RouteProp<HomeStackParamList, 'ProductDetails'>;
type ProductDetailsNavigationProp = StackNavigationProp<HomeStackParamList, 'ProductDetails'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const { product } = route.params;
  const navigation = useNavigation<ProductDetailsNavigationProp>();
  
  const { colors } = useTheme();

  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(50); 

 const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };
  const unitPrice = parseFloat(product.cost?.replace('$', '') || '0');
  const totalCost = (unitPrice * quantity).toFixed(2);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>

      {product?.imageUrl && (
          <Image 
            source={typeof product.imageUrl === 'number' ? product.imageUrl : { uri: product.imageUrl }} 
            style={styles.image} 
            resizeMode="contain" 
          />
      )}
      
      <Text style={[styles.title, { color: colors.text }]}>
        {product?.title} {product?.subtitle}
      </Text>

      <Text style={styles.ratings}>
        <Ionicons name="star" size={13} color="#ff8c00ff" /> {product?.ratings} - 40 mins
      </Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
          {product?.details}
      </Text>

   <View style={styles.controlsContainer}>
    <View style={styles.spicyContainer}>
      <Text style={[styles.spicy, { color: colors.text }]}>Spicy</Text>
      <Slider
         value={value}
         onValueChange={setValue}
         minimumValue={0}
         maximumValue={100}
         minimumTrackTintColor="#EF2A39"  
         maximumTrackTintColor={colors.border} 
         thumbTintColor='#EF2A39'  
         style= {styles.slider}
      /></View>
          <View style={styles.portionControl}>
            <Text style={[styles.portion, { color: colors.text }]}>Portion</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={[styles.iconButton, quantity === 0 && styles.disabledButton]} 
                onPress={handleDecrement} disabled={quantity === 0}>
                <Ionicons name='remove-outline' size={20} color='white' />
              </TouchableOpacity>
              
              <Text style={[styles.quantity, { color: colors.text }]}> {quantity} </Text>
              
              <TouchableOpacity style={styles.iconButton} onPress={handleIncrement}>
                <Ionicons name='add-outline' size={20} color='white' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      <View style={styles.footer}>
          <View style={styles.costButton}>
            <Text style={styles.cost}>${totalCost}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.ordernowButton, 
              { backgroundColor: colors.text }, 
              quantity === 0 && { opacity: 0.5 }
            ]}
            disabled={quantity === 0}
            onPress={() => {
              navigation.navigate('OrderScreen', { 
                totalCost: parseFloat(totalCost),
                quantity: quantity,
                product: {
                  id: product.id,
                  title: product.title,
                  subtitle: product.subtitle,
                  imageUrl: product.imageUrl,
                  cost: product.cost
                }
              });
            }}
          >
            <Text style={[styles.ordernowtext, { color: colors.background }]}>ORDER NOW</Text>
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
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  ratings: {
    fontSize: 14,
    color: '#999',
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 10,
    textAlign: 'left',
    marginBottom: 20,
  },
 controlsContainer: {
    width: '95%',
    height:'10%',
    flexDirection: 'row',
    alignItems: 'flex-start',
     marginBottom: 30,
  },
  spicyContainer:{
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '70%'
  },
  spicy: {
    fontSize: 14,
    alignSelf: 'flex-start',
    marginTop: 20,
    fontWeight: '600',
  },
  slider: {
    width: '40%',
    height: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
     shadowColor: '#FF9633',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.5,
     shadowRadius: 6,
     elevation: 8,
  },
  portionControl: {
    width:'31%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  portion: {
    fontSize: 14,
    fontWeight: '600',
    justifyContent: 'flex-start',
    marginBottom: 5
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: "#EF2A39",
    height: 30,
    width: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF9633',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    elevation: 0,
    shadowOpacity: 0,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    minWidth: 20, 
    textAlign: 'center'
  },
    footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    top: hp('1%')
  },
costButton:{
  backgroundColor: '#EF2A39', 
  height: 60, 
  width: 90, 
  alignItems: 'center', 
  justifyContent: 'center', 
  borderRadius: 15,  
  shadowColor: '#FF9633',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 8,
},
cost: {
  fontSize:17,
  color:'white',
  fontWeight:"bold"
},
ordernowButton:{
  height: 60, 
  width: 200, 
  alignItems: 'center', 
   justifyContent: 'center', 
   borderRadius: 15,  
   shadowColor: '#000000ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 8,
},
ordernowtext:{
  fontSize:17,
  fontWeight:"bold"
}
});

export default ProductDetailScreen;