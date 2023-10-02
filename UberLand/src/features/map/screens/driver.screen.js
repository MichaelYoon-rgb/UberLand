import React, { useState, useEffect, useContext } from "react"
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, AppState, Image, Text, TouchableOpacity } from "react-native"

import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from "react-native-maps-directions"
import Constants from 'expo-constants';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { colors } from "../../../../theme"
import { customMapStyle } from "../data/map.data"
import { setLocationComponent } from "../components/location.component"
import { LoadingComponent } from "../components/loading.component"
import { AlertComponent } from "../components/alert.component"

import { RoutesContext } from "../../../services/routes/routes.context";
import { ProfileContext } from "../../../services/profile/profile.context";
import { FamilyContext } from "../../../services/family/family.context";
import { LoginContext } from "../../../services/login/login.context";
import { calculateDistance, isThresholdDistance } from "../components/helper.component";
import { watchLocation } from "../components/helper.component";
import { AppStateListener, CustomMapViewDirections, CustomMarker } from "../components/map.component";

export const DriverScreen = ({}) => {
    const {routes, driverRoutes,} = useContext(RoutesContext);
    const {profile, updateLocation, removeLocation} = useContext(ProfileContext)
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeAlert, setRouteAlert] = useState(false);
    const [speedAlert, setSpeedAlert] = useState(false);

    useEffect(() => {
        setLocationComponent(setLocation)
        setLocationComponent(updateLocation);
        watchLocation(updateLocation)
        
        let subscription = AppStateListener(() => {removeLocation(updateLocation)})
        return () => subscription.remove
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
                <CustomMarker coordinate={location}/>
                <CustomMarker coordinate={destination}/>
                
                {driverRoutes ?
                    <>
                        <CustomMapViewDirections
                            origin={driverRoutes.origin}
                            destination={driverRoutes.destination}
                            strokeColor={"#9db0f5"}
                        />
                        <CustomMarker coordinate={driverRoutes.origin} markerColor={styles.blueMarker} />
                        <CustomMarker coordinate={driverRoutes.destination} markerColor={styles.blueMarker}/>
                    </>
                :null}
                
                <Marker coordinate={location}>
                    <View style={styles.markerContainer}>
                    <View style={styles.greenMarker}></View>
                    <View style={{backgroundColor: colors.secondary, width: 10, height: 10, borderRadius: 20}}></View>
                    </View>
                </Marker>
            </MapView>
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
        height: "105%"
    },
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
    blackOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        opacity: 0.5,
        top: 0,
        zIndex: 2
    },
    googlePlacesInput: {
        fontFamily: "Poppins_400Regular",
        borderRadius: 10,
        paddingTop: 7,
        marginTop: 10,
        elevation: 10
    },
    googlePlacesView: {
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        overflow: "hidden"
    },
    googlePlacesAutocomplete: {
        container: {zIndex: 2},
        textInputContainer: {padding: 20},
        textInput: {fontFamily: "Poppins_400Regular", borderRadius: 10, paddingTop: 7, marginTop: 10, elevation: 10},
        listView: {paddingLeft: 20, paddingRight: 20, borderRadius: 20, overflow: "hidden"},
        row: {padding: 10, overflow: "hidden"},
        poweredContainer: {display: "none"}},
    detailsContainer: {
        position: "absolute", bottom: 0, width: "100%",
    },
    details: {
        backgroundColor: colors.secondary, marginBottom: 110, marginLeft:18, marginRight: 18, borderRadius: 15, padding: 20
    }
})