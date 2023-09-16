import React from "react"
import {Dimensions, View} from "react-native"

import MapView from 'react-native-maps'

import { colors } from "../../../../theme"
import { customMapStyle } from "../data/map.data"

export const HomeScreen = ({}) => {
    return (
        <View style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: colors.secondary}}>
            <MapView style={{flex: 1, position: "absolute", width: "100%", height: "100%"}} 
                region={{latitude: 42.882004, longitude: 74.582748, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                showsUserLocation={true}
                customMapStyle={customMapStyle}
            />
        </View>
    )
}