import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const colors = {
  primary: '#1E88E5', // Vibrant blue
  secondary: '#1565C0', // Deeper blue for contrast
  background: '#F5F5F5', // Light gray background
  white: '#FFFFFF',
  black: '#212121',
  gray: '#757575',
};

const WelcomeScreen = () => {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaProvider edges={['left', 'right', 'bottom', 'top']}>
    <View style={styles.container}>
      <StatusBar style="light" hidden />

      <ImageBackground
        source={{ uri: 'https://picsum.photos/800/1200' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          {/* Header: Logo & Brand Name */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://picsum.photos/100/100?random' }}
              style={styles.logo}
            />
            <Text style={styles.brandName}>UVicLF</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find it. Claim it. Keep it.</Text>
            <Text style={styles.heroSubtitle}>
              Lost something on campus? We’ll help you get it back!
            </Text>
          </View>

          {/* Call-to-action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Handle navigation
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    </SafeAreaProvider>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 26,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
