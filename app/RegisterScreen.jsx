import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider edges={['left', 'right', 'bottom', 'top']}>
      <View style={styles.container}>
        <StatusBar style="light" hidden />

        <View style={styles.overlay}>
          {/* Header: Logo & Title */}
          <View style={styles.header}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.brandName}>UVicLF</Text>
          </View>

          {/* Register Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.gray}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.gray}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.gray}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.gray}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LOGIN')}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'absolute',
    top: 30,
    left: 20,
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
  formContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
