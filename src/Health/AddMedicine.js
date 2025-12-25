import React, { useState } from 'react';
import { 
  View, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity, 
  SafeAreaView, ScrollView, ActivityIndicator, Text, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import EncryptedStorage from 'react-native-encrypted-storage';

const AddMedicine = ({ navigation, route }) => {
  const { product } = route.params;
  const [formData, setFormData] = useState({
    product_name: product?.name || '',
    treatment_for: product?.treatment || '',
    price: product?.price || '',
    ingrediant: product?.ingrediant || '',
    product_item_qty: product?.qty || '',
    product_description: product?.description || '',
    unit_of_mg: product?.unit_of_mg || '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prescriptionNeeded, setPrescriptionNeeded] = useState(null); // New state

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!formData.product_name || !formData.treatment_for || !formData.price) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    if (prescriptionNeeded === null) {
      Alert.alert("Error", "Please select if prescription is needed");
      return;
    }

    setLoading(true);
    const admin_id = await EncryptedStorage.getItem('admin_id');
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append('user-id', admin_id);
      form.append(key, formData[key]);
    });

    form.append('prescription_needed', prescriptionNeeded ? 'yes' : 'no'); // New field

    form.append('med_item_image', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || selectedImage.uri.split('/').pop(),
      type: selectedImage.type || 'image/jpeg',
    });

    try {
      const response = await axios.post('https://developersdumka.in/ourmarket/Medicine/add_medicines.php', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        Alert.alert('Success', 'Item added successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add item');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the item');
    } finally {
      setLoading(false);
    }
  };

  const renderInputWithLabel = (label, placeholder, name, value, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      {(value || formData[name]) && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        value={value}
        onChangeText={(val) => handleInputChange(name, val)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ height: '7%', width: '78%', flexDirection: 'row', alignItems: 'center', left:'5%' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Medicine</Text>
        </View>

        <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {renderInputWithLabel('Medicine Name', 'Medicine Name', 'product_name', formData.product_name)}
            {renderInputWithLabel('Treatment For', 'Treatment For', 'treatment_for', formData.treatment_for)}
            {renderInputWithLabel('Item Price', 'Item Price', 'price', formData.price, 'numeric')}
            {renderInputWithLabel('Ingredient', 'Ingredient', 'ingrediant', formData.ingrediant)}
            {renderInputWithLabel('Unit of Mg', 'Mg. unit if applicable', 'unit_of_mg', formData.unit_of_mg)}
            {renderInputWithLabel('Item Quantity', 'Item Quantity', 'product_item_qty', formData.product_item_qty, 'numeric')}
            {/* New Prescription Needed Section */}
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.label}>Prescription Needed</Text>
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <TouchableOpacity
                  onPress={() => setPrescriptionNeeded(true)}
                  style={[
                    styles.optionButton,
                    prescriptionNeeded === true && styles.optionButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    prescriptionNeeded === true && styles.optionTextSelected
                  ]}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPrescriptionNeeded(false)}
                  style={[
                    styles.optionButton,
                    prescriptionNeeded === false && styles.optionButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.optionText,
                    prescriptionNeeded === false && styles.optionTextSelected
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            {renderInputWithLabel('Description', 'Description', 'product_description', formData.product_description, 'default', true)}


            {/* Image Picker */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Image
                source={
                  selectedImage?.uri
                    ? { uri: selectedImage.uri }
                    : product?.image
                    ? { uri: product.image }
                    : require('../Assets/placeholder.png')
                }
                style={styles.image}
                onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
              />
            </TouchableOpacity>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e74c3c" />
                <Text style={styles.loadingText}>Loading Items...</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
                              style={styles.selectorButton}
                              onPress={handleSubmit}
                            >
                              <Text style={styles.buttonText}>Add Item</Text>
                            </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  scrollContainer: { flex: 1 },
  container: { padding: 20, backgroundColor: 'white' },
  backButton: { backgroundColor: 'black', height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: 'black', flex: 1 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, color: '#555', marginBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  textArea: { height: 100, textAlignVertical: 'top' },
  imagePicker: { alignItems: 'center', marginTop: 20 },
  image: { width: 100, height: 100, borderRadius: 10 },
  buttonContainer: { marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#333' },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
  },
  optionButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  optionText: {
    color: 'black',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
  selectorButton: {
    backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    width: '40%',
    marginLeft: '30%',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    color: '#efe5e5ff',
    fontWeight: 'bold',
  },
});

export default AddMedicine;
