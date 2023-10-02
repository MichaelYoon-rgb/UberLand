import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export const setLocationComponent = async (setLocation) => {
    await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({});
    setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01});
}

export const getLocationComponent = async (setLocation) => {
    await Location.requestForegroundPermissionsAsync();
    let location = await Location.getCurrentPositionAsync({});
    return ({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01});
}
