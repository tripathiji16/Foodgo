import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavourites } from '../contexts/favouritesContext';
import { useTheme } from '../contexts/themeContext'; 
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

type CardProps = PropsWithChildren<{
  id: number;
  title?: string;
  imageUrl?: string | number;
  subtitle?: string;
  ratings?: number;
  cost?: string;
  isFavourite: boolean;
  onToggleFavourite: (id: number) => void;
}>;


const Card = ({ id, title, imageUrl, subtitle, ratings, cost }: CardProps) => {
  const { favourites, toggleFavourite } = useFavourites();
  const { colors } = useTheme(); 

  const isFavourite = favourites.includes(id);

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>

      <View style={styles.topContainer}>
      {imageUrl && (
        <Image
          source={typeof imageUrl === 'number' ? imageUrl : { uri: imageUrl as string }}
          style={styles.image}
        />
      )}
      {ratings && (
        <Text style={[styles.ratings, { color: colors.text }]}>
          <Ionicons name="star" size={wp('3%')} color="#ff8c00ff" /> {ratings}
        </Text>
      )}
      </View>

      <View style={styles.bottomContainer}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      )}
           <View style={styles.costContainer}>
           {cost && (
             <Text style={styles.cost}>{cost}</Text>
           )}
           <TouchableOpacity onPress={() => toggleFavourite(id)}>
              <Ionicons 
                name={isFavourite ? "heart" : "heart-outline"} 
                size={wp('5%')} 
                style={styles.heart}
                color={isFavourite ? "#EF2A39" : colors.icon} 
              />
           </TouchableOpacity>
           </View>
      </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex:1,
    flexDirection: 'column',
    borderRadius: 14,
    width: wp('45%'),
    height: hp('40%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
   topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
  },
  image: {
    resizeMode:'contain',
    height: hp('30%'),
    width: wp('30%'),
    alignSelf: 'center',
    position: 'absolute',
  },
  ratings:{
    fontSize: wp('3%'),
    fontWeight: '500',
    marginHorizontal: 10,
    marginTop: '60%',
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    marginTop: wp('1%'),
    marginHorizontal: wp('2%'),
    justifyContent: 'flex-start'
  },
  subtitle: {
    fontSize: wp('3.5%'),
    marginHorizontal: wp('2%'),
    justifyContent: 'flex-start'
  },
  costContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'flex-end',
     marginHorizontal: wp('2%'),
     marginVertical: hp('1%'),
     bottom: 10
  },
  cost:{
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#EF2A39',
  },
  heart: { 
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
});

export default Card;