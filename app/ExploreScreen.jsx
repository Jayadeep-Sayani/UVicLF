import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';
import { supabase } from '../utils/supabaseClient';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Hide logout modal when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setModalVisible(false);
      }
    });
    return () => subscription.remove();
  }, []);

  // Fetch reported items from the past 7 days
  const fetchReports = async () => {
    setLoading(true);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error.message);
    } else {
      setReports(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Logout the user and reset navigation to 'WELCOME'
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'WELCOME' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_uri ? (
        <Image source={{ uri: item.image_uri }} style={styles.cardImage} />
      ) : null}
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.label}>
        Found at: <Text style={styles.value}>{item.foundLocation}</Text>
      </Text>
      <Text style={styles.label}>
        Retrieval Location: <Text style={styles.value}>{item.retrieveLocation}</Text>
      </Text>
      {item.details ? (
        <Text style={styles.details}>Details: {item.details}</Text>
      ) : null}
      <Text style={styles.reportedBy}>Reported by: {item.fullName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reported Items (Last 7 Days)</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No reports found in the past 7 days.</Text>
            }
          />
        )}
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
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  value: {
    fontWeight: 'normal',
  },
  details: {
    fontSize: 14,
    color: colors.gray,
    marginVertical: 5,
  },
  reportedBy: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 10,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
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
