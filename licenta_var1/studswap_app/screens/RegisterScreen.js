import React, { useState } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext'; // Import Theme!
import { getGlobalStyles, getRegisterStyles } from '../styles/RegisterScreenStyle'; 
import { API_BASE_URL } from '../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Grab dynamic colors and generate styles!
  const { colors } = useTheme();
  const globalStyles = getGlobalStyles(colors);
  const localStyles = getRegisterStyles(colors);

  const handleRegister = async () => {
    if (!email || !password || !displayName || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
          displayName: displayName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userId', data.userId);
        navigation.navigate('Home'); 
      } else {
        Alert.alert("Registration Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={localStyles.registerScrollContainer} keyboardShouldPersistTaps="handled">
      <View style={localStyles.registerInnerContainer}>
        
        <Text style={localStyles.registerTitle}>Create an account</Text>
        
        <Text style={localStyles.registerLabel}>Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          style={globalStyles.input}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
        />
        
        <Text style={localStyles.registerLabel}>Student Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <Text style={localStyles.registerLabel}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={globalStyles.input}
          placeholderTextColor={colors.muted}
          secureTextEntry
        />

        <Text style={localStyles.registerLabel}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={globalStyles.input}
          placeholderTextColor={colors.muted}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={[globalStyles.buttonSolid, localStyles.registerButtonMargin, loading && { opacity: 0.7 }]}
          activeOpacity={0.8}
        >
          <Text style={[globalStyles.buttonTextSolid, { color: '#FFF' }]} numberOfLines={1}>
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// import React, { useState } from 'react';
// import { View, Alert, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { styles as globalStyles, colors } from '../styles/RegisterScreenStyle'; 
// import { API_BASE_URL } from '../firebaseConfig';

// export default function RegisterScreen({ navigation }) {
//   const [displayName, setDisplayName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!email || !password || !displayName || !confirmPassword) {
//       Alert.alert("Error", "Please fill in all fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password: password,
//           displayName: displayName.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         await AsyncStorage.setItem('userId', data.userId);
//         navigation.navigate('Home'); 
//       } else {
//         Alert.alert("Registration Failed", data.error || "Something went wrong");
//       }
//     } catch (error) {
//       Alert.alert("Network Error", "Could not connect to the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={globalStyles.registerScrollContainer} keyboardShouldPersistTaps="handled">
//       <View style={globalStyles.registerInnerContainer}>
        
//         <Text style={globalStyles.registerTitle}>Create an account</Text>
        
//         <Text style={globalStyles.registerLabel}>Name</Text>
//         <TextInput
//           value={displayName}
//           onChangeText={setDisplayName}
//           style={globalStyles.input}
//           autoCorrect={false}
//         />
        
//         <Text style={globalStyles.registerLabel}>Student Email Address</Text>
//         <TextInput
//           value={email}
//           onChangeText={setEmail}
//           style={globalStyles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           autoCorrect={false}
//         />
        
//         <Text style={globalStyles.registerLabel}>Password</Text>
//         <TextInput
//           value={password}
//           onChangeText={setPassword}
//           style={globalStyles.input}
//           secureTextEntry
//         />

//         <Text style={globalStyles.registerLabel}>Confirm Password</Text>
//         <TextInput
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           style={globalStyles.input}
//           secureTextEntry
//         />

//         <TouchableOpacity
//           onPress={handleRegister}
//           disabled={loading}
//           style={[
//             globalStyles.buttonSolid, 
//             globalStyles.registerButtonMargin, 
//             loading && { opacity: 0.7 }
//           ]}
//           activeOpacity={0.8}
//         >
//           <Text style={globalStyles.buttonTextSolid}>
//             {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
//           </Text>
//         </TouchableOpacity>

//       </View>
//     </ScrollView>
//   );
// }