import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../Redux/cartSlice'; // Adjust the import path as necessary
import {launchImageLibrary} from 'react-native-image-picker';
import { useAddress } from '../../components/AddressContext'; // Adjust the import path as necessary
import RazorpayCheckout from 'react-native-razorpay';
import { SafeAreaView } from 'react-native-safe-area-context';


const PurchaseReviewScreen = ({ route, navigation }) => {
  const { cartItems, totalPrice, selectedAddress } = route.params;
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { globalAddressDetail, setGlobalAddressDetail } = useAddress();

  const addressDetail = `${globalAddressDetail?.user_name}, ${globalAddressDetail?.address_1}, ${globalAddressDetail?.address_2 !== 'NA' ? globalAddressDetail?.address_2 + ', ' : ''}${globalAddressDetail?.city}, ${globalAddressDetail?.state}, ${globalAddressDetail?.zip_code}, Contact No: ${globalAddressDetail?.contact_no}`;
  // Allow multiple selection
const selectImage = () => {
  launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      alert('Error picking image: ' + response.errorMessage);
    } else {
      setPrescriptionImages(response.assets); // array of selected images
    }
  });
};

const makePayment = () => {
    var options = {
      description: 'Payment for order #123',
      image: 'https://your_logo_url.com/logo.png',
      currency: 'INR',
      key: 'rzp_test_Rgsl78begKtnDM', // Use your Test/Live Key
      amount: totalPrice*100, // = INR 50.00 (in paise)
      name: 'Cureo',
      prefill: {
        email: 'test@razorpay.com',
        contact: '8100236062',
        name: 'Test User'
      },
      theme: {color: '#53a20e'}
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        console.log(`Success: ${data.razorpay_payment_id}`);
        handleContinue(data.razorpay_payment_id); // Pass payment reference to handleContinue
      })
      .catch((error) => {
        // handle failure
        console.log(`Error: ${error.code} | ${error.description}`);
      });
    };

  // Append multiple images in FormData
const handleContinue = async (payment_reference) => {
  setLoading(true);
  console.log('Selected Address payment_reference:', payment_reference);
  const paymentReference = payment_reference ? payment_reference : 'NA'; // Use the payment reference if available, otherwise 'NA'
  try {
    const user_id = '16';
    const address_id = globalAddressDetail.id;

    const orderData = cartItems.map((item) => ({
      user_id,
      product_id: item.product_id,
      order_price: item.price * item.quantity,
      payment_reference: paymentReference,
      address_id,
      addressDetail: addressDetail,
      order_quantity: item.quantity,
      order_type: item.product_type,
      order_status: 'Received',
      vendor_id: item.vendor_id,
    }));

    const formData = new FormData();
    formData.append('orders', JSON.stringify(orderData));

    // Append all selected images
    prescriptionImages.forEach((image, index) => {
      formData.append('prescriptions[]', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || `image_${index}.jpg`,
      });
    });

    const response = await fetch('https://developersdumka.in/ourmarket/Medicine/place_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    

    const resJson = await response.json();
    if (resJson.success) {
      alert('Order placed successfully!');
      setGlobalAddressDetail(null); // Clear the global address detail
      dispatch(clearCart());
      setPrescriptionImages([]);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp', // The name of the tab navigator
            state: {
              routes: [{ name: 'Home' }], // The tab screen you want to show initially
            },
          },
        ],
      });
    } else {
      alert('Failed to place order. Please try again.');
    }
  } catch (error) {
    console.error('Order placement error:', error);
    alert('Error placing order.');
  } finally {
    setLoading(false);
  }
};


  const itemsNeedPrescription = cartItems.filter(item => item.need_prescription === "yes");

// Print product names
const productNames = itemsNeedPrescription.map(item => item.product_name);


  return (
    <SafeAreaView style={styles.container}>
      {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#34495e" />
              </View>
            )}
      <View style={{
              height: '8%',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              position: 'relative'
            }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Icon name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>

              <Text style={styles.title}>Purchase Review</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          
          <View style={[{left: 10, right: 10, width:'90%', }]}>
          <Text style={styles.sectionTitle}>Delivery Address:</Text>
          <Text>Name: {selectedAddress.user_name}</Text>
          <Text>{selectedAddress.address_1},</Text>
          {selectedAddress.address_2 !== 'NA' && <Text>{selectedAddress.address_2}</Text>}
          {selectedAddress?.land_mark && selectedAddress.land_mark !== 'NA' && selectedAddress.land_mark.trim() !== '' && <Text>Landmark: {selectedAddress.land_mark}</Text>}
          <Text>{selectedAddress.city}</Text>
          <Text>{selectedAddress.state}</Text>
          <Text>Zip Code: {selectedAddress.zip_code}</Text>
          <Text>Contact-No. :{selectedAddress.contact_no}</Text>
        </View>
        </View>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.text}>{item.product_name} × {item.quantity}</Text>
            <Text style={styles.text}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={styles.section2}>
        <View style={[{flexDirection:'row', justifyContent:'space-between', alignItems:'center', top:0, height: 50, width:'100%', paddingHorizontal: 10}]}>
          <Text style={styles.sectionTitle}>Total Price:</Text>
          <Text style={styles.totalPrice}>₹ {totalPrice}</Text>
        </View>
        </View>
        {productNames.length > 0 && (
    <View style={{ top: 40 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
        Need prescription for below Medicine(s):
      </Text>
      <TouchableOpacity onPress={selectImage} style={styles.continueButton}>
  <Text style={styles.continueText}>
    {prescriptionImages.length > 0 ? 'Change Prescription' : 'Upload Prescription'}
  </Text>
</TouchableOpacity>
<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>  
        {prescriptionImages.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={{ width: 80, height: 80, margin: 5, borderRadius: 5 }}
            resizeMode="cover"
          />
        ))}
        </View>
    </View>
      )}

  {/* Scrollable list of product names */}
        <ScrollView contentContainerStyle={styles.content} style={{ marginTop: 20 }}>
          {productNames.map((name, index) => (
            <View key={index} style={{ padding: 10 }}>
              <Text style={{ fontSize: 16 }}>{name}</Text>
            </View>
          ))}
        {/* <Text style={styles.sectionTitle}>Total Price: ₹{totalPrice}</Text> */}
        </ScrollView>
        

        
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={() => handleContinue('NA')}>
          <Text style={styles.continueText}>Cash on Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.continueButton, { marginTop: 10 }]} onPress={makePayment}>
          <Text style={styles.continueText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PurchaseReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18, fontWeight: 'bold'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 25,
    elevation: 3,
    padding: 15,
  },
  section2: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 25,
    elevation: 3,
    alignContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009688',
  },
  continueButton: {
    left: '15%',
    backgroundColor: '#34495e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '70%',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  footer: {
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ccc',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
