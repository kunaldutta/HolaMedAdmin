import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function TabProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text>Search and explore content here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 20, fontWeight: '600', marginBottom: 8},
});
