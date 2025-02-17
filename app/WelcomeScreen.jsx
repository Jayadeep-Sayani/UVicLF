import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../utils/colors';

const WelcomeScreen = () => {
  const { width, height } = useWindowDimensions();
  const imageWidth = width - 40; // Account for horizontal padding (20px each side)
  const baseImageHeight = imageWidth * 1.2;
  // For bigger phones, make the image even larger:
  const imageHeight = height >= 800 ? baseImageHeight * 1.2 : baseImageHeight;

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

      {/* Big Image */}
      <Image
        source={{ uri: 'https://picsum.photos/400/500' }}
        style={[styles.bigImage, { width: imageWidth, height: imageHeight }]}
        resizeMode="cover"
      />

      {/* Middle Section: Centered Text */}
      <View style={styles.middleSection}>
        <View style={styles.textContainer}>
          <Text style={styles.appTitle}>Welcome to UVicLF</Text>
          <Text style={styles.description}>
            {`Lost something on UVic campus?\nWe can help you find it!`}
          </Text>
        </View>
      </View>

      {/* Footer Section: Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Handle navigation or action here
        }}
      >
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
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1%', // Increased bottom margin to separate header and image
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
  bigImage: {
    borderRadius: 10,
    marginTop: 20, // Added top margin to create space from the header
    marginBottom: 10,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center', // Vertically center the text
    alignItems: 'center',     // Horizontally center the text
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
    alignItems: 'center',
    borderRadius: 10,
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
