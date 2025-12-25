import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { getTotalQuantity } from '../../Redux/cartSelectors';
import CartIconWithBadge from '../Order/CartIconWithBadge';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubCategory = ({ route, navigation }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalQuantity = useSelector(getTotalQuantity);
  const { categoryData } = route.params;

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `https://developersdumka.in/ourmarket/Medicine/getmedsubcategory.php?category_name=${categoryData.cat_name}`
        );
        setSubCategories(response.data);
      } catch (error) {
        console.error('Error fetching sub-categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const handlePress = (item) => {
    navigation.navigate('ProductScreen', { categoryData: item });
  };

  const gotoCart = () => {
    navigation.navigate('CartScreenWithRedux');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Image source={{ uri: item.sub_category_image }} style={styles.image} />
      <Text style={styles.name}>{item.sub_category_name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../Assets/backgroundImg.png')} // Change the path to match your image location
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.containemain}>
        <View style={{ height: '85%', width: '100%' }}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerTitleWrapper}>
              <Text style={styles.headerTitle}>{categoryData.cat_name}</Text>
            </View>

            <CartIconWithBadge totalQuantity={totalQuantity} onPress={gotoCart} />
          </View>

          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator size="large" color="#34495e" />
            ) : (
              <FlatList
                data={subCategories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containemain: {
    flex: 1,
  },
  container: {
    top: 70,
    height: '90%',
    width: '90%',
    left: '5%',
    justifyContent: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    top: 10,
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
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative',
  },
  headerTitleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // Important to avoid intercepting touches
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SubCategory;
