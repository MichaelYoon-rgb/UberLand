import React from "react";
import { View, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
    useFonts,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_300Light
} from "@expo-google-fonts/poppins";

import { HomeScreen } from "./src/features/home/screens/home.screen.js";
import { screenOptions, option } from "./options.navigation.js";
import { LoadingScreen } from "./src/features/loading/screens/loading.screen.js";
import { colors } from "./theme.js";

const Tab = createBottomTabNavigator();

const App = () => {

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_300Light
  }); // Loading Fonts To Use

  if (!fontsLoaded) {
    return <LoadingScreen/>
  } // Make Sure The Fonts Have Been Loaded
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.secondary }}>
      <NavigationContainer>
          <StatusBar hidden/>
          <Tab.Navigator screenOptions={screenOptions}>

              <Tab.Screen
                  name="Home"
                  options={option}
                  component={HomeScreen}/> 

          </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
