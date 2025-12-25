import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';

const PathologyForm = ({ navigation, rout }) => {
  const [form, setForm] = useState({
    path_name: '',
    address1: '',
    address2: '',
    lat_long: '',
    contact_no: '',
  });

  const [image, setImage] = useState(null);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel || response.errorCode) {
        console.log('Image selection canceled or failed');
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') { return true; }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    console.log('Location permission granted:', hasPermission);
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const latLongStr = `${latitude},${longitude}`;
        setForm(prev => ({ ...prev, lat_long: latLongStr }));
        Alert.alert('Location Captured', latLongStr);
      },
      error => {
        console.error('Location Error:', error);
        Alert.alert('Location Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const uploadData = async () => {
  const data = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    data.append(key, value);
  });

  if (image) {
    data.append('image', {
      uri: image.uri,
      name: image.fileName || 'upload.jpg',
      type: image.type || 'image/jpeg',
    });
  }

  try {
    const res = await fetch('https://developersdumka.in/ourmarket/Medicine/upload_pathology.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    });
    console.log('Response status:', res.status);
    console.log('Response headers:', JSON.stringify(res.headers.map));

    const text = await res.text(); // first read raw response
    console.log('Raw response:', text);

    const result = JSON.parse(text); // then try to parse
    Alert.alert(result.message);
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Upload failed');
  }
};


  return (
    <SafeAreaView style={styles.containemain}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medicine</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Pathology Name</Text>
        <TextInput style={styles.input} onChangeText={t => handleChange('path_name', t)} />

        <Text style={styles.label}>Address Line 1</Text>
        <TextInput style={styles.input} onChangeText={t => handleChange('address1', t)} />

        <Text style={styles.label}>Address Line 2</Text>
        <TextInput style={styles.input} onChangeText={t => handleChange('address2', t)} />


        {form.lat_long ? (
          <Text style={styles.locationDisplay}>📍 Current Location</Text>
        ) : null}

        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={t => handleChange('contact_no', t)}
        />

        <Button title="Choose Image" onPress={chooseImage} />
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 100, height: 100, marginVertical: 10 }}
          />
        )}

        <Button title="Upload Data" onPress={uploadData} color="green" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containemain: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRow: {
    height: '7%',
    width: '78%',
    flexDirection: 'row',
    alignItems: 'center',
    left: '5%',
  },
  container: {
    padding: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    flex: 1,
  },
  locationBtn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontWeight: '600',
  },
  locationDisplay: {
    marginBottom: 10,
    color: 'gray',
    fontStyle: 'italic',
  },
});

export default PathologyForm;
