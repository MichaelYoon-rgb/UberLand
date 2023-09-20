import React, { useState, useEffect, useContext } from "react"
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, AppState, Image, Text } from "react-native"

import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from "react-native-maps-directions"
import Constants from 'expo-constants';
import * as Location from 'expo-location';
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
    const {routes, addRoutes, addRoutesDriver, driverRoutes} = useContext(RoutesContext);
    const {familyLocation} = useContext(FamilyContext)
    const {user} = useContext(LoginContext)

    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [coords, setCoords] = useState(null);
    const [threshold, setThreshold] = useState(500);
    const [speedThreshold, setSpeedThreshold] = useState(30);
    const [routeAlert, setRouteAlert] = useState(false);
    const [speedAlert, setSpeedAlert] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);
    const {profile, drivers, updateLocation, removeLocation} = useContext(ProfileContext)

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            removeLocation()
        }
    };
    useEffect(() => {
        setLocationComponent(setLocation);
        const watchPosition = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 1000, distanceInterval: 1 }, 
            (loc) => {
                updateLocation(loc.coords)
                if (coords) {
                    setRouteAlert(isThresholdDistance(coords, loc.coords, threshold))
                    setSpeedAlert(loc.coords.speed > setSpeedThreshold)
            }}
        );
        
        const appstate = AppState.addEventListener('change', handleAppStateChange);
        return () => appstate.remove
    }, [])

    if (!location) return <LoadingComponent/>
    if (routeAlert) return <AlertComponent/>
    if (speedAlert) return <AlertComponent/>
    return (
        <View style={styles.container}>
            <Text style={{zIndex: 100}}>{user.uid}</Text>
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
                        strokeColor={colors.tertiary}
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
                    <View style={{alignItems: "center", width: 30, height: 30, justifyContent: "center"}}>
                    <View style={{backgroundColor: colors.tertiary, width: 30, height: 30, borderRadius: 20, position: "absolute", opacity: 0.6}}></View>
                    <View style={{backgroundColor: colors.secondary, width: 10, height: 10, borderRadius: 20}}></View>
                    </View>
                </Marker>
                {profile.profile == "passenger" ?
                    drivers.map((driver) => (
                        <Marker key={driver.uid} onPress={() => {addRoutesDriver(driver.uid)}} coordinate={driver.location}>
                            <Image style={{width: 30, height: 30, tintColor: colors.secondary}} source={require("../../../../assets/icons/steering-wheel.png")}></Image>
                        </Marker>
                    ))
                : null}
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
            
            {profile.profile == "passenger" ?
                <GooglePlacesAutocomplete
                    styles={{container: {zIndex: 2}, textInputContainer: {padding: 20}, textInput: {fontFamily: "Poppins_400Regular", borderRadius: 10, paddingTop: 7, marginTop: 10, elevation: 10}, listView: {paddingLeft: 20, paddingRight: 20, borderRadius: 20, overflow: "hidden"}, row: {padding: 10, overflow: "hidden"}, poweredContainer: {display: "none"}}}
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
    }
})