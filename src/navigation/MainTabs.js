import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabOne from '../screens/TabHome';
import TabTwo from '../screens/TabProfile';
import TabThree from '../screens/TabThree';
import Health from '../Health/Health';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="TabOne" component={TabOne} options={{title: 'Home'}} />
      <Tab.Screen name="TabTwo" component={TabTwo} options={{title: 'Search'}} />
      <Tab.Screen name="TabThree" component={Health} options={{title: 'Profile'}} />
    </Tab.Navigator>
  );
}
