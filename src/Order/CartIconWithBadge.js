import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CartIconWithBadge = ({ totalQuantity, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <View style={{ position: 'relative' }}>
        <Icon name="shopping-cart" size={15} color="#fff" />
        {totalQuantity > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalQuantity}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34495e',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 17,
    width: 35,
    height: 35,
  },
  badge: {
    position: 'absolute',
    top: -15,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartIconWithBadge;
