import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { supabase } from '../utils/supabaseClient';

const ReportScreen = ({ navigation, route }) => {
  // Retrieve the passed image URI (or image) from navigation params
  const { image_uri } = route.params;
  console.log('Image URI:', image_uri);

  const [itemName, setItemName] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [retrieveLocation, setRetrieveLocation] = useState('');
  const [details, setDetails] = useState('');

  const handleReport = async () => {
    // Validate required fields
    if (!itemName.trim() || !foundLocation.trim() || !retrieveLocation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Retrieve the current user from Supabase Auth.
    // For Supabase JS v2 use:
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If you're using v1, you might use:
    // const user = supabase.auth.user();

    if (userError || !user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Retrieve full name from user metadata (or fallback to email)
    const fullName = user.user_metadata.full_name || user.email || 'Anonymous';

    // Build the report object
    const reportData = {
      image_uri,
      itemName,
      foundLocation,
      retrieveLocation,
      details,
      fullName,
    };

    try {
      // Insert the report data into the 'lost_items' table in Supabase
      const { data, error } = await supabase
        .from('lost_items')
        .insert(reportData)
        .single();

      if (error) throw error;

      console.log('Report submitted:', data);
      Alert.alert('Report Submitted', 'Your report has been submitted successfully.');
      navigation.navigate('HOME');
    } catch (error) {
      console.error('Error submitting report:', error.message);
      Alert.alert('Error', 'There was an error submitting your report. Please try again later.');
    }
  };

  const handleDiscard = () => {
    navigation.navigate('HOME');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Report a Lost Item</Text>
        <Text style={styles.subtitle}>* All fields marked with an asterisk are required</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Found Location *</Text>
          <TextInput
            style={styles.input}
            value={foundLocation}
            onChangeText={setFoundLocation}
            placeholder="Where was it found?"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Retrieval Location *</Text>
          <TextInput
            style={styles.input}
            value={retrieveLocation}
            onChangeText={setRetrieveLocation}
            placeholder="Where can it be retrieved?"
            placeholderTextColor={colors.gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={details}
            onChangeText={setDetails}
            placeholder="Enter any additional details"
            placeholderTextColor={colors.gray}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReport}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.discardButton]} onPress={handleDiscard}>
          <Text style={[styles.buttonText, styles.discardButtonText]}>Discard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  discardButton: {
    backgroundColor: colors.gray,
  },
  discardButtonText: {
    color: colors.white,
  },
});
