import { Ionicons } from '@expo/vector-icons';
import { colors } from './theme';
import { Image, View } from 'react-native';
import SvgUri from 'react-native-svg-uri';
const svgIcons = {
  "Map": require('./assets/icons/house-blank.png'),
  "Family": require('./assets/icons/user.png'),
  "Security": require('./assets/icons/shield.png'),
  "Ratings": require('./assets/icons/star-5.png'),
  "Settings": require('./assets/icons/settings.png'),
}
export const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    return (
      <View style={{padding: 13, backgroundColor: focused ? "rgba(96,208,134, 0.2)" : "", borderRadius: 10}}>
        <Image
          style={{width: size, height: size}}
          tintColor={color}
          height={size}
          source={svgIcons[route.name]}
        />
        </View>
    )
  },
  tabBarActiveTintColor: "rgba(96,208,134, 0.7)",
  tabBarInactiveTintColor: "rgba(255,255,255,0.2)",
})

export const option = {
    headerShown: false,
    tabBarVisible: false,
    tabBarLabelStyle: { display: 'none'},
    tabBarStyle: {backgroundColor: colors.secondary, position: "absolute", borderTopWidth: 0,height: 80, marginRight: 18, marginLeft: 18, marginBottom: 18, borderRadius: 20},
}