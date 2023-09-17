import React, { useState, useEffect } from "react"
import { Dimensions, View, StyleSheet, Text, TextInput, TouchableWithoutFeedback, TouchableWithoutFeedbackBase } from "react-native"

import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from "react-native-maps-directions"

import { colors } from "../../../../theme"
import { Ionicons } from '@expo/vector-icons';
import { customMapStyle } from "../data/map.data"
import { setLocationComponent } from "../components/location.component"
import { LoadingComponent } from "../components/loading.component"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Input } from 'react-native-elements';
import * as Location from 'expo-location';
import { AlertComponent } from "../components/alert.component"
import Constants from 'expo-constants';

const calculateDistance = (coord1, coord2) => {
    lat1 = coord1.latitude
    lon1 = coord1.longitude

    lat2 = coord2.latitude
    lon2 = coord2.longitude

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

const isThresholdDistance = (coords, location, threshold) => {
    let closest = Infinity;
    coords.forEach(coord => {
        let distance = calculateDistance(coord, location)
        if (distance < closest){
            closest = distance
        }
    });
    return closest > threshold
}

export const HomeScreen = ({}) => {
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [coords, setCoords] = useState(null);
    const [threshold, setThreshold] = useState(500);
    const [speedThreshold, setSpeedThreshold] = useState(30);
    const [routeAlert, setRouteAlert] = useState(false);
    const [speedAlert, setSpeedAlert] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    useEffect(() => {
        setLocationComponent(setLocation);
        Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 1000, distanceInterval: 1 }, 
            (loc) => {if (coords) {
                setRouteAlert(isThresholdDistance(coords, loc.coords, threshold))
                setSpeedAlert(loc.coords.speed > setSpeedThreshold)
            }});
    }, [])

    if (!location) return <LoadingComponent/>
    if (routeAlert) return <AlertComponent/>
    if (speedAlert) return <AlertComponent/>
    return (
        <View style={styles.container}>
            <MapView style={styles.mapView}
                region={location}
                showsMyLocationButton={false}
                showsCompass={false}
                customMapStyle={customMapStyle}>
                <MapViewDirections
                    origin={location}
                    destination={destination}
                    strokeWidth={4}
                    strokeColor={colors.tertiary}
                    onReady={result => {
                        setCoords(result.coordinates)
                    }}
                    apikey={Constants.expoConfig.extra.GOOGLE_API_KEY}
                />
                <Marker coordinate={location}>
                    <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                    <View style={{backgroundColor: colors.tertiary, width: 30, height: 30, borderRadius: 20, position: "absolute", opacity: 0.6}}></View>
                    <View style={{backgroundColor: colors.secondary, width: 10, height: 10, borderRadius: 20}}></View>
                    </View>
                </Marker>
                {destination ?
                    <Marker coordinate={destination}>
                    <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                    <View style={{backgroundColor: colors.tertiary, width: 30, height: 30, borderRadius: 20, position: "absolute", opacity: 0.6}}></View>
                    <View style={{backgroundColor: colors.secondary, width: 10, height: 10, borderRadius: 20}}></View>
                    </View>
                </Marker> : 
                null
                }
                
            </MapView>
            {inputFocus ?
                    <TouchableWithoutFeedback onPress={() => setInputFocus(false)}>
                        <View style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "black", opacity: 0.5, top: 0,zIndex: 2}}/>
                    </TouchableWithoutFeedback>
                : null
            }
            
            <GooglePlacesAutocomplete
                styles={{container: {zIndex: 2}, textInputContainer: {padding: 20}, textInput: {fontFamily: "Poppins_400Regular", borderRadius: 10, paddingTop: 7, marginTop: 10, elevation: 10}, listView: {paddingLeft: 20, paddingRight: 20, borderRadius: 20, overflow: "hidden"}, row: {padding: 10, overflow: "hidden"}, poweredContainer: {display: "none"}}}
                fetchDetails={true}
                placeholder='Search'
                onPress={(data, details = null) => {
                    setDestination({latitude: details?.geometry?.location.lat, longitude: details?.geometry?.location.lng})
                    setInputFocus(false)
                }}
                query={{
                    key: Constants.expoConfig.extra.GOOGLE_API_KEY,
                    language: 'en',
                }}
                textInputProps={{
                    onFocus: () => setInputFocus(true),
                }}
                />
            </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    mapView: {
        flex: 1,
        position: "absolute",
        width: "100%",
        height: "100%"
    }
})