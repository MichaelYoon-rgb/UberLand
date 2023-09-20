import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { LoginContext } from "../../../services/login/login.context";

export const FamilyScreen = ({navigation}) => {
    const { user, initializing, emailAndPasswordSignIn } = useContext(LoginContext);

    return (
        <View style={{flex: 1}}>
            <View style={{width: "100%", justifyContent: "space-between", flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {navigation.navigate("Generator")}} style={{marginTop: 20, alignItems: "flex-end", padding: 40}}>
                <Image style={{width: 20, height: 20}} source={require("../../../../assets/icons/right-arrow-white.png")} tintColor="black"></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate("Scanner")}} style={{marginTop: 20, alignItems: "flex-end", padding: 40}}>
                <Image style={{width: 20, height: 20}} source={require("../../../../assets/icons/right-arrow-white.png")} tintColor="black"></Image>
            </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>

            </View>
            <View style={{alignItems: "center", padding: 50, marginBottom: 150}}>
                <Text style={{fontFamily: "Poppins_700Bold", fontSize: 30, color: "grey"}}>Create A Family</Text>
                <Text style={{textAlign: "center", color: "grey"}}>
                    Real Time Information At Your Fingertips. See Everything. Hear Everything. Be There For Everything.
                    Get Access To Family Members Live Locations and Even Get Alerts Based On Whats Happening
                </Text>
            </View>
        </View>
    )
}