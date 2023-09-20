import React, { useContext } from "react"
import { TouchableOpacity, View, Text } from "react-native"
import { LoginContext } from "../../../services/login/login.context"

export const SettingsScreen = ({navigation}) => {
    const { signOutFunc } = useContext(LoginContext);
    return (
        <View>
            <TouchableOpacity onPress={() => {signOutFunc(); navigation.navigate("LogIn")}}><Text>Log In</Text></TouchableOpacity>
        </View>
    )
}