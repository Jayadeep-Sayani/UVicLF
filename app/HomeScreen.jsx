import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { colors } from '../utils/colors';
import { supabase } from '../utils/supabaseClient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // Listen for app state changes to hide the modal when the app becomes active
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setModalVisible(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Reset navigation to the 'WELCOME' screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'WELCOME' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUploadPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Camera permission is required to take a picture!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);

    if (!result.canceled) {
      // Handle the image upload here (don't show the image)
      navigation.navigate('REPORT', { image: result.assets.uri });
      // You can implement the image upload to Supabase here if required
    }
  };

  const handleTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Camera permission is required to take a picture!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the image upload here (don't show the image)
      navigation.navigate('REPORT', { image: result });
      // You can implement the image upload to Supabase here if required
    }
  };

  return (
    <SafeAreaProvider edges={['left', 'right', 'top']}>
      <View style={styles.container}>
        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Report Item</Text>
          {/* Warning Message */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              {"Do not upload  sensitive information. \n(Banking Info, Address, Social Insurance etc) \n\nViolators will face severe consequences."}
            </Text>
          </View>

          {/* Upload Option */}
          <TouchableOpacity style={styles.uploadContainer} onPress={handleUploadPress}>
            <Ionicons name="cloud-upload-outline" size={50} color={colors.gray} />
            <Text style={styles.uploadText}>Upload image of the item (Gallery)</Text>
          </TouchableOpacity>

          {/* Camera Option */}
          <TouchableOpacity style={styles.uploadContainer} onPress={handleTakePicture}>
            <Ionicons name="camera" size={50} color={colors.gray} />
            <Text style={styles.uploadText}>Take a picture of the item (Camera)</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HOME')}>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('EXPLORE')}>
            <Ionicons name="search" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setModalVisible(true)}>
            <Ionicons name="log-out-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Ionicons
                name="alert-circle-outline"
                size={50}
                color={colors.primary}
                style={styles.modalIcon}
              />
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.noButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.warningBackground,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    flex: 1,
  },
  uploadContainer: {
    width: '100%',
    height: '30%',
    borderWidth: 2,
    borderColor: colors.gray,
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: colors.gray,
  },
  navItem: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: colors.primary,
  },
  noButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

