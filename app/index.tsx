import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../utils/supabaseClient';

import WelcomeScreen from './WelcomeScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import ReportScreen from './ReportScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('WELCOME');

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setInitialRoute('HOME'); // Redirect to Home if logged in
      }
    };

    checkUser();
  }, []);

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WELCOME" component={WelcomeScreen} />
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="REGISTER" component={RegisterScreen} />
      <Stack.Screen name="HOME" component={HomeScreen} />
      <Stack.Screen name="REPORT" component={ReportScreen} />
    </Stack.Navigator>
  );
};

export default App;
