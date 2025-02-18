import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReportScreen = ({ route }) => {
  const { image_uri } = route.params;

  console.log(image_uri);
  return (
    <View>
      <Text>ReportScreen</Text>
    </View>
  )
}

export default ReportScreen

const styles = StyleSheet.create({})