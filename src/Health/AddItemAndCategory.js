import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import CategoryModal from './CategoryModal';
import SubCategoryModal from './SubCategoryModal';

const AddItemScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const [formData, setFormData] = useState({
    med_item_name: product?.name || '',
    med_item_price: product?.price || '',
    med_item_weight: product?.weight_volume || '',
    med_item_flavor: product?.flavor || '',
    med_item_qty: product?.qty || '',
    med_item_category: product?.category || '',
    med_item_description: product?.description || '',
    med_item_sub_category: product?.sub_category || '',
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualEntryValue, setManualEntryValue] = useState('');

  const categories = ['Electronics', 'Fashion', 'Grocery', 'Books', 'Other'];
  const subCategories = ['Mobile', 'Laptop', 'Shoes', 'Clothing','Laptop', 'Shoes', 'Clothing', 'Other'];

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
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }
    setLoading(true);
    const admin_id = await EncryptedStorage.getItem('admin_id');
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append('user-id', admin_id);
      form.append(key, formData[key]);
    });

    form.append('med_item_image', {
      uri: selectedImage.uri,
      name: selectedImage.fileName || selectedImage.uri.split('/').pop(),
      type: selectedImage.type || 'image/jpeg',
    });

    try {
      const response = await axios.post('https://developersdumka.in/ourmarket/Medicine/add_cat_item.php', form, {
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

  const handleCategorySelection = (item) => {
    if (item === 'Other') {
      setIsManualEntry(true);
    } else {
      
      setIsManualEntry(false);
    }
    setFormData({ ...formData, med_item_category: item });
    setIsCategoryModalVisible(false);
  };

  const handleSubCategorySelection = (item) => {
    if (item === 'Other') {
      setIsManualEntry(true);
    } else {
      setIsManualEntry(false);
    }
    setFormData({ ...formData, med_item_sub_category: item });
    setIsSubCategoryModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={formData.med_item_name}
              onChangeText={(value) => handleInputChange('med_item_name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Price"
              keyboardType="numeric"
              value={formData.med_item_price}
              onChangeText={(value) => handleInputChange('med_item_price', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Weight / Volume (e.g., Litre, Kg)"
              value={formData.med_item_weight}
              onChangeText={(value) => handleInputChange('med_item_weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Flavor"
              value={formData.med_item_flavor}
              onChangeText={(value) => handleInputChange('med_item_flavor', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Quantity"
              keyboardType="numeric"
              value={formData.med_item_qty}
              onChangeText={(value) => handleInputChange('med_item_qty', value)}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text>{formData.med_item_category || 'Select Category'}</Text>
            </TouchableOpacity>
            {isManualEntry && (
              <TextInput
                style={styles.input}
                placeholder="Enter Category"
                onChangeText={(value) => setManualEntryValue(value)}
              />
            )}
            {!isManualEntry && (
            <TouchableOpacity
              style={styles.input}
              onPress={() => setIsSubCategoryModalVisible(true)}
            >
              <Text>{formData.med_item_sub_category || 'Select Sub-Category'}</Text>
            </TouchableOpacity>
            )}
            {isManualEntry && (
              <TextInput
                style={styles.input}
                placeholder="Enter Sub-Category"
                onChangeText={(value) => setManualEntryValue(value)}
              />
            )}

            <TextInput
              style={styles.textArea}
              placeholder="Description"
              multiline={true}
              numberOfLines={4}
              value={formData.med_item_description}
              onChangeText={(input) => handleInputChange('med_item_description', input)}
            />

            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Image
                source={selectedImage ? { uri: selectedImage.uri } : require('../Assets/placeholder.png')}
                style={styles.image}
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

      {/* Category Modal */}
      <CategoryModal
        isVisible={isCategoryModalVisible}
        categories={categories}
        onCategorySelect={handleCategorySelection}
        onClose={() => setIsCategoryModalVisible(false)}
      />

      {/* Sub-Category Modal */}
      {/* <Modal visible={isSubCategoryModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <FlatList
            data={subCategories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSubCategorySelection(item)}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setIsSubCategoryModalVisible(false)} />
        </SafeAreaView>
      </Modal> */}
      <SubCategoryModal
      isVisible={isSubCategoryModalVisible}
      categoryName={formData.med_item_category}
      subCategories={subCategories}
      onSelect={handleSubCategorySelection}
      onClose={() => setIsSubCategoryModalVisible(false)}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
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
  buttonContainer: {
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(205, 149, 149, 0.5)', // Semi-transparent background
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#efe5e5ff',
    fontWeight: 'bold',
  },
});

export default AddItemScreen;
