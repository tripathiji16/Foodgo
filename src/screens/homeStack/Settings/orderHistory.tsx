import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomOrderCard from '../../../components/customOrderCard';
import CustomModal from '../../../components/custommodal';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/themeContext';

const OrderHistoryScreen = () => {
  const navigation = useNavigation<any>();

  const { colors } = useTheme();
  
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const STORAGE_KEY = user ? `ORDER_HISTORY_${user.uid}` : null;
  const DELIVERY_DURATION = 10*60 * 1000; 

  const loadOrders = useCallback(async () => {
    try {
      if (!STORAGE_KEY) return;

      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        let storedOrders = JSON.parse(jsonValue);
        let hasUpdates = false;
        const currentTime = Date.now();
        const updatedOrders = storedOrders.map((order: any) => {
          const orderTime = order.timestamp || new Date(order.date).getTime();
          if (
            order.status !== 'Delivered' && 
            order.status !== 'Cancelled' && 
            (currentTime - orderTime >= DELIVERY_DURATION)
          ) {
            hasUpdates = true;
            return { ...order, status: 'Delivered' };
          }
          return order;
        });
        if (hasUpdates) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
          storedOrders = updatedOrders;
        }

        const sorted = [...storedOrders].sort((a, b) => 
          Number(b.id.replace("ORD-", "")) -
          Number(a.id.replace("ORD-", ""))
        );

        setOrders(sorted);
      }
    } catch (e) { 
      console.error("Error loading orders:", e); 
    }
  }, [STORAGE_KEY, DELIVERY_DURATION]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 30000); 

    return () => clearInterval(interval);
  }, [loadOrders]);


  const handleTrack = (id: string) => {
    const order = orders.find(o => o.id === id);
    const orderTime = order?.timestamp || new Date(order?.date).getTime();
    const timePassed = Date.now() - orderTime;
    const minutesLeft = Math.max(0, Math.ceil((DELIVERY_DURATION - timePassed) / 60000));

    Alert.alert(
      "Tracking Order", 
      `The driver is on the way! Approx ${minutesLeft} mins remaining.\n(Simulation: Mark as Delivered now?)`, 
      [
        { text: "Keep Waiting", style: 'cancel' },
        { 
          text: "Force Complete", 
          onPress: async () => {
            const updatedOrders = orders.map(item => 
              item.id === id ? { ...item, status: 'Delivered' } : item
            );

            const sorted = [...updatedOrders].sort((a, b) => 
               Number(b.id.replace("ORD-", "")) - Number(a.id.replace("ORD-", ""))
            );

            setOrders(sorted);

            if (STORAGE_KEY) {
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
            }
          }
        }
      ]
    );
  };

  const handleReOrder = (item: any) => {

    const qty = item.quantity || 1;
    const total = parseFloat(item.totalPaid) || 0;
    const costFloat = total / qty;

    navigation.navigate('Home', {
      screen: 'ProductDetails',
      params: {
        product: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.imageUrl,
          cost: `$${costFloat.toFixed(2)}`
        },
        quantity: qty,
        totalCost: total
      }
    });
  };

  const handleCancelOrder = async (id: string) => {
    Alert.alert("Cancel Order", "Are you sure?", [
      { text: "No", style: 'cancel' },
      {
        text: "Yes, Cancel", style: 'destructive',
        onPress: async () => {
          const updatedOrders = orders.map(item => 
            item.id === id ? { ...item, status: 'Cancelled' } : item
          );

          setOrders(updatedOrders);

          if (STORAGE_KEY) {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
          }
        }
      }
    ]);
  };

  const requestDeleteOrder = (id: string) =>  {
    setSelectedOrderId(id);
    setShowCustomModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrderId) return;
    const updated = orders.filter(item => item.id !== selectedOrderId);
    setOrders(updated);
    if (STORAGE_KEY) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setSelectedOrderId(null);
    setShowCustomModal(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomOrderCard
            item={item}
            onTrack={() => handleTrack(item.id)}
            onCancel={() => handleCancelOrder(item.id)}
            onRate={() => Alert.alert("Rated", "Thank you for your feedback!")}
            onReOrder={() => handleReOrder(item)} 
            onDelete={() => requestDeleteOrder(item.id)}
          />
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No orders placed yet.</Text>
        }
      />
      <CustomModal
        visible={showCustomModal}
        title="Delete Order"
        message="Remove this order from history?"
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => {
          setSelectedOrderId(null);
          setShowCustomModal(false);
        }}
        onConfirm={async () => {
          await confirmDeleteOrder();
          setShowCustomModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
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
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
  }
});

export default OrderHistoryScreen;