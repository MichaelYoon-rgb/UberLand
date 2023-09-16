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
      <View style={{margin: 10}}><Ionicons name={iconName} size={size} color={color}/></View>
    )
  },
  tabBarActiveTintColor: colors.secondary,
  tabBarInactiveTintColor: "red",
})

export const option = {
    headerShown: false,
    tabBarLabelStyle: { display: 'none'},
    tabBarStyle: {backgroundColor: colors.primary, borderTopWidth: 0, height: 57, margin: 15, borderRadius: 10},
}