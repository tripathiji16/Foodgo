import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/themeContext';

interface OrderItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  quantity: number;
  totalPaid: string;
  status: 'Ongoing' | 'Delivered' | 'Cancelled';
  date: string;
}

interface CustomOrderCardProps {
  item: OrderItem;
  onTrack: () => void;
  onCancel: () => void;
  onRate: () => void;
  onReOrder: () => void;
  onDelete: () => void; 
}

const CustomOrderCard: React.FC<CustomOrderCardProps> = ({ 
  item, onTrack, onCancel, onRate, onReOrder, onDelete 
}) => {
  const { colors, isDark } = useTheme();
  
  const imageSource = item.imageUrl 
    ? { uri: item.imageUrl } 
    : { uri: 'https://cdn-icons-png.flaticon.com/512/135/135763.png' };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return { 
          backgroundColor: isDark ? '#3d2900' : '#FFF3E0', 
          color: '#FF9800' 
        };
      case 'Delivered':
        return { 
          backgroundColor: isDark ? '#052e08' : '#E8F5E9', 
          color: '#4CAF50' 
        };
      case 'Cancelled':
        return { 
          backgroundColor: isDark ? '#3b0005' : '#FFEBEE', 
          color: '#EF2A39' 
        };
      default:
        return {};
    }
  };

  const statusStyle = getStatusStyle(item.status);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.topHeader}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={[styles.dateLabel, { color: colors.textMuted }]}>{item.date}</Text>
          <Text style={[
              styles.statusBadge,
              statusStyle
            ]}>{item.status}</Text>
        </View>
        
        <TouchableOpacity onPress={onDelete} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="close-outline" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.row}>
        <Image source={imageSource} style={styles.image} resizeMode='contain' />
        
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title || "Unknown Item"} {item.subtitle}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {item.quantity} Items
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.totalPaid}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {item.status === 'Ongoing' && (
          <>
            <TouchableOpacity 
              style={[
                styles.btnCancel, 
                { backgroundColor: isDark ? colors.background : '#f5f5f5' }
              ]} 
              onPress={onCancel}
            >
              <Text style={[styles.txtCancel, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnTrack} onPress={onTrack}>
              <Text style={styles.txtTrack}>Track</Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === 'Delivered' && (
          <>
            <TouchableOpacity 
              style={[styles.btnReOrder, { backgroundColor: colors.card, borderColor: colors.primary }]} 
              onPress={onReOrder}
            >
              <Ionicons name="repeat" size={16} color="#EF2A39" style={{ marginRight: 5 }} />
              <Text style={styles.txtReOrder}>Re-Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnRate} onPress={onRate}>
              <Ionicons name="star" size={16} color="white" style={{ marginRight: 5 }} />
              <Text style={styles.txtRate}>Rate</Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === 'Cancelled' && (
           <Text style={[styles.cancelledText, { color: colors.textMuted }]}>Order Cancelled</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  dateLabel: {
    fontSize: 12,
    marginRight: 10
  },
  row: { 
    flexDirection: 'row', 
    marginBottom: 15 
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  info: { 
    flex: 1, 
    marginLeft: 15, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  statusBadge: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    paddingVertical: 3, 
    paddingHorizontal: 8, 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  
  subtitle: { 
    fontSize: 14 
  },
  price: { 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginTop: 2 
  },
  divider: { 
    height: 1, 
    marginBottom: 10, 
    marginTop: -5 },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    gap: 10 
  },
  
  btnTrack: { 
    width: 120,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#EF2A39', 
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 10 
  },
  txtTrack: { 
    color: 'white', 
    fontWeight: '600' 
  },
  btnCancel: { 
    width: 120,
    justifyContent:'center',
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 10 
  },
  txtCancel: { 
    fontWeight: '600' 
  },
  btnRate: { 
    width: 120,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#ffd65bff', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    flexDirection: 'row', 
  },
  txtRate: { 
    color: 'white', 
    fontWeight: '600' 
  },
  btnReOrder: { 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 10, 
    borderWidth: 0.6,
    flexDirection: 'row', 
    alignItems: 'center' ,
    width: 120,
    justifyContent:'center',
  },
  txtReOrder: { 
    color: '#EF2A39', 
    fontWeight: '600' 
  },
  cancelledText: { 
    fontStyle: 'italic', 
    fontSize: 12
   }
});

export default CustomOrderCard;