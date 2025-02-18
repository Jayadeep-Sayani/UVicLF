import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <SafeAreaProvider edges={['left', 'right', 'bottom', 'top']}>
    <View style={styles.container}>
      <StatusBar style="light" hidden />

      
        <View style={styles.overlay}>
          {/* Header: Logo & Brand Name */}
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.brandName}>UVicLF</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroContent}>
            <Image source={{ uri: 'https://www.uvic.ca/brand/_assets/images/cards/cards/uvic-mark.webp'}} style={{ width: '100%', aspectRatio: 1, marginBottom: '-25%'  }} resizeMode="contain"/>
            <Text style={styles.heroTitle}>Find it. Claim it. Relax.</Text>
            <Text style={styles.heroSubtitle}>
              Lost something on UVic campus? We’ll help you get it back!
            </Text>
          </View>

          {/* Call-to-action Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('REGISTER');
            }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: colors.white,
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
    color: colors.primary,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 26,
    marginHorizontal: 30,
    marginBottom: 100,
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
