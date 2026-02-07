import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { useTheme } from '../../contexts/themeContext';

type SavedLocation = {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
};

const STORAGE_KEY = '@foodgo_saved_addresses';

// JSON Style for Google Maps (Android / iOS Google Maps)
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];

const SelectLocationScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  const mapRef = useRef<MapView>(null);
  const reverseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { onAddressSelected } = route.params || {};

  const [region, setRegion] = useState<Region>({
    latitude: 26.8435,
    longitude: 80.9433,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [currentAddressFull, setCurrentAddressFull] = useState('');
  const [gettingLocation, setGettingLocation] = useState(true);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) setSavedLocations(JSON.parse(jsonValue));
      } catch (e) {
        console.log('Failed to load addresses', e);
      }
    })();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location access is required.');
      setGettingLocation(false);
      return;
    }

    setGettingLocation(true);
    Keyboard.dismiss();
    setSearchResults([]);

    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const newRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        setGettingLocation(false);
        setInitialised(true);
      },
      () => {
        Alert.alert('Error', 'Unable to fetch location');
        setGettingLocation(false);
        setInitialised(true);
      },
      { enableHighAccuracy: Platform.OS === 'android', timeout: 15000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const fetchAddressForRegion = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { 'User-Agent': 'FoodgoApp/1.0' } }
      );
      const data = await res.json();
      if (data?.display_name) {
        setSearchText(data.display_name);
        setCurrentAddressFull(data.display_name);
      }
    } catch (e) {
      console.log('Reverse geocode failed', e);
    }
  };

  const onRegionChange = () => {
    if (!isMapMoving) setIsMapMoving(true);
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    if (!initialised) return;

    setIsMapMoving(false);
    setRegion(newRegion);

    if (reverseTimer.current) clearTimeout(reverseTimer.current);

    reverseTimer.current = setTimeout(() => {
      fetchAddressForRegion(newRegion.latitude, newRegion.longitude);
    }, 400);
  };

  const handleSearchTextChange = async (text: string) => {
    setSearchText(text);
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=json&limit=5`,
        { headers: { 'User-Agent': 'FoodgoApp/1.0' } }
      );
      setSearchResults(await res.json());
    } catch (e) {
      console.log('Search error', e);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: any) => {
    const newRegion: Region = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setSearchResults([]);
    Keyboard.dismiss();
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleSaveLocation = async (label: string) => {
    if (!currentAddressFull) return;

    const updated = [
      ...savedLocations,
      {
        id: Date.now().toString(),
        label,
        address: currentAddressFull,
        latitude: region.latitude,
        longitude: region.longitude,
      },
    ];

    setSavedLocations(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDeleteLocation = async (id: string) => {
    const updated = savedLocations.filter(i => i.id !== id);
    setSavedLocations(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const selectSavedLocation = (item: SavedLocation) => {
    const newRegion: Region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleConfirm = () => { 
    setLoadingConfirm(true); 
    setTimeout(() => { 
      if (onAddressSelected) { 
        onAddressSelected(currentAddressFull); 
      } 
      setLoadingConfirm(false); 
      navigation.goBack(); 
    }, 500); };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color="#EF2A39" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search for area, street name..."
            style={[styles.input, { color: colors.text }]}
            value={searchText}
            onChangeText={handleSearchTextChange}
            placeholderTextColor={colors.textMuted}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); setSearchResults([]); }}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {searchResults.length > 0 && (
          <View style={[styles.resultsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.resultItem, { borderBottomColor: colors.border }]} 
                  onPress={() => selectSearchResult(item)}
                >
                  <Ionicons name="location-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={undefined} 
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChange={onRegionChange}
          onRegionChangeComplete={onRegionChangeComplete}
          customMapStyle={isDark ? darkMapStyle : []} 
          userInterfaceStyle={isDark ? 'dark' : 'light'} 
        />
        
        <View style={styles.centerMarkerContainer}>
             <View style={styles.markerCircle}>
                <Ionicons name="location-sharp" size={30} color="#EF2A39" />
             </View>
             <View style={styles.markerStick} />
        </View>

        <TouchableOpacity 
            style={[styles.reCenterBtn, { backgroundColor: colors.card }]} 
            onPress={getCurrentLocation}
            activeOpacity={0.8}
        >
            <Ionicons name="locate" size={24} color={colors.text} />
        </TouchableOpacity>

        {gettingLocation && (
           <View style={styles.loadingBadge}>
              <ActivityIndicator size="small" color="white" style={{marginRight: 5}} />
              <Text style={styles.loadingText}>Finding you...</Text>
           </View>
        )}
        
        {!gettingLocation && isMapMoving && (
            <View style={styles.loadingBadge}>
                <Text style={styles.loadingText}>Locating...</Text>
            </View>
        )}
      </View>

      <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
       <View style={{maxHeight: '80%'}}>
        <View style={[styles.locationHeader, { borderBottomColor: colors.border }]}>
            <Ionicons name="navigate-circle" size={28} color="#EF2A39" />
            <View style={{marginLeft: 10, flex: 1}}>
                <Text style={[styles.smallLabel, { color: colors.textMuted }]}>SELECT LOCATION</Text>
                <Text style={[styles.currentAddressText, { color: colors.text }]} numberOfLines={2}>
                   {gettingLocation ? "Getting your location..." : (isMapMoving ? "Fetching address..." : currentAddressFull || "Move map to select")}
                </Text>
            </View>
        </View>

        <View style={styles.saveSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Save as</Text>
            <View style={styles.labelRow}>
                {['Home', 'Work', 'Other'].map(label => (
                  <TouchableOpacity 
                    key={label}
                    style={[
                        styles.labelBtn, 
                        { backgroundColor: colors.card, borderColor: colors.border }
                    ]} 
                    onPress={() => handleSaveLocation(label)}
                  >
                      <Ionicons 
                        name={label === 'Home' ? "home-outline" : label === 'Work' ? "briefcase-outline" : "bookmark-outline"} 
                        size={18} 
                        color={colors.text} 
                      />
                      <Text style={[styles.labelText, { color: colors.text }]}>{label}</Text>
                  </TouchableOpacity>
                ))}
            </View>
        </View>

        {savedLocations.length > 0 && (
            <View style={styles.listSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Addresses</Text>
                <FlatList 
                    data={savedLocations}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{paddingBottom: '40%'}}
                    renderItem={({item}) => (
                        <View style={[
                            styles.savedCard, 
                            { backgroundColor: colors.card, borderColor: colors.border }
                        ]}>
                            <TouchableOpacity 
                              style={styles.savedCardContent} 
                              onPress={() => selectSavedLocation(item)}
                            >
                                <View style={styles.savedIcon}>
                                    <Ionicons name={item.label === 'Home' ? 'home' : 'location'} size={18} color="white" />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={[styles.savedLabel, { color: colors.text }]}>{item.label}</Text>
                                    <Text style={[styles.savedAddress, { color: colors.textMuted }]} numberOfLines={1}>{item.address}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.deleteBtn} 
                                onPress={() => handleDeleteLocation(item.id)}
                            >
                                <Ionicons name="close" size={16} color={colors.textMuted} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )}
        </View>
        <View style={{paddingVertical: 10, backgroundColor: colors.background}}>
            <TouchableOpacity 
            style={styles.confirmBtn} 
            onPress={handleConfirm}
            disabled={isMapMoving || loadingConfirm || gettingLocation}
        >
          {loadingConfirm ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmText}>Confirm Location</Text>
          )}
        </TouchableOpacity>
        </View>
 
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height: 2}
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%'
  },
  useCurrentLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  useCurrentLocText: {
    color: '#EF2A39',
    fontWeight: '600',
    fontSize: 14
  },
  resultsList: {
    position: 'absolute',
    top: 65,
    left: 20,
    right: 20,
    borderRadius: 10,
    maxHeight: 200,
    elevation: 5,
    zIndex: 20,
    borderWidth: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  resultText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    marginBottom: -25, 
  },
  centerMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15, 
    marginTop: -35,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerCircle: {
    marginBottom: 0,
  },
  markerStick: {
    width: 7,
    height: 7,
    backgroundColor: '#0000004d',
    borderRadius: 2,
    marginTop: -2
  },
  reCenterBtn: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 5
  },
  loadingBadge: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  loadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  bottomSheet: {
    maxHeight: '60%',
    minHeight: '20%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop:20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 15,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 15
  },
  smallLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase'
  },
  currentAddressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveSection: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 10
  },
  labelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  labelText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500'
  },
  listSection: {
    marginBottom: 10,
    marginTop:5
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical:5,
    borderWidth: 1,
    paddingVertical: 5
  },
  savedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  deleteBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  savedIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  savedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  savedAddress: {
    fontSize: 10,
  },
  confirmBtn: {
    backgroundColor: '#EF2A39',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#EF2A39",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Lobster-Regular', 
      android: 'lobster_regular', 
    }),
  },
});

export default SelectLocationScreen;