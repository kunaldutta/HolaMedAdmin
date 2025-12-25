import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { navigate } from '../NavigationService';

/**
 * Request FCM notification permission and get the device token.
 */
export async function requestFCMPermission() {
  let hasPermission = true;

  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs permission to send you notifications.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('❌ Android POST_NOTIFICATIONS denied');
          hasPermission = false;
        } else {
          console.log('✅ Android POST_NOTIFICATIONS granted');
        }
      } else {
        console.log('ℹ️ Android < 13: POST_NOTIFICATIONS not required');
      }
    }

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('❌ iOS FCM permission denied');
        hasPermission = false;
      } else {
        console.log('✅ iOS FCM permission granted');

        await messaging().registerDeviceForRemoteMessages();
        console.log('✅ iOS device registered for remote messages');

        const apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          console.warn('❌ APNs token not yet available (simulator cannot get APNs tokens)');
          // Return early to avoid FCM token error
          return null;
        } else {
          console.log('✅ APNs Token:', apnsToken);
        }
      }
    }

    if (hasPermission) {
      const fcmToken = await messaging().getToken();
      console.log('✅ FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('❌ requestFCMPermission Error:', error);
  }

  return null;
}

/**
 * Setup FCM notification listeners for foreground, background, and quit state.
 */
export function setupNotificationListeners() {
  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('📲 Foreground message received:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || 'You have a new message'
    );
  });

  // Background state open
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📲 Opened from background:', remoteMessage);
    if (remoteMessage?.data?.screen) {
      const { screen, ...params } = remoteMessage.data;
      navigate(screen, params);
    }
  });

  // Quit state open
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('📲 Opened from quit state:', remoteMessage);
        if (remoteMessage?.data?.screen) {
          const { screen, ...params } = remoteMessage.data;
          navigate(screen, params);
        }
      }
    });
}
