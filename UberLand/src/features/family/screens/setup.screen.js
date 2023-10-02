import React, { useContext, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

import { FamilyContext } from "../../../services/family/family.context";
import { ProfileContext } from "../../../services/profile/profile.context";
import { colors } from "../../../../theme";
import { FamilyScreen } from "./family.screen";

export const SetupScreen = ({navigation}) => {
    const { family, setupFamily } = useContext(FamilyContext)

    if (family) {
        navigation.navigate("Family");
        return;
    }
    return (
        <View style={{flex: 1}}>
            <View style={{width: "100%", justifyContent: "space-between", flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {setupFamily(); navigation.navigate("Family")}} style={{marginTop: 20, alignItems: "flex-end", padding: 40}}>
                <Image style={{width: 30, height: 30}} source={require("../../../../assets/icons/plus.png")} tintColor="black"></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate("Scanner")}} style={{marginTop: 20, alignItems: "flex-end", padding: 40}}>
                <Image style={{width: 30, height: 30}} source={require("../../../../assets/icons/qrcode.png")} tintColor="black"></Image>
            </TouchableOpacity>
            </View>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", right: 10}}>
                <Image source={require("../../../../assets/stickers/thinking-3.png")} style={{width: 300, flex: 1}} resizeMode="contain"></Image>
            </View>
            <View style={{alignItems: "center", padding: 50, marginBottom: 150}}>
                <Text style={{fontFamily: "Poppins_700Bold", fontSize: 30, color: colors.secondary, opacity: 0.9}}>Family First.</Text>
                <Text style={{textAlign: "center", color: colors.secondary, opacity: 0.8, fontFamily: "Poppins_600SemiBold", fontSize: 12}}>
                    Why trade sleep and family? 
                    Track your family in real time and get notifications like you are there with them
                </Text>
            </View>
        </View>
    )
}