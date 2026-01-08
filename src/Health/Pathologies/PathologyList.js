import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

const PathologyList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPathologies = async () => {
    try {
      const res = await fetch('https://developersdumka.in/ourmarket/Medicine/get_pathologies.php');
      const json = await res.json();

      if (json.status) {
        setData(json.data);
      } else {
        Alert.alert('No data found');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathologies();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PathologyMapScreen', { pathology: item })}
      style={{ marginBottom: 10 }}
    >
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{item.path_name}</Text>
      <Text>{item.address1}, {item.address2}</Text>

      {/* <View style={styles.locationRow}>
        <Text style={styles.locationPin}>📍</Text>
        <Text
          style={styles.mapLink}
          onPress={() => navigation.navigate('PathologyMapScreen', { lat_long: item.lat_long })}
        >
          View on Map
        </Text>
      </View> */}

      <Text>{item.contact_no}</Text>
    </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pathology List</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.path_name + index}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    marginLeft: 20,
    flex: 1,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  image: {
  width: '100%',
  height: 200,
  borderRadius: 6,
  marginBottom: 10,
  resizeMode: "contain",
},
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationPin: {
    fontSize: 18,
    marginRight: 8,
  },
  mapLink: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default PathologyList;
