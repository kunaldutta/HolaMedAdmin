/* eslint-disable quotes */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const productDescription = product.description.replace(/\\n/g, '\n');
  const handleUpdatePress = (item) => {
    if(item.product_type === 'other'){
    navigation.navigate('AddItemAndCategory', { product: item });
    }else{
      navigation.navigate('AddMedicine', { product: item });
    }
  };
  return (
    <SafeAreaView style={styles.containemain}>
      <View style={{ marginTop: Platform.OS === 'android' ? 30 : 0, height: '5%', width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
              <View style={{ 
                  height:'60%',
                  width: '75%',
                  alignItems: 'center',
                  alignContent:'center',}}>
              </View>
          </View>

    <ScrollView style={styles.container} contentContainerStyle={styles.containemain}>
      
      {/* <Text style={styles.bestSeller}>BEST SELLER</Text> */}

      <Image source={{ uri: product.image }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        <Text style={styles.productTitle}>{product.name}</Text>
        {/* <Text style={styles.rating}>⭐⭐⭐⭐ (1804 Ratings)</Text> */}
        <View style={styles.priceContainer}>
            <View>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.mrp}>MRP ₹{(product.price * 1.5).toFixed(2)}  46% OFF</Text>
            </View>
            
        </View>
        {console.log('product.description ==', product.description === "")}
        {product.description !== "" && (<Text style={styles.description}>Discription: {product.description.replace(/\\n/g, '\n ')}</Text>)}
      </View>
      
    </ScrollView>
    <View style={styles.editView}>
      <TouchableOpacity onPress={() => handleUpdatePress(product)} style={styles.editButton}>
              <Text style={styles.addToCartText}>Update</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 1,
  },
  containemain: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    backgroundColor: 'black',
    position: 'absolute',
    left: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bestSeller: {
    color: 'white',
    backgroundColor: 'orange',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontWeight: 'bold',
    borderRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width:'40%',
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row', // Aligns items horizontally
    justifyContent: 'space-between', // Places items at both ends
    alignItems: 'center', // Aligns items vertically centered
    marginBottom: 16, // Optional spacing below the row
  },
  editView: {
    flexDirection: 'row', // Aligns items horizontally
    justifyContent: 'center', // Places items at both ends
    alignItems: 'center', // Aligns items vertically centered
    marginBottom: 16, // Optional spacing below the row
  },
});

export default ProductDetailScreen;
