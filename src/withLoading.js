// withLoading.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ loading, ...props }) {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#34495e" />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default withLoading;
