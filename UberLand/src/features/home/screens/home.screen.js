import React from "react"
import {Text, View} from "react-native"
import { colors } from "../../../../theme"
import MapView from 'react-native-maps'

export const HomeScreen = ({}) => {
    return (
        <View style={{flex: 1, backgroundColor: colors.secondary}}>
            <MapView style={{flex: 1}} 
                region={{latitude: 42.882004, longitude: 74.582748, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                showsUserLocation={true}
            />
            <Text>Tesstt</Text>
        </View>
    )
}