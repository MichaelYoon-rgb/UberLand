import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { GenerateComponent } from "../components/generate.component";

export const GenerateScreen = () => {

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <GenerateComponent/>
        </View>
    )
}