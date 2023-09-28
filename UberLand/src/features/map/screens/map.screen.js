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

export const HomeScreen = ({}) => {
    const {routes, addRoutes, addRoutesDriver, driverRoutes} = useContext(RoutesContext);
    const {profile, drivers, updateLocation, removeLocation} = useContext(ProfileContext)
    const {familyLocation} = useContext(FamilyContext)
    const {user} = useContext(LoginContext)

    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [coords, setCoords] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [routeAlert, setRouteAlert] = useState(false);
    const [speedAlert, setSpeedAlert] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            removeLocation(updateLocation)
    }};
    
    useEffect(() => {
        setLocationComponent(setLocation);
        setLocationComponent(updateLocation);
        watchLocation(updateLocation)
        
        const appstate = AppState.addEventListener('change', handleAppStateChange);
        return () => appstate.remove
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
                
                {profile.profile == "driver" && driverRoutes ?
                    <MapViewDirections
                        origin={driverRoutes.origin}
                        destination={driverRoutes.destination}
                        strokeWidth={4}
                        strokeColor={"#9db0f5"}
                        onReady={result => {
                            setCoords(result.coordinates)
                        }}
                        apikey={Constants.expoConfig.extra.GOOGLE_API_KEY}
                    />
                :
                <MapViewDirections
                    origin={location}
                    destination={destination}
                    strokeWidth={4}
                    strokeColor={colors.tertiary}
                    onReady={result => {
                        setCoords(result.coordinates)
                    }}
                    apikey={Constants.expoConfig.extra.GOOGLE_API_KEY}
                />}
                {familyLocation[0] != undefined ?
                    familyLocation.map((location) => (
                        <MapViewDirections
                            origin={location.origin}
                            destination={location.destination}
                            strokeWidth={4}
                            strokeColor={"rgba(33, 36, 39, 0.4)"}
                            apikey={Constants.expoConfig.extra.GOOGLE_API_KEY}
                        />
                    ))
                : null}
                <Marker coordinate={location}>
                    <View style={styles.markerContainer}>
                    <View style={styles.greenMarker}></View>
                    <View style={{backgroundColor: colors.secondary, width: 10, height: 10, borderRadius: 20}}></View>
                    </View>
                </Marker>
                {profile.profile == "passenger" ?
                    drivers.map((driver) => (
                        <Marker key={driver.uid} onPress={() => {setShowDetails(driver.uid)}} coordinate={driver.location}>
                            <Image style={{width: 30, height: 30, tintColor: colors.secondary}} source={require("../../../../assets/icons/steering-wheel.png")}></Image>
                        </Marker>
                    ))
                : null}
                {destination ?
                    <Marker coordinate={destination}>
                        <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                        <View style={styles.greenMarker}></View>
                        <View style={styles.blackMarker}></View>
                        </View>
                    </Marker> 
                : null}

                {profile.profile == "driver" && driverRoutes ?
                    <>
                        <Marker coordinate={driverRoutes.origin}>
                            <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                            <View style={styles.blueMarker}></View>
                            <View style={styles.blackMarker}></View>
                            </View>
                        </Marker> 
                        <Marker coordinate={driverRoutes.destination}>
                            <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                            <View style={styles.blueMarker}></View>
                            <View style={styles.blackMarker}></View>
                            </View>
                        </Marker> 
                    </>
                : null}
                
            </MapView>
            {inputFocus ?
                    <TouchableWithoutFeedback onPress={() => setInputFocus(false)}>
                        <View style={styles.blackOverlay}/>
                    </TouchableWithoutFeedback>
                : null
            }
            
            {profile.profile == "passenger" && showDetails != false ? 
                <View style={styles.detailsContainer}>
                    <View style={styles.details}>
                        <Text>Information</Text>
                        <Text>Number Plate</Text>
                        <Text>Name</Text>
                        <TouchableOpacity onPress={() => {setShowDetails(false)}}><Text>Close</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => {if (destination && showDetails) {addRoutesDriver(showDetails); setShowDetails(false)}}}><Text>Book</Text></TouchableOpacity>
                    </View>
                </View>
            : null}
            
            {profile.profile == "passenger" ?
                <GooglePlacesAutocomplete
                    styles={{
                        container: {zIndex: 2},
                        textInputContainer: {padding: 20},
                        textInput: styles.googlePlacesInput,
                        listView: styles.googlePlacesView,
                        row: {padding: 10, overflow: "hidden"},
                        poweredContainer: {display: "none"}}}
                    fetchDetails={true}
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        let lat = details?.geometry?.location.lat;
                        let lng = details?.geometry?.location.lng
                        setDestination({latitude: lat, longitude: lng})
                        addRoutes(
                            {latitude: location.latitude, longitude: location.longitude}, 
                            {latitude: lat, longitude: lng})
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
            : null }
            
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