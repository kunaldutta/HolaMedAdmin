import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

const PathologyMapScreen = ({ navigation, route }) => {
  console.log('PathologyMapScreen route params:', route.params);
  
  const pathology = route?.params?.pathology;

  if (!pathology || !pathology.lat_long) {
    Alert.alert('Error', 'Location data not found');
    return null;
  }
  const { path_name, address1, address2, contact_no } = pathology;
  const [latitude, longitude] = pathology.lat_long
    .split(',')
    .map(coord => parseFloat(coord.trim()));

  const openGoogleMapsNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Failed to open Google Maps')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Check Detail</Text>
          </View>
        </View>

        <View style={{ height: '50%' }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={path_name}
              description={`Address: ${address1},${address2}`}
            />
          </MapView>
        </View>
        <Text style={{ padding: 20, fontSize: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>{path_name}</Text>
          {'\n'}
          {address1}, {address2}
          {'\n'}
          Contact: {contact_no}
        </Text>
        <View style={{ height: '10%', bottom:20 }} />
        <TouchableOpacity style={styles.callButton} onPress={openGoogleMapsNavigation}>
            <Text style={styles.navButtonText}>Contact: {contact_no}</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={openGoogleMapsNavigation}>
            <Text style={styles.navButtonText}>Navigate in Google Maps</Text>
          </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  callButton: {
    top: 0,
    left: '15%',
    width: '70%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButton: {
    top: 10,
    left: '15%',
    width: '70%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: '8%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitleContainer: {
    height: '45%',
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
    flex: 1,
    width: '100%',
  },
});

export default PathologyMapScreen;
