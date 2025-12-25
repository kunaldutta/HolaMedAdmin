import React, { useState, useEffect } from 'react';
import { Modal, SafeAreaView, FlatList, TouchableOpacity, Text, Button, StyleSheet, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const SubCategoryModal = ({ isVisible, categoryName, onSelect, onClose }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryName) {
      fetchSubCategories(categoryName);
    }
  }, [categoryName]);

  const fetchSubCategories = async (categoryName) => {
    console.log("Category name sent to API:", categoryName);
    try {
        const response = await axios.get(`https://developersdumka.in/ourmarket/Medicine/admingetsubcategory.php?category_name=${categoryName}`);
        console.log('response ====',response.data);
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={{ backgroundColor: '#a4dbd3' }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <FlatList
              data={subCategories}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onSelect(item.sub_category_name)} style={styles.modalItem}>
                  <Text>{item.sub_category_name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalItem: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  flatListContent: {
    paddingTop: 50,
    flexGrow: 1,
  },
});

export default SubCategoryModal;
