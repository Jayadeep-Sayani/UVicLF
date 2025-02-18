import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { supabase } from '../utils/supabaseClient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // When app comes to the foreground, hide the modal
      if (nextAppState === 'active') {
        setModalVisible(false);
      }
    });

    // Clean up the subscription on unmount
    return () => subscription.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Reset the navigation stack to only have the 'WELCOME' screen.
      navigation.reset({
        index: 0,
        routes: [{ name: 'WELCOME' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <SafeAreaProvider edges={['left', 'right', 'bottom', 'top']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>HomeScreen</Text>
        </View>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CreateNew')}>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Explore')}>
            <Ionicons name="search" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setModalVisible(true)}>
            <Ionicons name="log-out-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Ionicons name="alert-circle-outline" size={50} color={colors.primary} style={styles.modalIcon} />
              <Text style={styles.modalText}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => setModalVisible(false)}>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
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
