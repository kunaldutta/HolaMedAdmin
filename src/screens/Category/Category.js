import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const Category = () => {
  const navigation = useNavigation(); // Use useNavigation to access navigation prop
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  const handlePress = (item) => {
    // Navigate to the next screen and pass the selected item as data
    navigation.navigate('SubCategory', { categoryData: item });
  };

  const fetchCategories = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('https://developersdumka.in/ourmarket/Medicine/getmedcategory.php');
      console.log('Response:===111', response.data);
  
      if (Array.isArray(response.data)) {
        const formattedData = response.data.map(item => ({
          id: item.id.toString(),
          cat_name: item.cat_name,
          sub_cat_name: item.sub_cat_name,
          image: item.image || 'https://via.placeholder.com/100'
        }));
        setCategories(formattedData);
      } else {
        console.error('Expected array, but received:', response.data);
        setCategories([]);
      }
    } catch (error) {
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
      setLoading(false); // Stop loading
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <SafeAreaView style={styles.containermain}>
      <View style={styles.titleTextContainer}>
        <Text style={styles.categoryTitle}>Shop By Category</Text>
      </View>
      {loading && (<View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34495e" />
        <Text style={styles.loadingText}>Loading Items...</Text>
      </View>)}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.gridItemContainer}>
            <Image source={{ uri: item.image }} style={styles.gridImage} />
            <Text style={styles.gridText}>{item.cat_name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleTextContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5e8e5',
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Black',
    marginLeft: 10,
    marginVertical: 10,
  },
  gridItemContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      
  },
  gridImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Nunito-Black',
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#f5e8e5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e8e5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  containermain: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Category;
