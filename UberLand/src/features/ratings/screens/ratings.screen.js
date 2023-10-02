import React, { useContext, useState } from "react"

import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Image } from "react-native"
import { colors } from "../../../../theme"
import { RatingsContext } from "../../../services/ratings/ratings.context"
import { ProfileContext } from "../../../services/profile/profile.context"

import Constants from "expo-constants"

export const RatingScreen = () => {
    const { ratings, addRatings} = useContext(RatingsContext)
    const { profile } = useContext(ProfileContext)
    
    const [ stars, setStars ] = useState(5);
    const [ title, setTitle ] = useState("");
    const [ subtitle, setSubtitle ] = useState("");
    const [ driver, setDriver ] = useState("");
    const [ showHistory, setShowHistory ] = useState(false);
    const [ geocoding, setGeocoding ] = useState({});
    
    const historyItem = (key) => {
        const today = new Date()
        if (!geocoding[key.item]){
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${profile.history[key.item].destination.latitude},${profile.history[key.item].destination.longitude}&key=${Constants.expoConfig.extra.GOOGLE_API_KEY}`)
                .then((response) => (response.json()))
                .then((responseJson) => {
                    if (responseJson) {
                        let temp = {...geocoding}
                        temp[key.item] = responseJson.results[0].formatted_address
                        setGeocoding(temp)
                    }
            })
        }

        return (
            <TouchableOpacity onPress={() => {setDriver(profile.history[key.item].driver); setShowHistory(false)}} style={{justifyContent: "center", padding: 20, borderBottomColor: colors.secondary, borderBottomWidth: 2}}>
                <Text style={{fontFamily: "Poppins_500Medium"}}>{parseInt((profile.history[key.item].date - today.getTime()) / 1000 / 60 / 60 / 24)} Days Ago</Text>
                <Text style={{fontFamily: "Poppins_500Medium"}}>{geocoding[key.item]}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{flex: 1}}>
            <View style={{padding: 20}}>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        style={{color: colors.secondary, fontFamily: "Poppins_500Medium"}} 
                        placeholder="Kind, Friendly and Helpful"
                        onChange={(event) => {setTitle(event.nativeEvent.text)}}
                        placeholderTextColor={"rgba(33, 36, 39, 0.5)"}
                        selectionColor={colors.secondary}
                    />
                </View>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        style={{color: colors.secondary, fontFamily: "Poppins_500Medium"}} 
                        placeholder="Hello Judges. Hope You Like The App "
                        textAlignVertical='top'
                        numberOfLines={10}
                        onChange={(event) => {setSubtitle(event.nativeEvent.text)}}
                        placeholderTextColor={"rgba(33, 36, 39, 0.5)"}
                        selectionColor={colors.secondary}
                        multiline
                    />
                </View>
                <TouchableOpacity onPress={() => {setShowHistory(true)}} style={{backgroundColor: colors.primary, borderRadius: 10, backgroundColor: "white", padding: 20, marginBottom: 20}}>
                    <Text style={{fontFamily: "Poppins_600SemiBold"}}>{driver ? "UID: " + driver : "Select A Driver"}</Text>
                    <Image />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if (driver && title && subtitle) {addRatings(driver, title, subtitle)} else {console.log(driver, title, subtitle)}}} style={{width: "100%", backgroundColor: colors.secondary, padding: 20, borderRadius: 10}}>
                    <Text style={{fontFamily: "Poppins_600SemiBold", color: colors.primary, textAlign: "center"}}>Submit Review</Text>
                </TouchableOpacity>
            </View>
            {showHistory ?
                <View style={{position: "absolute", top: 0, left: 0,  height: "100%", width: "100%", backgroundColor: "rgba(33, 36, 39, 0.5)", flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View style={{width: 300, height: 400, backgroundColor: "white", borderRadius: 20, bottom: 30, padding: 40}}>
                        <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
                            
                            <TouchableOpacity onPress={() => {setShowHistory(false)}}>
                                <Image source={require("../../../../assets/icons/left-arrow.png")} tintColor={colors.secondary} style={{width: 18, height: 18}}/>
                            </TouchableOpacity>
                            <Text style={{fontFamily: "Poppins_600SemiBold"}}>History</Text>
                            <View style={{width: 20, height: 20}}/>
                        </View>
    
                        {profile.history ?
                            <FlatList data={Object.keys(profile.history)} renderItem={historyItem}/>
                        : null}
                        
                    </View>
                </View>
            : null}
        </View>
    )
}

const styles = StyleSheet.create({
    textInputContainer: {
        backgroundColor: colors.primary,
        width: "100%",
        borderRadius: 10,
        marginBottom: 15,
        alignSelf: "center",
        padding: 15,
        backgroundColor: "white"
    }
})