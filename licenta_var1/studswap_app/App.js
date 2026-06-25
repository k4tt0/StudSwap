import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import HomeScreen from './screens/HomeScreen';
import SavedListingsScreen from './screens/SavedListingsScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateListingScreen from './screens/CreateListingScreen';
import ListingDetailsScreen from './screens/ListingDetailsScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import EditListingScreen from './screens/EditListingScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { colors } = useTheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator 
            initialRouteName="Start"
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' } 
            }}
          >
            <Stack.Group screenOptions={{ animation: 'slide_from_right' }} >
              <Stack.Screen name="Start" component={StartScreen} options={{ animation: 'fade' }} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen 
                name="VerifyEmail" 
                component={VerifyEmailScreen} 
                options={{ gestureEnabled: false }} 
              />
              <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
              <Stack.Screen name="ChatRoom" component={ChatRoomScreen} /> 
            </Stack.Group>

            <Stack.Group screenOptions={{ animation: 'none' }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="SavedListings" component={SavedListingsScreen} />
              <Stack.Screen name="Messages" component={MessagesScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom' }}>
              <Stack.Screen name="CreateListing" component={CreateListingScreen} />
              <Stack.Screen name="EditListing" component={EditListingScreen} />
            </Stack.Group>

          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}