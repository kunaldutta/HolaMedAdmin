import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, updateQuantity, deleteItem } from '../../Redux/cartSlice';
import { useAddress } from '../../components/AddressContext'; // Adjust the import path as necessary


const CartScreenWithRedux = ({ navigation }) => {
  const [selectedId, setSelectedID] = useState(null);
  const [addressAvailable, setAddressAvailable] = useState('');
  const [addressCalled, setAddressCalled] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState(false);
 
  const dispatch = useDispatch();
  var addressDetail = '';
  const { cartItems, loading, updateLoading, error } = useSelector(state => state.cart);
  const {
      addressloading,
      fetchAddresses,
      globalAddressDetail,
    } = useAddress();
  useEffect(() => {
   if((globalAddressDetail?.user_name === undefined || globalAddressDetail?.user_name === null || globalAddressDetail?.user_name === '') && !addressCalled) {
    setAddressCalled(true);
    fetchAddresses();
   }else {
    if (globalAddressDetail?.user_name === 'Not Found') {
      addressDetail = 'No Address Available';
      setAddressAvailable(addressDetail); 
    } else {
    addressDetail = `${globalAddressDetail?.user_name}, ${globalAddressDetail?.address_1}, ${globalAddressDetail?.address_2 !== 'NA' ? globalAddressDetail?.address_2 + ', ' : ''}${globalAddressDetail?.city}, ${globalAddressDetail?.state}, ${globalAddressDetail?.zip_code}, Contact No: ${globalAddressDetail?.contact_no}`;
    setAddressAvailable(addressDetail); 
    }
   }  
   if(!fetchedAddress) {
      setFetchedAddress(true);
      fetchCart();
   }
  }, [globalAddressDetail]);

  const fetchCart =() => {
    if(!loading) {    
    dispatch(fetchCartItems());
   }
  };
  const handleUpdateQuantity = (id, amount) => {
    setSelectedID(id);
    if (!updateLoading) {
      dispatch(updateQuantity({ id, amount }));
    }
  };

  const handleDeleteItem = (id) => {
    setSelectedID(id);
    dispatch(deleteItem(id));
  };
  const gotoAdressList = () => {
      navigation.navigate('AddressListScreen', {
        cartItems: cartItems,
        totalPrice: calculateTotalPrice(),
      });
    }
  const handlePlaceOrder = () => {
    
    if (cartItems.length !== 0) {
    if (addressAvailable === 'No Address Available') {
            Alert.alert('Error', 'Please select an address');
            return;
    }
        
        console.log('Address Available:', globalAddressDetail);
        
          navigation.navigate('PurchaseReviewScreen', {
            cartItems,
            totalPrice: calculateTotalPrice(),
            selectedAddress: globalAddressDetail, // pass selected address only
          });
        }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const renderItem = ({ item }) => (
    console.log('Rendering item:', item.cart_id),
    <View pointerEvents={updateLoading && selectedId === item.cart_id ? 'none' : 'auto'} style={[styles.itemContainer,{backgroundColor: updateLoading && selectedId === item.cart_id ? '#f0f0f0' : '#fff'}]}>
       
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.product_name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={[styles.plusminusButton, { opacity: updateLoading && selectedId === item.cart_id ? 0.5 : 1 }]} onPress={() => handleUpdateQuantity(item.cart_id, -1)}>
            <Icon name="minus" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity style={[styles.plusminusButton, { opacity: updateLoading && selectedId === item.cart_id ? 0.5 : 1 }]} onPress={() => handleUpdateQuantity(item.cart_id, 1)}>
            <Icon name="plus" size={16} color="#fff" />
          </TouchableOpacity>
          
        </View>
        <Text style={styles.price}>Total Price: ₹{item.price * item.quantity}</Text>
      </View>
      <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }} onPress={() => handleDeleteItem(item.cart_id)}>
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
      {updateLoading && selectedId === item.cart_id && (
            <ActivityIndicator size="small" color="#007bff" style={styles.loaderContainer} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#34495e" />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
      </View>
      <View style={{left:'5%', 
      height:'15%', 
      width: '90%', }}>
      <View style={{left:'5%', 
      top: '5%',
      height:'90%',
      width: '90%', 
      backgroundColor: '#fff', 
      justifyContent: 'center', 
      alignItems: 'center',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,}}>
        {(addressAvailable && !addressloading && addressAvailable !== 'No Address Available' ) ? (<TouchableOpacity style={{fontSize: 12, fontWeight: 'bold', width: '80%'}} onPress={gotoAdressList}>
        <Text style={{fontSize: 12, fontWeight: 'bold', width: '90%'}}>Your Address: {addressAvailable}</Text>
        </TouchableOpacity>) : (<TouchableOpacity style={styles.placeOrderButton} onPress={gotoAdressList}>
        <Text style={styles.buttonText}>Add Address</Text>
        </TouchableOpacity>)}
      </View>
      </View>
      {error && cartItems.length === 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      
      

      {cartItems.length > 0 && (
        <View style={styles.mainContainer}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.cart_id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceText}>Total Price: ₹{calculateTotalPrice()}</Text>
          </View>
          <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
            <Text style={styles.buttonText}>Place Order</Text>
            <Icon name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  plusminusButton: {
    backgroundColor: '#34495e',
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'white',
    backgroundColor: '#34495e',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 8,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // To offset the back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: '2%',
    paddingTop: 10,
    backgroundColor: '#f8f9fa',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#63676c',
    marginTop: 5,
  },
  qty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007bff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityValue: {
    marginHorizontal: 10,
  },
  itemLoader: {
    marginLeft: 10,
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ccc',
  },
  totalPriceContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#63676c',
  },
  placeOrderButton: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  itemOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 10,
  zIndex: 2,
},
});

export default CartScreenWithRedux;
