import React, { useContext, } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";

import { LoginContext } from "../../../services/login/login.context";
import { FamilyContext } from "../../../services/family/family.context";
import { colors, familyColors } from "../../../../theme";
import { RoutesContext } from "../../../services/routes/routes.context";
import { calculateDistancePercentage } from "../../map/components/helper.component";
import { ProfileContext } from "../../../services/profile/profile.context";

export const FamilyScreen = ({navigation}) => {
    const { user } = useContext(LoginContext);
    const { familyMembers, removeFamilyProfile} = useContext(FamilyContext);
    const { removeFamily } = useContext(ProfileContext)

    const renderItemProfile = ({item}) => (
        <View style={styles.imageProfileContainer}>
            <Image 
                source={require("../../../../assets/icons/user.png")}
                tintColor={colors.secondary}
                style={{width: 25, height: 25, opacity: 0.8}}/>
            <View style={{position: "absolute", top: 0, right: 0, width: 15, height: 15, backgroundColor: familyColors.blue, borderRadius: 100}}></View>
        </View>
    )

    const renderFeatures = ({item, index}) => (
        <TouchableOpacity onPress={() => {item.onPress(navigation)}} style={{flex: 1, height: 200, width: 215, padding: 20, marginRight: 15, borderRadius: 20, backgroundColor: index ? "rgba(33, 36, 39, 0.1)" : "rgba(33, 36, 39, 1)", overflow: "hidden"}}>
            <Text style={{fontFamily: "Poppins_300Light", opacity: 0.9, color: index ? colors.secondary : "white", fontSize: 17}}>{item.name}</Text>
            {/* <Text style={{fontFamily: "Poppins_300Light", opacity: 0.9, color: index ? colors.secondary : "white", fontSize: 10, bottom: 5}}>{item.subtitle}</Text> */}
            <Image source={item.image} style={{width: 150, height: 150, position: "absolute", bottom: -50, right: -50, transform: [{ rotate: '50deg'}]}} tintColor={index ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)"}></Image>
        </TouchableOpacity>
    )

    const features = [
        {
            name: "Enable Notification",
            subtitle: "Get Alerts, Be Alert",
            image: require("../../../../assets/icons/alert.png"),
            onPress: () => {}
        }, {
            name: "Family Settings",
            subtitle: "Its Your Family",
            image: require("../../../../assets/icons/gear.png"),
            onPress: () => {}
        }, {
            name: "Add Member",
            subtitle: "New Baby?",
            image: require("../../../../assets/icons/circle-xmark.png"),
            onPress: (navigation) => {navigation.navigate("Generator")}
        }, {
            name:  "Leave Family",
            subtitle: "",
            image: require("../../../../assets/icons/circle-xmark.png"),
            onPress: () => {removeFamily(); removeFamilyProfile(); navigation.navigate("Setup")}
    },
    {
        name:  "Call The Police",
        subtitle: "",
        image: require("../../../../assets/icons/phone.png"),
        police: true,
        onPress: () => {}
}]

    return (
        <View style={{flex: 1}}>
            <View style={styles.bannerContainer}>
                <View style={{padding: 50, opacity: 0.9}}>
                    <Text style={styles.title}>Relax...</Text>
                    <Text style={styles.subtitle}>
                        Don't stress about it{"\n"}
                        We have got it covered
                    </Text>
                </View>
                <View style={styles.bannerImageContainer}>
                    <Image source={require("../../../../assets/stickers/thinking.png")} style={styles.bannerImage}/>
                </View>
            </View>
            <View style={{padding: 10, paddingTop: 5, paddingRight: 0}}>
                <FlatList
                    horizontal
                    data={features}
                    renderItem={renderFeatures}
                    keyExtractor={item => item.name}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            
            <View style={{padding: 20, paddingRight: 0}}>
                <Text style={{fontFamily: "Poppins_600SemiBold", marginBottom: 3}}>Your People</Text>
                <FlatList
                    horizontal
                    data={familyMembers}
                    renderItem={renderItemProfile}
                    keyExtractor={item => item}
                    style={{marginBottom: 30}}
                />                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: 100,
        backgroundColor: colors.secondary,
        padding: 12,
        marginLeft: 2,
        marginRight: 10,
    },
    imageProfileContainer: {
        width: 55, 
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        backgroundColor: "rgba(33, 36, 39, 0.1)",
        marginRight: 15
    },
    peopleContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(33, 36, 39, 0.1)",
        borderRadius: 10,
        padding: 13
    },
    widgetContainer: {
        width: "100%",
        height: 300,
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 30
    },
    leftWidget: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: "white",
    },
    leftWidgetImage: {
        width: "100%",
        height: 300,
        resizeMode: "contain"
    },
    callContainer: {
        backgroundColor: colors.secondary,
        flex: 1,
        marginBottom: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    bannerContainer: {
        height: 250,
        backgroundColor: colors.secondary,
        margin: 9,
        borderRadius: 20,
        overflow: "hidden"
    },
    title: {
        fontFamily: "Poppins_300Light",
        color: "rgb(233,225,216)",
        fontSize: 30
    },
    bannerImageContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    subtitle: {
        fontFamily: "Poppins_400Regular",
        color: "rgb(233,225,216)",
        opacity: 0.8,
        bottom: 5,
    },
    bannerImage: {
        width: 200,
        height: 200,
        left: 30,
        top: 30
    }
})