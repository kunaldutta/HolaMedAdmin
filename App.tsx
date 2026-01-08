/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-reanimated';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';
import store from './src/Redux/store';
import Login from './src/screens/Login';
import MainTabs from './src/navigation/MainTabs';
import MedicineListScreen from './src/Medicine/MedicineListScreen';
import MedicineList from './src/Medicine/MedicineList';
import MedicineDetail from './src/Medicine/MedicineDetail';
import ProductDetailScreen from './src/Medicine/ProductDetailScreen';
import CartScreenWithRedux from './src/screens/CartScreen/CartScreenWithRedux';
import Category from './src/screens/Category/Category';
import SubCategory from './src/screens/Category/SubCategory';
import ProductScreen from './src/screens/Category/ProductScreen';
import AddAddress from './src/screens/Address/AddAddress';
import AddressListScreen from './src/screens/Address/AddressListScreen';
import EditAddressScreen from './src/screens/Address/EditAddressScreen';
import { AddressProvider } from './src/components/AddressContext';
import PurchaseReviewScreen from './src/screens/PlaceOrder/PurchaseReviewScreen';
import AddItemAndCategory from './src/Health/AddItemAndCategory';
import AddMedicine from './src/Health/AddMedicine';
import OrderHistory from './src/Order/OrderHistory';
import Members from './src/Health/Members/Members'
import PathologyForm from './src/Health/Pathologies/PathologyForm';
import PathologyList from './src/Health/Pathologies/PathologyList';

enableScreens();

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <AddressProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="MedicineListScreen"
              component={MedicineListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicineList"
              component={MedicineList}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MedicineDetail"
              component={MedicineDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CartScreenWithRedux"
              component={CartScreenWithRedux}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Category"
              component={Category}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SubCategory"
              component={SubCategory}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProductScreen"
              component={ProductScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddAddress"
              component={AddAddress}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddressListScreen"
              component={AddressListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditAddressScreen"
              component={EditAddressScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PurchaseReviewScreen"
              component={PurchaseReviewScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddItemAndCategory"
              component={AddItemAndCategory}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="AddMedicine"
              component={AddMedicine}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistory}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="Members"
              component={Members}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="PathologyForm"
              component={PathologyForm}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="PathologyList"
              component={PathologyList}
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
      </AddressProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
