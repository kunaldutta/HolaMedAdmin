import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

import withLoading from '../../withLoading';

const MedicineList = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        `https://developersdumka.in/ourmarket/Medicine/getmedicine.php`
      );
      console.log('response ====', response.data.data);
      setItems(response.data.data);
      setFilteredItems(response.data.data);
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
      //[AxiosError: Network Error]
      if (error.response) {
        // The server responded with a status code outside the range of 2xx
        console.error('Server Error:', error.response.status, error.response.data);
        alert(`Server Error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error: No response received', error.request);
        alert('Network Error: Please check your internet connection.');
      } else {
        // Something else happened while setting up the request
        console.error('Error:', error.message);
        alert('Unexpected Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('ProductDetailScreen', { product: item });
  };

  // Item card component
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.discount}>MRP ₹{(item.price * 1.5).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
            source={require('../../Assets/backgroundImg.png')} // Change the path to match your image location
            style={styles.background}
            resizeMode="cover"
            >
    <SafeAreaView style={styles.containermain}>
      <View style={{ height: '95%', width: '100%', top: 20 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchBarContainer}
            onPress={() => navigation.navigate('SearchScreen')}
          >
            <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
            <Text style={styles.searchBarPlaceholder}>  Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#34495e" />
          ) : filteredItems.length > 0 ? (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          ) : (
            <Text style={styles.noResultsText}>No medicines found.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 40,
    height: '90%',
    width: '90%',
    left: '5%',
    justifyContent: 'center',
  },
  containermain: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#f5e8e5',
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    top:15,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  price: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discount: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 30 : 0,
    height: '5%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    height: 40,
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  searchBarPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#888',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default withLoading(MedicineList);
