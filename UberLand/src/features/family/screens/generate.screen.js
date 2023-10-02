import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { GenerateComponent } from "../components/generate.component";

export const GenerateScreen = ({navigation}) => {

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity onPress={() => {navigation.navigate("Family")}} style={{position: "absolute", top: 0, left: 0, marginTop: 20, alignItems: "flex-end", padding: 40}}>
                <Image style={{width: 20, height: 20}} source={require("../../../../assets/icons/left-arrow.png")} tintColor="black"></Image>
            </TouchableOpacity>
            <GenerateComponent/>
        </View>
    )
}