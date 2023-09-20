import React from "react";
import { View, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
    useFonts,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_300Light
} from "@expo-google-fonts/poppins";

import './firebase';
import { HomeScreen } from "./src/features/map/screens/map.screen.js";
import { screenOptions, option } from "./options.navigation.js";
import { colors } from "./theme.js";
import { SettingsScreen } from "./src/features/settings/screens/settings.screen.js";
import { LoginContextProvider } from "./src/services/login/login.context.js";
import { LoginScreen } from "./src/features/login/screens/login.screen";
import { SignUpScreen } from "./src/features/login/screens/signUp.screen";
import { FamilyScreen } from "./src/features/family/screens/family.screen";
import { FamilyNavigator } from "./src/features/family/family.navigator";
import { RoutesContextProvider } from "./src/services/routes/routes.context";
import { FamilyContextProvider } from "./src/services/family/family.context";
import { SecurityScreen } from "./src/features/security/screens/security.screen";
import { RatingsContextProvider } from "./src/services/ratings/ratings.context";
import { RatingScreen } from "./src/features/ratings/screens/ratings.screen";
import { ProfileContextProvider } from "./src/services/profile/profile.context";
import { ProfileScreen } from "./src/features/login/screens/profile.screen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
          name="Map"
          options={option}
          component={HomeScreen}/> 
      
      <Tab.Screen
          name="Family"
          options={option}
          component={FamilyNavigator}/> 
      
      <Tab.Screen
          name="Security"
          options={option}
          component={SecurityScreen}/> 

      <Tab.Screen
          name="Ratings"
          options={option}
          component={RatingScreen}/> 
      
      <Tab.Screen
          name="Settings"
          options={option}
          component={SettingsScreen}/> 
      
    </Tab.Navigator>
  );
}

const App = () => {

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_300Light
  }); // Loading Fonts To Use
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <LoginContextProvider>
        <ProfileContextProvider>
          <RatingsContextProvider>
            <RoutesContextProvider>
              <FamilyContextProvider>
                <NavigationContainer>
                  <StatusBar hidden/>
                  <Stack.Navigator>
                    <Stack.Screen
                      name="LogIn"
                      options={option}
                      component={LoginScreen}/>
                    
                    <Stack.Screen
                      name="SignUp"
                      options={option}
                      component={SignUpScreen}/>
                    
                    <Stack.Screen
                      name="Profile"
                      options={option}
                      component={ProfileScreen}/>

                    <Stack.Screen
                      name="Home"
                      options={option}
                      component={HomeStack}/>
                  </Stack.Navigator>
                </NavigationContainer>
              </FamilyContextProvider>
            </RoutesContextProvider>
          </RatingsContextProvider>
        </ProfileContextProvider>
      </LoginContextProvider>
    </View>
  );
};

export default App;
