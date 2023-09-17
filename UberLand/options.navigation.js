import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme';
import { View } from 'react-native';

export const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = 'home';
    }

    return (
      <View style={{padding: 10}}><Ionicons name={iconName} size={size} color={color}/></View>
    )
  },
  tabBarActiveTintColor: "rgba(255,255,255,0.5)",
  tabBarInactiveTintColor: "red",
})

export const option = {
    headerShown: false,
    tabBarVisible: false,
    tabBarLabelStyle: { display: 'none'},
    tabBarStyle: {backgroundColor: colors.secondary, position: "absolute", borderTopWidth: 0, height: 57, marginRight: 30, marginLeft: 30, marginBottom: 30, borderRadius: 10},
}