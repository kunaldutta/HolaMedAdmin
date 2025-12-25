/* eslint-disable quotes */
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicineDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => {
    if (quantity < product.qty) {
    setQuantity((prev) => prev + 1)
    }
  };
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  return (
    <SafeAreaView style={styles.containemain}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
    <ScrollView style={styles.container}>
      {/* <Text style={styles.bestSeller}>BEST SELLER</Text> */}

      <Image source={{ uri: product.image }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        console.log('product ==', product);
        <Text style={styles.productTitle}>{product.need_prescription}</Text>
        <Text style={styles.productTitle}>{product.need_prescription}</Text>
        <Text style={styles.rating}>⭐⭐⭐⭐ (1804 Ratings)</Text>
        <View style={styles.priceContainer}>
            <View>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.mrp}>MRP ₹{(product.price * 1.5).toFixed(2)}  46% OFF</Text>
            </View>
            <View style={styles.quantityContainer}>
                      <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
                        <Text style={styles.quantityText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
                        <Text style={styles.quantityText}>+</Text>
                      </TouchableOpacity>
                    </View>
        </View>
        <Text style={styles.quantityTotal}>{product.qty} item in stock</Text>
        {product.description !== "" && (<Text style={styles.description}>Discription: {product.description.replace(/\\n/g, '\n ')}</Text>)}
        <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>Add To Cart </Text>
              <Icon name="shopping-cart" size={18} color="#fff" style={styles.cartIcon} />
            </TouchableOpacity>
        {console.log('product.description ==', product)}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    top:40,
  },
  containemain: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
  backgroundColor: 'white',
  borderWidth: 2, // Slightly thinner looks cleaner
  borderColor: '#ccc', // Light gray border (you can change to any color)
  position: 'absolute',
  left: 20,
  height: 40,
  width: 40,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  top: 50,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3, // Android shadow
},
  bestSeller: {
    color: 'white',
    backgroundColor: 'orange',
    alignSelf: 'flex-start',
    marginTop: 10,
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
    marginVertical: 10,
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
    top:20,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end', // Ensures the button is aligned to the right within a flex container
    top:20,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  quantityTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'right', // Aligns text to the right
    alignSelf: 'flex-end', // Positions the text container to the end of its parent
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default MedicineDetail;
