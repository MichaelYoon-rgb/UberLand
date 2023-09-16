import { Ionicons } from '@expo/vector-icons';
import { Lock } from '@styled-icons/material'
import { colors } from './theme';

export const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;
    if (route.name === 'Home') {
      iconName = 'home';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: colors.secondary,
  tabBarInactiveTintColor: "red",
})

export const option = {
    headerShown: false,
    tabBarLabelStyle: { display: 'none'},
    tabBarStyle: {backgroundColor: colors.primary, borderTopWidth: 0}}