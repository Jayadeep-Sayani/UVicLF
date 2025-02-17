import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header Section: Logo & Brand Name */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.brandName}>UVicLF</Text>
      </View>

      {/* Main Content Section: Big Image + Title & Description */}
      <View style={styles.mainContent}>
        <Image
          source={{ uri: 'https://picsum.photos/400/500' }}
          style={styles.bigImage}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.appTitle}>Welcome to UVicLF</Text>
          <Text style={styles.description}>
            Lost something at UVic campus?<br></br>
            We can help you find it!
          </Text>
        </View>
      </View>

      {/* Footer Section: Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={() => {
        // Handle navigation or action here
      }}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginRight: 10,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  mainContent: {
    alignItems: 'center',
  },
  bigImage: {
    width: '100%',
    height: 500,
    borderRadius: 10,
    marginBottom: 50,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    // Adding a subtle shadow for a modern touch
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
