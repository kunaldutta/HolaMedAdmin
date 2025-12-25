import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import medic from '../Assets/medic.png';
import labtest from '../Assets/labtest.png';
import Category from './Category/Category';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { getTotalQuantity } from '../Redux/cartSelectors';
import { fetchCartItems } from '../Redux/cartSlice';
import CartIconWithBadge from './Order/CartIconWithBadge';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const dispatch = useDispatch();

  const carouselData = [
    { id: '1', title: 'Slide 1', color: '#FFA07A' },
    { id: '2', title: 'Slide 2', color: '#20B2AA' },
    { id: '3', title: 'Slide 3', color: '#778899' },
  ];

  const totalQuantity = useSelector(getTotalQuantity);

  useFocusEffect(
    useCallback(() => {
      console.log('HomeScreen focused, reloading data...', totalQuantity);
      setReloadKey(prevKey => prevKey + 1);
      // dispatch(fetchCartItems()); // Uncomment if needed
    }, [])
  );

  const handlePress = () => navigation.navigate('MedicineList');
  const handleBookPathology = () => navigation.navigate('PathologyList');
  const handleRefresh = () => setReloadKey(prevKey => prevKey + 1);
  const gotoCart = () => navigation.navigate('CartScreenWithRedux');

  return (
    <ImageBackground
      source={require('../Assets/backgroundImg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.containemain}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollViewContent}
          key={reloadKey}
        >
          {/* Service Section */}
          <View style={styles.serviceSection}>
            <Text style={styles.sectionTitle}>Our Service</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Icon name="refresh-cw" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.container11}>
            <TouchableOpacity onPress={handlePress} style={styles.card}>
              <Image source={medic} style={styles.icon} />
              <Text style={styles.title}>Order Medicines</Text>
              <Text style={styles.discount}>UPTO 25%  OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBookPathology} style={styles.card}>
              <Image source={labtest} style={styles.icon} />
              <Text style={styles.title}>Book Lab Tests</Text>
              <Text style={styles.discount}>UPTO 70% OFF</Text>
            </TouchableOpacity>
          </View>

          {/* Carousel */}
          <View style={styles.carouselSection}>
            <Carousel
              loop
              autoPlay
              autoPlayInterval={3000}
              width={width}
              height={150}
              data={carouselData}
              scrollAnimationDuration={1000}
              onSnapToItem={index => setCarouselIndex(index)}
              renderItem={({ item }) => (
                <View style={[styles.carouselSlide, { backgroundColor: item.color }]}>
                  <Text style={styles.carouselText}>{item.title}</Text>
                </View>
              )}
              pagingEnabled
            />
            <View style={styles.paginationContainer}>
              {carouselData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    carouselIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Category Section */}
          <Category />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containemain: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 90,
  },
  serviceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Nunito-Black',
    textAlign: 'center',
    flex: 1,
    left: '6%',
  },
  refreshButton: {
    backgroundColor: '#34495e',
    width: 35,
    height: 35,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container11: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    width: '48%',
    backgroundColor: '#fdfdfd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 8,
  },
  carouselSection: {
    marginVertical: 20,
  },
  carouselSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  carouselText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;

