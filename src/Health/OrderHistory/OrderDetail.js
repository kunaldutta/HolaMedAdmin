import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncryptedStorage from 'react-native-encrypted-storage';

const OrderDetail = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [prodStatus, setProdStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { sectionData } = route.params; // From SectionList

  useEffect(() => {
  fetchAdmins();
  if (sectionData?.data?.length > 0) {
    setSelectedOrder(sectionData.data[0]);
    setProdStatus(sectionData.data[0].status);
  }
}, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        'https://developersdumka.in/ourmarket/Medicine/get_admins.php'
      );
      console.log('Admins fetched:', response);
      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch admin list.');
    }
  };

  const assignOrderToAdmin = async (assign_id) => {
  setLoading(true);
  try {
    const assignPromises = sectionData.data.map((order) => {
      return axios.post('https://developersdumka.in/ourmarket/Medicine/update_assign.php', {
        order_id: order.order_id,
        assign_id,
      });
    });

    const responses = await Promise.all(assignPromises);

    const allSuccessful = responses.every((res) => res.data.success);

    if (allSuccessful) {
      Alert.alert('Success', 'All orders assigned successfully.');
    } else {
      Alert.alert('Partial Error', 'Some orders could not be assigned.');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to assign orders.');
  } finally {
    setLoading(false);
  }
};


  const handleSelectStatus = (status) => {
    setProdStatus(status);
    setModalVisible(false);
  };

  const updateStatus = async () => {
    if (!selectedOrder) return;
    try {
      const admin_id = await EncryptedStorage.getItem('admin_id');
      const response = await axios.post(
        'https://developersdumka.in/ourmarket/Medicine/update_status.php',
        {
          order_id: selectedOrder.order_id,
          vendor_id: admin_id,
          status: prodStatus,
        }
      );
      console.log('Update Status Response:', response);
      if (response.data.success) {
        Alert.alert('Success', 'Order status updated successfully');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  const renderOrderItem = ({ item }) => (
  <TouchableOpacity
    style={[
      styles.orderItem,
      selectedOrder?.order_id === item.order_id && { backgroundColor: '#929da6ff' }, // highlighted color
    ]}
    onPress={() => {
      setSelectedOrder(item);
      setProdStatus(item.status);
    }}
  >
    <Text style={styles.orderItemText}>{item.product_name}</Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.safecontainer}>
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 30 : 0,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          {console.log('Section Data:', sectionData.title)}
          <Text style={styles.headerTitle}>{sectionData.title}</Text>
        </View>
      </View>
      <View style={{maxHeight: '24%'}}>
      <FlatList
        data={sectionData.data}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={renderOrderItem}
        style={{ margin: 10 }}
      />
      </View>
            {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#34495e" />
          <Text style={{ color: '#34495e', marginTop: 10 }}>Assigning orders...</Text>
        </View>
      )}
      {selectedOrder && (
        <View style={{ height: '60%' }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
          <Image source={{ uri: selectedOrder.product_image }} style={styles.productImage} />
          <Text style={styles.label}>🆔 Order ID: {selectedOrder.order_id}</Text>
          <Text style={styles.label}>📦 Product: {selectedOrder.product_name}</Text>
          <Text style={styles.label}>🧾 Quantity: {selectedOrder.order_quantity}</Text>
          <Text style={styles.label}>💰 Price: ₹ {selectedOrder.order_price}</Text>
          <Text style={styles.label}>📅 Order Date: {selectedOrder.order_date}</Text>
          <Text style={styles.label}>📍 Address: {selectedOrder.address_detail}</Text>
          <Text style={styles.label}>📞 Contact: {selectedOrder.contact_no}</Text>
          <Text style={styles.label}>🏷️ Payment Ref: {selectedOrder.payment_reference}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        
        </View>
        </ScrollView>
        <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectorText}>{prodStatus}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectorButton2} onPress={updateStatus}>
            <Text style={styles.selectorText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectorButton2}
            onPress={() => setAssignModalVisible(true)}
          >
            <Text style={styles.selectorText}>Assign</Text>
          </TouchableOpacity>
      </View>
        
      )}

      {/* Status Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.option}
                onPress={() => handleSelectStatus(status)}
              >
                <Text style={styles.optionText}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Admin Assignment Modal */}
      <Modal transparent visible={assignModalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setAssignModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.label, { marginBottom: 10 }]}>Select Admin</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {admins.map((admin) => (
                <TouchableOpacity
                  key={admin.id}
                  style={styles.option}
                  onPress={() => {
                    setSelectedAdmin(admin);
                    setAssignModalVisible(false);
                    assignOrderToAdmin(admin.id);
                    
                  }}
                >
                  <Text style={styles.optionText}>
                    {admin.admin_name} ({admin.admin_mob_no}){"\n"}{admin.admin_address}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  safecontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orderItem: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    marginTop: 10,
    padding: 16,
    paddingBottom: 10,
  },
  productImage: {
    width: 190,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#555',
  },
  selectorButton: {
    backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: '25%',
    width: '50%',
  },
  selectedOrderItem: {
    backgroundColor: '#d0e8ff',
  },
  selectorButton2: {
    backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: '25%',
    width: '50%',
  },
  selectorText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
});
