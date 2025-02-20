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
import * as FileSystem from "expo-file-system";

const ReportScreen = ({ navigation, route }) => {
  // Retrieve the passed image URI (or image) from navigation params
  const { image_uri } = route.params; 

  const [itemName, setItemName] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [retrieveLocation, setRetrieveLocation] = useState('');
  const [details, setDetails] = useState('');

  // Function to upload image to Supabase Storage and return the public URL
  const uploadImage = async (imageUri) => {
    try {

      const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      console.error("File does not exist");
      return null;
    }

    const fileName = `images/${Date.now()}.jpg`;

    // Read file as base64 string
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binaryData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    
      const filename = `reports/${Date.now()}.jpg`;

      // Upload the image to a Supabase Storage bucket (e.g., 'lost-found-images')
      const { data, error } = await supabase.storage
        .from('lost-found-images')
        .upload(filename, binaryData, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error('Error uploading image:', error.message);
        Alert.alert('Upload Error', 'Failed to upload image.');
        return null;
      }

      // Get the public URL for the uploaded image
      const { data: publicData } = supabase.storage
        .from('lost-found-images')
        .getPublicUrl(filename);

      const publicUrl = publicData.publicUrl;

      console.log('Public URL:', publicUrl);

      return publicUrl;

    } catch (err) {
      console.error('Upload exception:', err);
      Alert.alert('Error', 'An error occurred while uploading the image.');
      return null;
    }
  };

  const handleReport = async () => {
    // Validate required fields
    if (!itemName.trim() || !foundLocation.trim() || !retrieveLocation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Retrieve the current user from Supabase Auth.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Retrieve full name from user metadata (or fallback to email)
    const fullName = user.user_metadata.full_name || user.email || 'Anonymous';

    // Upload the image and get its public URL
    let uploadedImageURL = null;
    if (image_uri) {
      uploadedImageURL = await uploadImage(image_uri);
      if (!uploadedImageURL) {
        // Stop if image upload fails
        return;
      }
    }
    console.log('Uploaded image URL:', uploadedImageURL);
    // Build the report object using the public URL for the image
    const reportData = {
      image_uri: uploadedImageURL, // now a remote URL
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
