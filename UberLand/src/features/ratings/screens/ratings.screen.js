import React, { useContext } from "react"

import { View, TextInput, TouchableOpacity, Text } from "react-native"
import { colors } from "../../../../theme"
import { RatingsContext } from "../../../services/ratings/ratings.context"

export const RatingScreen = () => {
    const { ratings, addRatings} = useContext(RatingsContext)

    return (
        <View style={{}}>
            <View style={{backgroundColor: colors.secondary, width: "80%", borderRadius: 20, alignSelf: "center", padding: 20}}>
                <TextInput 
                    style={{color: colors.primary, fontFamily: "Poppins_500Medium"}} 
                    placeholder="Write a Review About a Previous Drive" />
                <TouchableOpacity onPress={() => {addRatings()}}><Text>Submit Writing</Text></TouchableOpacity>
                <TouchableOpacity><Text>See Previous Writings</Text></TouchableOpacity>
            </View>
        </View>
    )
}