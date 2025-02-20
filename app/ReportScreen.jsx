import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { supabase } from '../utils/supabaseClient';
import * as FileSystem from "expo-file-system";

const ReportScreen = ({ navigation, route }) => {
  const { image_uri } = route.params;

  const [itemName, setItemName] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [retrieveLocation, setRetrieveLocation] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadImage = async (imageUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        console.error("File does not exist");
        return null;
      }

      const filename = `reports/${Date.now()}.jpg`;
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binaryData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const { data, error } = await supabase.storage
        .from('lost-found-images')
        .upload(filename, binaryData, { contentType: "image/jpeg" });

      if (error) {
        console.error('Error uploading image:', error.message);
        Alert.alert('Upload Error', 'Failed to upload image.');
        return null;
      }

      const { data: publicData } = supabase.storage
        .from('lost-found-images')
        .getPublicUrl(filename);

      return publicData.publicUrl;
    } catch (err) {
      console.error('Upload exception:', err);
      Alert.alert('Error', 'An error occurred while uploading the image.');
      return null;
    }
  };

  const handleReport = async () => {
    if (!itemName.trim() || !foundLocation.trim() || !retrieveLocation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Error', 'User not authenticated');
      setLoading(false);
      return;
    }

    const fullName = user.user_metadata.full_name || user.email || 'Anonymous';

    let uploadedImageURL = null;
    if (image_uri) {
      uploadedImageURL = await uploadImage(image_uri);
      if (!uploadedImageURL) {
        setLoading(false);
        return;
      }
    }

    const reportData = {
      image_uri: uploadedImageURL,
      itemName,
      foundLocation,
      retrieveLocation,
      details,
      fullName,
    };

    try {
      const { data, error } = await supabase.from('lost_items').insert(reportData).single();
      if (error) throw error;

      Alert.alert('Report Submitted', 'Your report has been submitted successfully.');
      navigation.navigate('HOME');
    } catch (error) {
      console.error('Error submitting report:', error.message);
      Alert.alert('Error', 'There was an error submitting your report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Report a Lost Item</Text>
        <Text style={styles.subtitle}>* All fields marked with an asterisk are required</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput style={styles.input} value={itemName} onChangeText={setItemName} placeholder="Enter item name" placeholderTextColor={colors.gray} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Found Location *</Text>
          <TextInput style={styles.input} value={foundLocation} onChangeText={setFoundLocation} placeholder="Where was it found?" placeholderTextColor={colors.gray} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Retrieval Location *</Text>
          <TextInput style={styles.input} value={retrieveLocation} onChangeText={setRetrieveLocation} placeholder="Where can it be retrieved?" placeholderTextColor={colors.gray} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Details</Text>
          <TextInput style={[styles.input, styles.textArea]} value={details} onChangeText={setDetails} placeholder="Enter any additional details" placeholderTextColor={colors.gray} multiline />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReport} disabled={loading}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Submitting Report...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.white },
  container: { padding: 20, backgroundColor: colors.white, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  subtitle: { fontSize: 16, color: colors.gray, marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 8, fontSize: 16, color: colors.primary },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.white, marginTop: 10, fontSize: 18 }
});

export default ReportScreen;