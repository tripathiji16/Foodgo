import React, {useState} from "react";
import { 
  TouchableOpacity, 
  FlatList, 
  Text, 
  StyleSheet, 
  Platform, 
  View, 
  Image,
} from "react-native";
import { useFavourites } from "../../contexts/favouritesContext";
import cardData from "../../data/carddata.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import CustomModal from "../../components/custommodal";
import { useTheme } from "../../contexts/themeContext";

const Favourites = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const { favourites, toggleFavourite } = useFavourites();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const favData = cardData.filter(item => favourites.includes(item.id));
  
  const handleRemove = (id: number) => {
    setSelectedOrderId(id);
    setShowCustomModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={[styles.topLeft, { color: colors.text }]}>Favourites</Text>
      
      {favData.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No favourites yet</Text>
      ) : (
        <FlatList
          data={favData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.listWrapper, 
                { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }
              ]} 
              onPress={() => navigation.navigate('Home', { 
                screen: 'ProductDetails', 
                params: { product: item }
              })}
            >
              <Image 
                source={{ uri: item.imageUrl }} 
                style={[styles.itemImage, { backgroundColor: colors.card }]} 
                resizeMode='contain'
              />
              <View style={styles.textContainer}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                <Text style={[styles.itemCost, { color: colors.primary }]}>{item.cost}</Text>
              </View>
              <TouchableOpacity 
                style={styles.iconContainer}
                onPress={() => handleRemove(item.id)}
              >
                <Ionicons name="heart" size={24} color="#FF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
      <CustomModal
        visible={showCustomModal}
        title="Remove from Favourites"
        message="Do you really want to remove this item?"
        cancelText="Cancel"
        confirmText="Remove"
        onCancel={() => {
          setSelectedOrderId(null);
          setShowCustomModal(false);
        }}
        onConfirm={async () => {
          if (selectedOrderId !== null) {
            toggleFavourite(selectedOrderId);
            setSelectedOrderId(null);
            setShowCustomModal(false);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topLeft: {
    fontFamily: Platform.select({
      ios: 'Lobster-Regular', 
      android: 'lobster_regular', 
    }),
    fontSize: 24,
    fontWeight: '400',
    paddingLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },
  listWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  itemCost: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    padding: 5,
  },
});

export default Favourites;