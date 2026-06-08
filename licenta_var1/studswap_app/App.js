import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import SavedListingsScreen from './screens/SavedListingsScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

// 1. We create an inner component to actually read the dynamic colors
function AppNavigator() {
  const { colors } = useTheme();

  // 2. We inject your dynamic background color into the React Navigation root canvas
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    // 2. Wrap NavigationContainer in SafeAreaProvider and a View with dynamic background
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator 
            initialRouteName="Start"
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' } // Let the View background show through
            }}
          >
            <Stack.Group screenOptions={{ animation: 'slide_from_right' }} >
              <Stack.Screen name="Start" component={StartScreen} options={{ animation: 'fade' }} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Group>

            <Stack.Group screenOptions={{ animation: 'none' }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="SavedListings" component={SavedListingsScreen} />
              <Stack.Screen name="Messages" component={MessagesScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
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

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { ThemeProvider } from './context/ThemeContext';

// import StartScreen from './screens/StartScreen';
// import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen';
// import HomeScreen from './screens/HomeScreen';
// import SavedListingsScreen from './screens/SavedListingsScreen';
// import MessagesScreen from './screens/MessagesScreen';
// import ProfileScreen from './screens/ProfileScreen';

// const Stack = createNativeStackNavigator();


// export default function App() {
//   return (
//     <ThemeProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Start">

//           <Stack.Group screenOptions={{ headerShown: false, animation: 'slide_from_right'}} >
//             <Stack.Screen name="Start" component={StartScreen} options={{ animation: 'fade'}} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Register" component={RegisterScreen} />
//           </Stack.Group>

//           <Stack.Group screenOptions={{ headerShown: false, animation: 'fade' }}>
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="SavedListings" component={SavedListingsScreen} />
//             <Stack.Screen name="Messages" component={MessagesScreen} />
//             <Stack.Screen name="Profile" component={ProfileScreen} />
//           </Stack.Group>

//         </Stack.Navigator>
//       </NavigationContainer>
//     </ThemeProvider>
//   );
// }