import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function TabThree() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Three</Text>
      <Text>Your profile and settings go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 20, fontWeight: '600', marginBottom: 8},
});
