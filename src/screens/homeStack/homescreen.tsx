import React, { useState, useCallback } from 'react'; 
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../components/card';
import carddata from '../../data/carddata.json';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/homeStackNavigation';
import FilterScreen from './filterScreen';
import { useFavourites } from '../../contexts/favouritesContext';
import { useAuth } from '../../contexts/AuthContext'; 
import { useTheme } from '../../contexts/themeContext';

const CATEGORIES = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Combos' },
  { id: '3', name: 'Sliders' },
  { id: '4', name: 'Classics' },
];

const { width: screenWidth } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const GAP = 20; 
const ASPECT_RATIO = { width: 3, height: 3.5 };

const totalGapSize = (NUM_COLUMNS + 1) * GAP;
const availableWidth = screenWidth - totalGapSize;
const cardWidth = availableWidth / NUM_COLUMNS;
const cardHeight = cardWidth * (ASPECT_RATIO.height / ASPECT_RATIO.width);

type CardItem = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string ;
  ratings: number;
  cost: string;
  type: string;
  category: string;
  details: string;
};

const cardData: CardItem[] = carddata as CardItem[];

type HomeHeaderProps = {
  activeCategory: string;
  setActiveCategory: (name: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  onFilterPress: () => void;
  userdp: string | null;
  onProfilePress: () => void;
};

const HomeHeader = ({
  activeCategory,
  setActiveCategory,
  searchText,
  setSearchText,
  onFilterPress,
  userdp,
  onProfilePress
}: HomeHeaderProps) => {

  const { colors } = useTheme();

  return (
    <SafeAreaView >
      <View style={styles.top}>
  
        <Text style={[styles.topLeft, { color: colors.text }]}>Foodgo</Text>
        <TouchableOpacity onPress={onProfilePress}>
        <Image 
          source={{ 
            uri: userdp 
              ? userdp 
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          }} 
          style={styles.topRight} 
        /></TouchableOpacity>
      </View>

      <Text style={[styles.subtext, { color: colors.textMuted }]}>Order your favourite food</Text>

      <View style={styles.searchboxcontainer}>
 
        <View style={[styles.searchbox, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={25} color={colors.text} />
          <TextInput 
            placeholder="Search" 
            placeholderTextColor={colors.textMuted}
            style={[styles.searchboxtext, { color: colors.text }]}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={[styles.filterbutton, { backgroundColor: colors.primary }]} onPress={onFilterPress}>
          <Ionicons name="options" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalscroll}
      >
        {CATEGORIES.map(category => {
          const isSelected = category.name === activeCategory;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.name)}
              style={[
                styles.hscrollbutton,
                { backgroundColor: isSelected ? colors.primary : colors.border },
                isSelected && styles.activebutton
              ]}
            >
              <Text
                style={[
                  styles.hscrollbuttonText,
                  { color: isSelected ? 'white' : colors.textSecondary },
                  isSelected && styles.activetext
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};


type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  
  const { user } = useAuth(); 
  const [userdp, setUserdp] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20);
  const [filterType, setFilterType] = useState('All');
  const [maxRating, setMaxRating] = useState(5);

  const { favourites, toggleFavourite } = useFavourites();

  useFocusEffect(
    useCallback(() => {
      setUserdp(user?.photoURL ?? null);
    }, [user])
  );


  const handleClearFilters = () => {
    setMaxPrice(20);
    setFilterType("All");
    setMaxRating(5);
  };


  const filteredData = cardData.filter(item => {
    const cat = item.category.toLowerCase();

    const categoryMatch =
      selectedCategory === 'All' ||
      (selectedCategory === 'Combos' && cat === 'combo') ||
      (selectedCategory === 'Sliders' && cat === 'slider') ||
      (selectedCategory === 'Classics' && cat.includes('classic'));

    const searchMatch = item.title.toLowerCase().includes(searchText.toLowerCase());
    const costMatch = parseFloat(item.cost.replace('$', '')) <= maxPrice;

    const typeMatch = filterType === 'All'
      ? true
      : item.type.toLowerCase() === filterType.toLowerCase();

    const ratingMatch = item.ratings <= maxRating; 

    return categoryMatch && searchMatch && costMatch && typeMatch && ratingMatch;
  });

  const renderItem = ({ item }: { item: CardItem }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Card
        id={item.id}
        imageUrl={item.imageUrl}
        subtitle={item.subtitle}
        ratings={item.ratings}
        title={item.title}
        cost={item.cost}
        isFavourite={favourites.includes(item.id)} 
        onToggleFavourite={toggleFavourite} 
      />
    </TouchableOpacity>
  );


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <HomeHeader
        activeCategory={selectedCategory}
        setActiveCategory={setSelectedCategory}
        searchText={searchText}
        setSearchText={setSearchText}
        onFilterPress={() => setModalVisible(true)}
        userdp={userdp}
        onProfilePress ={()=> {navigation.navigate('SettingsScreen')} }
      />

      {filteredData.length === 0 ?  (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No item found.</Text>
      ) : (
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{paddingBottom: 120, }}
        showsVerticalScrollIndicator={false}
      />
      )}

      <FilterScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentMaxPrice={maxPrice}
        currentType={filterType}
        currentRating={maxRating}
        onApply={(price, type, rating) => {
          setMaxPrice(price);
          setFilterType(type);
          setMaxRating(rating);
        }}
        onClear={handleClearFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  topLeft: {
    fontFamily: Platform.select({
      ios: 'Lobster-Regular', 
      android: 'lobster_regular', 
    }),
    fontSize: wp('10%'),
    fontWeight: '400',

  },
  topRight: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: '#556080'
  },
  subtext: {
    fontSize: wp('3.5%'),
    marginLeft: 10,
  },
  searchboxcontainer: {
    marginTop: wp('3%'),
    width: wp('100%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10, 
    alignItems: 'center',
  },
  searchbox: {
    width: wp('78%'),
    height: '90%',
    flexDirection:"row",
    alignItems:"center",
    borderRadius: 15,
    shadowColor:"#000000",
    shadowOffset:{width:0, height:2},
    shadowOpacity:0.25,
    shadowRadius:3.84,
    elevation:5,
    paddingHorizontal:10,
  },
  searchboxtext:{
    marginLeft:10,
    fontSize:16,
    flex:1,
 
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,

  },
  filterbutton:{

    height:56,
    width:56,
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center",
    shadowColor:"#000000",
    shadowOffset:{
      width:0, height:2
    },
    shadowOpacity:0.25,
    shadowRadius:3.84,
    elevation:8
  },
  horizontalscroll: {
    marginTop: 15,
    marginBottom: Platform.select({
      ios: -25,
      android: 1
    }),
    marginHorizontal: 10,
    height: Platform.select({
      ios: 45,
      android: 55
    }),
  },
  hscrollbutton: {
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 15,
    paddingHorizontal: 25,
  },
  hscrollbuttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activebutton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activetext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardWrapper: {
    width: cardWidth,
    height: cardHeight,
    marginHorizontal: 15,
    marginBottom: GAP,
    alignItems: 'center',
    marginTop: 10
  },
});

export default HomeScreen;