import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type Order = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  quantity: number;
  totalPaid: string;
  status: string;
  deliveryAddress: string;
  date: string;
  paymentDetails: {
    provider: string;
    type: string;
    last4: string;
  };
};

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Order) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const key = `ORDER_HISTORY_${user.uid}`;
        const storedOrders = await AsyncStorage.getItem(key);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders([]);
        }
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);

  const addOrder = async (newOrder: Order) => {
    if (!user?.uid) return;

    try {
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);

      const key = `ORDER_HISTORY_${user.uid}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Failed to save order", e);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};