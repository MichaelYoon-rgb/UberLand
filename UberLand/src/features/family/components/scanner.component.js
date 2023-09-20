import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner"

export const ScannerComponent = ({onScan}) => {
    const [scanned, setScanned] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    

    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        onScan(data)
    };

    return (
        <View style={{flex: 1}}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{borderRadius: 10, flex: 2}}
            />
        </View>
    )
}