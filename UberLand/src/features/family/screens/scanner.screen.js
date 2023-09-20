import React, { useState, useEffect, useContext } from "react";
import { View, Text, Dimensions } from "react-native";
import { ScannerComponent } from "../components/scanner.component";
import { FamilyContext } from "../../../services/family/family.context";

export const ScannerScreen = () => {
    const {addFamily} = useContext(FamilyContext)
    
    const onScan = (uid) => {
        addFamily(uid)
    }

    return (
        <View style={{flex: 1}}>
            <ScannerComponent onScan={onScan}/>
        </View>
    )
}