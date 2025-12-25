import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

const Health = ({ navigation }) => {
  // Sample data
  
  const [adminRoll, setAdminRoll] = useState('');
  // Check user login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const roll = await EncryptedStorage.getItem('roll_of_admin');
      console.log('ROLLL =====', roll);
      setAdminRoll(roll || ''); // Update state with the retrieved value
    };

    checkLoginStatus();
  }, [navigation]); 
  const isOwner = adminRoll.includes("Owner");
  const data = [
    { id: '1', name: 'Add Item With Category' },
    { id: '2', name: 'Add Medicine' },
    { id: '3', name: 'Orders' },
    { id: '4', name: 'Register' },
    { id: '6', name: '' + (isOwner ? 'Admin Access' : adminRoll) },
    { id: '7', name: 'Add Pathology' },
    { id: '8', name: 'Log Out' },
  ];
  
  const handleRowSelect = (item) => {
    console.log('item name ==', item.name);
    if (item.name === 'Add Item With Category') {
      navigation.navigate('AddItemAndCategory', { id: item.id, name: item.name });
    }
    if (item.name === 'Add Medicine') {
      navigation.navigate('AddMedicine', { id: item.id, name: item.name });
    }
    if (item.name === 'Register') {
      navigation.navigate('RegisterAdmin');
    }
    if (item.id === '6') {
      navigation.navigate('Members');
    }
    if (item.name === 'Orders') {
      navigation.navigate('OrderHistory');
    }
    if (item.name === 'Add Pathology') {
      navigation.navigate('PathologyForm');
    }
    if (item.name === 'Log Out') {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    await EncryptedStorage.clear();
    navigation.navigate('Login'); // Redirect to login screen
  };

  // Render each item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleRowSelect(item)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.containemain}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containemain: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    top: 40,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#3de7c7',
    borderRadius: 8,
    shadowColor: '#093029',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Health;
