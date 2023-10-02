import React, { useContext } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { LoginContext } from "../../../services/login/login.context"
import { ProfileContext } from "../../../services/profile/profile.context";

export const SettingsScreen = ({navigation}) => {
    const { signOutFunc } = useContext(LoginContext);
    const { updateLocation, removeLocation } = useContext(ProfileContext);

    return (
        <View>
            <TouchableOpacity onPress={() => {removeLocation(updateLocation); signOutFunc(); navigation.navigate("LogIn")}}><Text>Log Out</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {}}><Text>Route Alert Distance</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => {}}><Text>Speed Alert</Text></TouchableOpacity>
            
        </View>
    )
}