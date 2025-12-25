import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  SectionList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useFocusEffect } from '@react-navigation/native';

const OrderHistory = ({ userId, navigation }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        setLoading(true);
        const admin_id = await EncryptedStorage.getItem('admin_id');
        
        try {
          const response = await axios.get(
            'https://developersdumka.in/ourmarket/Medicine/getOrderDetailsforAdmin.php',
            {
              params: { vendor_id: admin_id },
            }
          );
          console.log('Orders fetched successfully111:', response);
          if (response.data.success) {
            console.log('Orders fetched successfully:', response.data.orders);
            const groupedOrders = groupOrdersByDateTimeAddress(response.data.orders, admin_id);
            setSections(groupedOrders);
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
    }, [])
  );

  const groupOrdersByDateTimeAddress = (orders, admin_id) => {
    const groupMap = {};
    console.log('Orders before grouping:', admin_id);
    orders.forEach((order) => {
      const orderDate = order.order_date.split(' ')[0];
      const orderTime = order.order_date.split(' ')[1];
      const addressKey = `${orderDate} ${orderTime} - ${order.address_1}, ${order.city},\nAssigned to: ${admin_id === order?.assign_id ? 'You' : order?.admin_name || 'Not Assigned'}\n${order?.admin_mob_no ? 'Mob:' + order.admin_mob_no : ''}`;

      if (!groupMap[addressKey]) {
        groupMap[addressKey] = [];
      }
      groupMap[addressKey].push(order);
    });

    return Object.keys(groupMap).map((key) => ({
      title: key,
      data: groupMap[key],
    }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity >
      <View style={styles.card}>
        <View style={styles.rowContainer}>
          <Image source={{ uri: item.product_image }} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{item.product_name}</Text>
            <Text>Quantity: {item.order_quantity}</Text>
            <Text>Price: ₹{item.order_price}</Text>
            <Text>Status: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text></Text>
            <Text>
              Address: {item.address_1}, {item.city}, {item.state}, {item.zip_code}, {item.country}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  
const renderSectionHeader = ({ section }) => {
  const titleLines = section.title.split('\n');
  const assignedLine = titleLines.find((t) => t.includes('Assigned to:'));
  const assignedTo = assignedLine ? assignedLine.replace('Assigned to:', '').trim() : '';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetail', { sectionData: section })}
      style={styles.sectionHeaderTouchable}
    >
      <View
        style={[
          styles.sectionHeader,
          {
            backgroundColor:
              assignedTo === 'You'
                ? '#8fb01aff'
                : assignedTo === 'Not Assigned'
                ? '#96270bff'
                : '#649ad7ff',
          },
        ]}
      >
        <Text style={[styles.sectionHeaderText,{color: assignedTo === 'You' ? '#000' : '#fff'}]}>{section.title}</Text>
        <Icon name="angle-right" size={20} color="#000" />
      </View>
    </TouchableOpacity>
  );
};



  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Your Order</Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.order_id.toString()}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.list}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    marginTop: Platform.OS === 'android' ? 30 : 0,
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    left: '20%',
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
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionHeaderTouchable: {
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
});

export default OrderHistory;
