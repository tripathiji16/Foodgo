import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../contexts/themeContext';

type FilterScreenProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (maxPrice: number, type: string, rating: number) => void;
  onClear: () => void;
  currentMaxPrice: number;
  currentType: string;
  currentRating: number; 
};

const FilterScreen = ({
  visible,
  onClose,
  onApply,
  onClear,
  currentMaxPrice,
  currentType,
  currentRating = 0,
}: FilterScreenProps) => {
  const { colors } = useTheme();

  const [localPrice, setLocalPrice] = useState(currentMaxPrice);
  const [localType, setLocalType] = useState(currentType);
  const [localRating, setLocalRating] = useState(currentRating);

  useEffect(() => {
    if (visible) {
      setLocalPrice(currentMaxPrice);
      setLocalType(currentType);
      setLocalRating(currentRating);
    }
  }, [visible, currentMaxPrice, currentType, currentRating]);

  const handleApply = () => {
    onApply(localPrice, localType, localRating);
    onClose();
  };
    const handleClear = () => {
  setLocalPrice(20);
  setLocalType("All");
  setLocalRating(5);
  onClear();
  onClose();
};
  const renderStars = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setLocalRating(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= localRating ? 'star' : 'star-outline'}
              size={25}
              color={star <= localRating ? '#FFC107' : colors.textMuted}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
        <Text style={[styles.ratingValueText, { color: colors.textMuted }]}>
            {localRating > 0 ? `& Up` : ''}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.filterLabel, { color: colors.text }]}>
            Max Price: <Text style={{ color: '#EF2A39' }}>${localPrice.toFixed(2)}</Text>
          </Text>
          
          <Slider
            minimumValue={0}
            maximumValue={20}
            minimumTrackTintColor="#EF2A39"
            maximumTrackTintColor={colors.border}
            thumbTintColor="#EF2A39"
            value={localPrice}
            style={styles.slider}
            onValueChange={setLocalPrice}
            step={0.5}
          />
          <View style={styles.priceLabels}>
            <Text style={[styles.smallText, { color: colors.textMuted }]}>$0</Text>
            <Text style={[styles.smallText, { color: colors.textMuted }]}>$20</Text>
          </View>
          
           <Text style={[styles.filterLabel, { color: colors.text }]}>Minimum Rating</Text>
          {renderStars()}

          <Text style={[styles.filterLabel, { color: colors.text }]}>Preference</Text>
          <View style={styles.radioContainer}>
            {['All', 'Veg', 'Non-Veg'].map((type) => {
               const isActive = localType === type;
               return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.radioButton,
                    { 
                      backgroundColor: isActive ? '#EF2A39' : colors.card, 
                      borderColor: isActive ? '#EF2A39' : colors.border 
                    }
                  ]}
                  onPress={() => setLocalType(type)}
                >
                  <Text
                    style={[
                      styles.radioText,
                      { color: isActive ? 'white' : colors.text },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.clearButton, 
              { backgroundColor: colors.card, borderColor: colors.border }
            ]} 
            onPress={handleClear}
          >
            <Text style={[styles.clearButtonText, { color: colors.text }]}>Clear</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 12,
  },
  slider:{ 
    width: '100%', 
    height: 40,
    shadowColor: '#FF9633',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.5,
     shadowRadius: 6,
     elevation: 8,
},
starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingValueText: {
      marginLeft: 10,
      fontWeight: '600'
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    marginBottom: 30,
  },
  radioButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
     elevation: 2, 
  },
  radioText: {
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#EF2A39',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width: 175
  },
  filterButtons:{
    flexDirection:'row', 
    alignContent:'center', 
    justifyContent:'space-around', 
    gap:15
  },
  clearButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width: 175,
    borderWidth: 1,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterScreen;