import React, {useEffect, useState} from 'react';
import { Modal, SafeAreaView, FlatList, TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // If using Expo, install @expo/vector-icons or react-native-vector-icons

const CategoryModal = ({ isVisible, categories, onClose, onCategorySelect }) => {
    const [medCategories, setMedCategories] = useState([]);
    useEffect(() => {
        // Fetch categories from the server
        const fetchCategories = async () => {
          try {
            const response = await fetch('https://developersdumka.in/ourmarket/Medicine/getCategory.php'); // Replace with your PHP file URL
            const data = await response.json();
    
            if (data.status === 'success') {
                console.log('response ====',data);
                const updatedCategories = [...data.categories, "Other"];
                setMedCategories(updatedCategories);
            } else {
              Alert.alert('Error', data.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to fetch categories');
          }
        };
    
        fetchCategories();
      }, []);
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Circular close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="white" />
          </TouchableOpacity>
          <FlatList
            data={medCategories}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onCategorySelect(item)}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
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
  modalContent: {
    backgroundColor: '#a4dbd3',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
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
    paddingTop: 30, // Ensure padding at the top for proper alignment
    flexGrow: 1, // Ensure the content container stretches and aligns properly
  },
  modalItem: {
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  
});

export default CategoryModal;
