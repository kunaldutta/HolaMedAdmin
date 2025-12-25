/* eslint-disable quotes */
import React, {useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator,ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems, updateQuantity, deleteItem} from '../Redux/cartSlice';

const ProductDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { cartItems, updateLoading, error } = useSelector(state => state.cart);
  const [loading, setLoading] = useState(false);
  const { product } = route.params;
  const matchedCartItem = cartItems?.find(
    item => item.product_id === product?.id?.toString() && item.product_type === product?.product_type
  );
  
  const getTotalQuantity = () => {
    return matchedCartItem ? parseInt(matchedCartItem.quantity) : 0;
  };

  console.log('Product Detail Screen - Product:', cartItems);

  const [quantity, setQuantity] = useState(matchedCartItem ? parseInt(matchedCartItem.quantity) : 1);
  const handleIncrease = () => {
    if (quantity < product.qty) {
      setQuantity(quantity + 1);
      const id = matchedCartItem.cart_id
        const amount =  1;
      if (matchedCartItem && !updateLoading)  {
        dispatch(updateQuantity({ id, amount }));
      }
      if(updateLoading) {
         dispatch(fetchCartItems());
      }
    }
  };

  const handleDecrease = () => {
    
    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (matchedCartItem && !updateLoading)  {
        const id = matchedCartItem.cart_id
        const amount =  - 1;
        console.log('matchedCartItem ===', product?.id);
        
              dispatch(updateQuantity({ id, amount }));
      
      }
    }else if (quantity === 1 && !updateLoading) {
      dispatch(deleteItem(matchedCartItem.cart_id));
    }
  };
  
  const handleDeleteItem = async (cart_id) => {
  try {
    await dispatch(deleteItem(cart_id)).unwrap();
    console.log('Item deleted successfully');
    setQuantity(1);
  } catch (error) {
    console.log('Delete error:', error);
    Alert.alert('Delete Failed', error); // Show alert or toast
  }
};

  const handleAddToCart = async () => {
    setLoading(true);
    console.log("cartData: Test", product?.product_type);
    const cartData = {
      customer_id: '16',
      product_name: product?.name,
      product_id: product?.id, // not String()
      product_type: product?.product_type,
      qty: quantity, // not String()
      vendor_id: product?.vendor_id,
      weight_volume: product?.weight_volume ?? 'NA',
    };  

    console.log("cartData: ===222", cartData);
    
    try {
      const response = await axios.post(
        'https://developersdumka.in/ourmarket/Medicine/add_to_cart.php', 
        cartData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Product added to cart successfully:', response?.data?.status);
      if (response.data.status === 'success') {
        dispatch(fetchCartItems());
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.error('🚨 Server Error:', error.response.data);
        Alert.alert("Error", error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        console.error('⏳ No Response:', error.request);
        Alert.alert("Network Issue", "No response from the server.");
      } else {
        console.error('⚠️ Request Error:', error.message);
        Alert.alert("Error", "Failed to add to cart.");
      }
      
    } finally {
      setLoading(false);
    }
  };
  const handleGotoCart = (item) => {
    navigation.navigate('CartScreenWithRedux');
  };

  console.log('Product ===', product);

  return (
    <ImageBackground
    source={require('../../Assets/backgroundImg.png')} // Change the path to match your image location
    style={styles.background}
    resizeMode="cover"
    >
    <SafeAreaView style={styles.containemain}>
      {(loading || updateLoading) && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#34495e" />
        </View>
    )}
                              
    <View style={{height: '8%', width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white', }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
      
      <ScrollView style={styles.container}>
        <Image source={{ uri: product?.image }} style={styles.productImage} />
        
        <View style={styles.detailsContainer}>
           
          <Text style={styles.productTitle}>{product?.name}</Text>
          {product?.need_prescription === 'yes' && (<Text style={[styles.productTitle, {color: 'red'}]}>*Please upload Prescription before place order for this product.</Text>)}
          {product?.weight_volume && (<Text style={[styles.productTitle, {color: '#666',}]}>{product?.weight_volume}</Text>)}
          <Text style={styles.rating}>⭐⭐⭐⭐ (1804 Ratings)</Text>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.price}>₹{product?.price}</Text>
              <Text style={styles.mrp}>MRP ₹{(product?.price * 1.5).toFixed(2)} 46% OFF</Text>
            </View>
            {(!matchedCartItem && !updateLoading) ? (
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add </Text>
              <Icon name="shopping-cart" size={18} color="#fff" />
            </TouchableOpacity>
          ):(<View style={{ position: 'relative', marginTop: 0, height: 90,}}>
              
              <View style={[styles.quantityContainer,{top: 0, width: 130,}]}>
                <TouchableOpacity onPress={handleDecrease} style={styles.quantityMButton}>
                   <Icon name="minus" size={16} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{getTotalQuantity()}</Text>
                <TouchableOpacity onPress={handleIncrease} style={styles.quantityPButton}>
                  {/* <Text style={styles.quantityText}>+</Text> */}
                  <Icon name="plus" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    backgroundColor: '#34495e',
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                  onPress={() => handleDeleteItem(matchedCartItem.cart_id)}
                >
                  <Icon name="trash" size={12} color="white" />
                </TouchableOpacity>
              </View>
                
            </View>)}
          </View>
          {matchedCartItem && (
            <Text style={[styles.quantityTotal,{color: 'red'}]}> Added In Cart </Text>
          )}
          <Text style={styles.quantityTotal}>{product?.qty} items in stock</Text>
          
          {product.description && (
            <Text style={styles.description}>
              Description: {product?.description.replace(/\\n/g, "\n ")}
            </Text>
          )}

          
        </View>
      </ScrollView>
      <View style={{
          height: '10%',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          }}>
          <TouchableOpacity style={styles.goToCartButton} onPress={handleGotoCart}>
            <Text style={styles.addToCartText}>GoTo Cart </Text>
            <Icon name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
          
          
          
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    marginBottom: 0,
  },
  containemain: {
    flex: 1,
  },
  backButton: {
        backgroundColor: 'black',
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'white',
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
    width: '80%',
  },
  addToCartButton: {
    backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '25%',
    flexDirection: 'row',
  },
  goToCartButton: {
   backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '40%',
    left: '30%',
    flexDirection: 'row',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityMButton: {
    backgroundColor: '#34495e',
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    right: 10,
  },
  quantityPButton: {
    backgroundColor: '#34495e',
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    left: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quantityTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
    zIndex: 10, // Ensure it appears above everything
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProductDetailScreen;
