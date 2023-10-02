import React from 'react'
import { Marker } from 'react-native-maps'
import { StyleSheet, AppState, View, TouchableWithoutFeedback } from 'react-native'
import { colors } from '../../../../theme'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Constants from 'expo-constants';
import MapViewDirections from "react-native-maps-directions"

export const CustomMarker = ({coordinate, markerColor}) => {
    if (!coordinate) return;
    return (
        <Marker coordinate={coordinate}>
            <View style={styles.markerContainer}>
            <View style={markerColor ? markerColor : styles.greenMarker}></View>
            <View style={styles.blackMarker}></View>
            </View>
        </Marker>
    )
}

export const CustomMapViewDirections = ({origin, destination, strokeColor, onReady}) => (
    <MapViewDirections
        origin={origin}
        destination={destination}
        strokeWidth={4}
        strokeColor={strokeColor}
        onReady={onReady}
        apikey={Constants.expoConfig.extra.GOOGLE_API_KEY}
    />
)

export const CustomPlacesAutocomplete = ({onPress, inputFocus, onFocus, onUnFocus}) => (
    <>
        {inputFocus ?
            <TouchableWithoutFeedback onPress={onUnFocus}>
                <View style={styles.blackOverlay}/>
            </TouchableWithoutFeedback>
        : null}


        <GooglePlacesAutocomplete
            styles={styles.googlePlacesAutocomplete}
            fetchDetails={true}
            placeholder='Search'
            onPress={onPress}
            query={{
                key: Constants.expoConfig.extra.GOOGLE_API_KEY,
                language: 'en',
            }}
            textInputProps={{
                onFocus: onFocus
            }}
        />
    </>
)


const handleAppStateChange = (nextAppState, onChange) => {
    if (nextAppState === 'background') {
        onChange()
}};

export const AppStateListener = (onChange) => {
    const appstate = AppState.addEventListener('change', (nextAppState) => handleAppStateChange(nextAppState, onChange));
    return appstate
}


const styles = StyleSheet.create({
    markerContainer: {
        alignItems: "center",
        width: 30,
        height: 30,
        justifyContent: "center"
    },
    greenMarker: {
        backgroundColor: colors.tertiary,
        width: 30,
        height: 30,
        borderRadius: 20,
        position: "absolute",
        opacity: 0.6
    },
    blueMarker: {
        backgroundColor: "#4b6ad6",
        width: 30,
        height: 30,
        borderRadius: 20,
        position: "absolute",
        opacity: 0.6
    },
    blackMarker: {
        backgroundColor: colors.secondary,
        width: 10,
        height: 10,
        borderRadius: 20
    },
    googlePlacesAutocomplete: {
        container: {zIndex: 2},
        textInputContainer: {padding: 20},
        textInput: {fontFamily: "Poppins_400Regular", borderRadius: 10, paddingTop: 7, marginTop: 10, elevation: 10},
        listView: {paddingLeft: 20, paddingRight: 20, borderRadius: 20, overflow: "hidden"},
        row: {padding: 10, overflow: "hidden"},
        poweredContainer: {display: "none"}
    },
    blackOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        opacity: 0.5,
        top: 0,
        zIndex: 2
    },
})