import React, { useContext } from "react"
import { ProfileContext } from "../../../services/profile/profile.context"
import { TouchableOpacity, Text, View , Image} from "react-native";
import { colors } from "../../../../theme";
export const ProfileScreen = ({navigation}) => {
    const {addProfile} = useContext(ProfileContext);

    return (
        <View style={{flex: 1, width: "100%", height: "100%", padding: 30}}>
            <TouchableOpacity style={{flex: 1, elevation: 10, padding: 40, marginBottom: 30, borderRadius: 20, backgroundColor: colors.primary, overflow: "hidden"}} onPress={() => {addProfile("passenger"); navigation.navigate("Home")}}>
                <Text style={{fontFamily: "Poppins_600SemiBold", fontSize: 25}}>Passenger</Text>
                <Image source={require("../../../../assets/icons/user.png")} style={{width: 200, height: 200, position: "absolute", right: -0, bottom: -0}} tintColor={"black"} />
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1, elevation: 10, padding: 40, borderRadius: 20, backgroundColor: colors.secondary, overflow: "hidden"}} onPress={() => {addProfile("driver"); navigation.navigate("Security")}}>
                <Text style={{fontFamily: "Poppins_600SemiBold", color: "white", opacity: 0.9, fontSize: 25}}>Driver</Text>
                <Image source={require("../../../../assets/icons/car-3.png")} style={{width: 300, height: 300, position: "absolute", right: -60, bottom: -70}} tintColor={"white"} />
            </TouchableOpacity>
        </View>
    )
}