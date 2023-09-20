import React from "react";
import { View, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FamilyScreen } from "./screens/family.screen";
import { QRCodeScreen, ScannerScreen } from "./screens/scanner.screen";
import { GenerateScreen } from "./screens/generate.screen";

const Stack = createNativeStackNavigator();

export const FamilyNavigator = () => {
  
    return (
    <View style={{ flex: 1 }}>
        <StatusBar hidden/>
        <Stack.Navigator>
            <Stack.Screen
                name="Create"
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
