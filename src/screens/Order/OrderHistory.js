import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderHistory = ({ userId,  navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://developersdumka.in/ourmarket/Medicine/getYourOrderDetails.php`, {
          params: { user_id: '16' },
        });
        
        if (response.data.success) {
          setOrders(response.data.orders);

        } else {
          console.warn('Failed to fetch orders:', response.data.message);
        }
      } catch (error) {
        console.error('Axios error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowContainer}>
        <Image source={{ uri: item.product_image }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.product_name}</Text>
          <Text>Quantity: {item.order_quantity}</Text>
          <Text>Price: ₹{item.order_price}</Text>
          <Text>Statue: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text></Text>
          <Text>Address: {item.city}, {item.state}, {item.zip_code}, {item.country}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
                      <View style={styles.loaderContainer}>
                          <ActivityIndicator size="large" color="#34495e" />
                      </View>
                  )}
        <View style={{  marginTop: Platform.OS === 'android' ? 30 : 0,
                        height: '6%',
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Your Order</Text>
                </View>
        </View>
        <View>
    <View style={{
        height: '94%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
    }}>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.order_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
    </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    list: {
    padding: 6,
    paddingBottom: 2, // for extra scroll space
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 5,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: { 
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    name: { fontWeight: 'bold', fontSize: 16 },
    backButton: {
        backgroundColor: 'black',
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        left: 20,
    },
    headerContainer: {
        height: '60%',
        width: '35%',
        left:'20%',
        alignItems: 'center',
        alignContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        width: '100%',
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10,
        flex: 1,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default OrderHistory;
