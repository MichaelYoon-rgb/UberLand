import React, { useState, useEffect, useContext } from "react"
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, Image, Text, TouchableOpacity } from "react-native"

import MapView, { Marker } from 'react-native-maps'

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
import { AppStateListener, CustomPlacesAutocomplete } from "../components/map.component";
import { CustomMapViewDirections, CustomMarker } from "../components/map.component";

export const PassengerScreen = ({}) => {
    const { routes, addRoutes, addRoutesDriver, familyRoutes, deleteRoute, addRouteCoords} = useContext(RoutesContext);
    const { profile, drivers, updateLocation, familyProfiles, removeLocation, addPreviousRoutes, getProfileNumberPlate} = useContext(ProfileContext)
    const { familyMembers } = useContext(FamilyContext);
    const { user } = useContext(LoginContext)

    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState([]);
    const [destination, setDestination] = useState(routes.destination);
    const [origin, setOrigin] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [driverUID, setDriverUID] = useState("");
    const [details, setDetails] = useState(false);
    const [routeAlert, setRouteAlert] = useState(false);
    const [speedAlert, setSpeedAlert] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const distanceThreshold = 500
    const speedThreshold = 30
    

    useEffect(() => {
      if (!loaded) {
        setLocationComponent(setLocation)
        setLocationComponent(updateLocation);
        setLoaded(true);
      }
    }, [loaded]);
  
    

    const onPressAutocomplete = (data, details = null) => {
        let lat = details?.geometry?.location.lat;
        let lng = details?.geometry?.location.lng
        setDestination({latitude: lat, longitude: lng})
        setInputFocus(false)
    }



    const onBook = () => {
        if (destination && showDetails) {
            setShowDetails(false);
            addRoutes(
                {latitude: location.latitude, longitude: location.longitude}, 
                {latitude: destination.latitude, longitude: destination.longitude},
                showDetails
            )
            setDriverUID(showDetails)
        }
    }

    const getDriverInformation = async (driverUID) => {
        setShowDetails(driverUID)
        console.log(await getProfileNumberPlate(driverUID))
        setDetails(await getProfileNumberPlate(driverUID))
    }
    
    useEffect(() => {
        watchLocation((loc) => {
            updateLocation(loc)
            if (coords.length) {
                setRouteAlert(isThresholdDistance(coords, loc, distanceThreshold))
                setSpeedAlert(loc.speed > speedThreshold)
            }    
        })

        let subscription = AppStateListener(() => {
            removeLocation(updateLocation)})
        return () => subscription.remove
    }, [])

    if (!location) return <LoadingComponent/>
    if (routeAlert) return <AlertComponent/>
    if (speedAlert) return <AlertComponent/>

    return (
        <View style={styles.container}>
            <MapView
                style={styles.mapView}
                region={location}
                showsMyLocationButton={false}
                showsCompass={false}
                customMapStyle={customMapStyle}>
                
                <CustomMapViewDirections
                    origin={location}
                    destination={destination}
                    strokeColor={colors.tertiary}
                    onReady={(result) => {
                        setCoords(result.coordinates);
                    }}
                />
                <CustomMarker coordinate={location}/>
                <CustomMarker coordinate={destination}/>
                
                {familyMembers.map((familyMember) => (
                    <>
                        <CustomMapViewDirections
                            origin={familyRoutes[familyMember] ? familyRoutes[familyMember].origin : undefined}
                            destination={familyRoutes[familyMember] ? familyRoutes[familyMember].destination : undefined}
                            strokeColor={"#9db0f5"}
                            />
                        <CustomMarker 
                            coordinate={familyProfiles[familyMember] ? familyProfiles[familyMember].location : undefined}
                            markerColor={styles.blueMarker}/>
                    </>
                ))}
                
                {drivers.map((driver) => (
                    <Marker key={driver.uid} onPress={() => {getDriverInformation(driver.uid); setOrigin(location)}} coordinate={driver.location}>
                        <Image style={{width: 30, height: 30, tintColor: colors.secondary}} source={require("../../../../assets/icons/steering-wheel.png")}></Image>
                    </Marker>
                ))}
            </MapView>
            
            {showDetails != false && details ? 
                <View style={styles.detailsContainer}>
                    <View style={styles.details}>
                        <TouchableOpacity  style={{position: "absolute", right: 20, top: 20}}>
                            <TouchableOpacity style={{ width: 20, height: 20}} onPress={() => {setShowDetails(false); console.log("heu")}}>
                                <Image source={require("../../../../assets/icons/plus.png")} tintColor={colors.primary} style={{width: "100%", height: "100%", opacity: 0.7, transform: [{rotate: "45deg"}]}}></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Text style={styles.detailsText}>Number Plate: {details.registrationNumber}</Text>
                        <Text style={styles.detailsText}>Make: {details.make}</Text>
                        <Text style={styles.detailsText}>Model: {details.model}</Text>
                        <Text style={styles.detailsText}>Colour: {details.colour}</Text>
                        <Text style={styles.detailsText}>Fuel Type: {details.fuelType}</Text>
                        <Text style={styles.detailsText}>Vehicle Age: {details.vehicleAge}</Text>
                        <Text style={styles.detailsText}>Year Of Manufacture: {details.yearOfManufacture}</Text>
                        <Text style={styles.detailsText}>MOT Status: {details.mot.motStatus}</Text>
                        <TouchableOpacity onPress={onBook}>
                            <Text style={styles.detailsTextBook}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            : null}

            {routes.active ? 
                <View>
                    <TouchableOpacity onPress={() => {deleteRoute(); addPreviousRoutes(driverUID, destination, origin, location); setDestination()}}>
                        <Text>End Ride</Text>
                    </TouchableOpacity>
                </View>
            : null}
            
            <CustomPlacesAutocomplete 
                onPress={onPressAutocomplete}
                onUnFocus={() => setInputFocus(false)}
                onFocus={() => setInputFocus(true)}
                inputFocus={inputFocus}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    detailsTextBook: {
        color: colors.primary,
        fontFamily: "Poppins_600SemiBold",
        opacity: 0.8,
        margin: -2,
    },
    detailsText: {
        color: colors.primary,
        opacity: 0.7,
        fontFamily: "Poppins_500Medium",
        margin: -2,
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
        poweredContainer: {display: "none"}
    },
    detailsContainer: {
        position: "absolute", bottom: 0, width: "100%",
    },
    details: {
        backgroundColor: colors.secondary, marginBottom: 110, marginLeft:18, marginRight: 18, borderRadius: 15, padding: 20
    }
})