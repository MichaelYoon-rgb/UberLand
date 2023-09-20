import React, { useContext } from "react"
import { ProfileContext } from "../../../services/profile/profile.context"
import { TouchableOpacity, Text, View } from "react-native";
export const ProfileScreen = ({navigation}) => {
    const {addProfile} = useContext(ProfileContext);

    return (
        <View>
            <TouchableOpacity onPress={() => {addProfile("driver"); navigation.navigate("Home")}}>
                <Text>I am Driver</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {addProfile("passenger"); navigation.navigate("Home")}}>
                <Text>I am Passenger</Text>
            </TouchableOpacity>
        </View>
    )
}