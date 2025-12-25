import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const OrderList = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://developersdumka.in/ourmarket/Medicine/getOrderDetails.php`, {
          params: { user_id: userId }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          console.warn('Failed to fetch orders:', response.data.message);
        }
      } catch (error) {
        console.error('Axios error:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product_image }} style={styles.image} />
      <Text style={styles.name}>{item.product_name}</Text>
      <Text>Quantity: {item.order_quantity}</Text>
      <Text>Price: ${item.order_price}</Text>
      <Text>
        Address: {item.address_line}, {item.city}, {item.state}, {item.zip_code}, {item.country}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.order_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2
  },
  image: { width: 100, height: 100, marginBottom: 8 },
  name: { fontWeight: 'bold', fontSize: 16 }
});

export default OrderList;
