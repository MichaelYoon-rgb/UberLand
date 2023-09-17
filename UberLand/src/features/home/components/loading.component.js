import React from "react"
import { View, Dimensions, TextInput } from "react-native"

import MapView from 'react-native-maps'

import { colors } from "../../../../theme"
import { customMapStyle } from "../data/map.data"

export const LoadingComponent = ({}) => {
    return (
        <View style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: colors.secondary}}>
            <MapView
                showsUserLocation={true}
                customMapStyle={customMapStyle}/>
        </View>
    )
}