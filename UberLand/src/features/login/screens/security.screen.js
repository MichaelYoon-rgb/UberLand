import React, { useContext, useState } from "react"
import { FlatList, StyleSheet, View, TextInput, Text } from "react-native"
import { colors } from "../../../../theme"
import { ProfileContext } from "../../../services/profile/profile.context"
const NumberPlateView = ({numberPlate}) => {
    let numberPlateArray = []
    for (let i = 0; i < numberPlate.length; i++) {
        numberPlateArray.push(
            <View key={i} style={{borderColor: colors.secondary, borderBottomWidth: 3, width: 25, alignItems: "center"}}>
                <Text style={{fontFamily: "Poppins_600SemiBold", fontSize: 40}}>{numberPlate[i]}</Text>
            </View>
        );
    }
    for (let i = 0; i < 7-numberPlate.length; i++) {
        numberPlateArray.push(
            <View key={7+i} style={{borderColor: colors.secondary, borderBottomWidth: 3, width: 25}} />
        );
    }

    return numberPlateArray
}
export const SecurityScreen = ({navigation}) => {
    const {addProfileNumberPlate} = useContext(ProfileContext)
    const [numberPlate, setNumberPlate] = useState("")

    return (
        <View style={{padding: 30, flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.secondary}}>
            <Text style={{color: colors.primary, fontFamily: "Poppins_600SemiBold", fontSize: 20, marginBottom: 10}}>Number Plate</Text>

            <View style={styles.numberPlateContainer}>
                <View style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", flex: 1}}>
                    <TextInput style={{opacity: 0}}
                        onChange={(event) => {setNumberPlate(event.nativeEvent.text)}}
                        maxLength={7}
                        onSubmitEditing={(event) => {addProfileNumberPlate(event.nativeEvent.text); navigation.navigate("Home")}}/>
                </View>
                <NumberPlateView numberPlate={numberPlate}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    numberPlateContainer: {
        flexDirection: "row",
        width: 35*7 + 20*2,
        borderWidth: 3,
        borderRadius: 20,
        backgroundColor: colors.primary,
        padding: 20,
        height: 100,
        justifyContent: "space-between"
    }
})