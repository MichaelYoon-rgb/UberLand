import React, { useContext } from "react";
import { View, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FamilyScreen } from "./screens/family.screen";
import { QRCodeScreen, ScannerScreen } from "./screens/scanner.screen";
import { GenerateScreen } from "./screens/generate.screen";
import { SetupScreen } from "./screens/setup.screen";
import { ProfileContext } from "../../services/profile/profile.context";

const Stack = createNativeStackNavigator();

export const FamilyNavigator = () => {
    const { profile } = useContext(ProfileContext)
    return (
    <View style={{ flex: 1 }}>
        <StatusBar hidden/>
        <Stack.Navigator>
            
            <Stack.Screen
                name="Setup"
                options={{headerShown: false}}
                component={SetupScreen}/>
            
            <Stack.Screen
                name="Family"
                options={{headerShown: false}}
                component={FamilyScreen}/>
            
            <Stack.Screen
                name="Generator"
                options={{headerShown: false}}
                component={GenerateScreen}/>

            <Stack.Screen
                name="Scanner"
                options={{headerShown: false}}
                component={ScannerScreen}/>

            

        </Stack.Navigator>
    </View>
  );
};
