import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { requestFCMPermission } from '../../src/Services/firebaseService';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/Feather';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('Kd@test.in');
  const [password, setPassword] = useState('Kun@8100');
  const [notificationToken, setNotificationToken] = useState('NA');
  const [adminData, setAdminData] = useState('NA');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUuid();
    fetchToken();
  }, []);

  const fetchUuid = async () => {
    try {
      const uniqueId = await DeviceInfo.getUniqueId();
      setAdminData(uniqueId);
      console.log('✅ UUID fetched:', uniqueId);
    } catch (error) {
      console.error('❌ Error fetching UUID:', error);
      Alert.alert('Error', 'Failed to fetch unique identifier');
    }
  };

  const fetchToken = async () => {
    const token = await requestFCMPermission();
    console.log('✅ Token inside LoginScreen:', token);
    if (token) {
      setNotificationToken(token);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        admin_email: email,
        password: password,
        notification_token: notificationToken,
        uuid: adminData,
      };

      const response = await axios.post(
        'https://developersdumka.in/ourmarket/Medicine/admin_login.php',
        requestData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Login successful');
        await EncryptedStorage.setItem('admin_id', response.data.admin_id.toString());
        await EncryptedStorage.setItem('admin_name', response.data.admin_name);
        await EncryptedStorage.setItem('admin_email', response.data.admin_email);
        await EncryptedStorage.setItem('admin_mob_no', response.data.admin_mob_no);
        await EncryptedStorage.setItem('roll_of_admin', response.data.roll_of_admin);
        await EncryptedStorage.setItem('approval_from', response.data.approval_from);

        const admin_id = await EncryptedStorage.getItem('admin_id');
        console.log('Admin ID stored:', admin_id);

        navigation.replace('MainTabs');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('RegisterAdmin');
  };

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="gray"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff' }}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
        <Text style={{ color: '#fff' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  loginButton: {
    backgroundColor: '#34495e',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '40%',
    marginLeft: '30%',
    flexDirection: 'row',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
});
