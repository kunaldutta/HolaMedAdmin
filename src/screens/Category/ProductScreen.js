import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncryptedStorage from 'react-native-encrypted-storage';

const ProductScreen = ({ route, navigation }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
  const { categoryData } = route.params;
  console.log('categoryData ==',categoryData);
  useEffect(() => {
    const fetchSubCategories = async () => {
      const admin_id = await EncryptedStorage.getItem('admin_id');
      try {
        const response = await axios.post(
          "https://developersdumka.in/ourmarket/Medicine/getadminprod.php",
          {
            med_item_sub_category: categoryData.sub_category_name,
            vendor_id: admin_id, // Replace "123" with the actual vendor_id
          }
        );
        console.log("response ====", response.data.data);
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubCategories();
  }, []);

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
    <SafeAreaView style={styles.containemain}>
    <View style={{height:'85%', width:'100%', }}>
    <View style={{marginTop: Platform.OS === 'android' ? 30 : 0, height: 45, width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
      <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
            <View style={{ 
                height:'50%',
                width: '75%',
                alignItems: 'center',
                alignContent:'center',}}>
              <Text 
                  style={styles.headerTitle}
              >
                  {categoryData.sub_category_name}
              </Text>
        </View>
    </View>
       
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        top:20,
        height:'98%',
        width:'90%',
        left:'5%',
        justifyContent: 'center',
    },
    containemain: {
      flex: 1,
      backgroundColor: 'white',
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    card: {
      backgroundColor: '#f5e8e5',
      borderRadius: 8,
      elevation: 3,
      padding: 10,
      alignItems: 'center',
      width: '47%',
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
    headerTitle:{
      fontSize: 18, 
            width:'100%',
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginLeft: 10, 
            flex: 1,
    }
});

export default ProductScreen;
