import { Tabs } from "expo-router"
import { Platform } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="ia/chronos"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size}) => {
          let iconName;
          if (route.name === 'dia') {
            iconName = focused ? 'calendar': 'calendar-o';
          }
          else if( route.name === 'user/user'){
            iconName = focused ? 'user': 'user-o';
          }
          else if( route.name === 'ia/chronos'){
            return <Image 
              source={require('./../../assets/icon.png')}
              style={{height: '10%', width: 'auto'}}
              />;
          }
          return <Icon name={iconName} size={21} color={'white'} />;
        },
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#AB3D52',
          borderTopLeftRadius: 10,
          borderTopRightRadius:10,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          shadowOffset: {
            width: 10,
            height: 10
          },
          shadowRadius: 8,
          shadowOpacity: 0.9,
          elevation: 3,
          ...Platform.select({
            ios: {
              height: "11%",
            },
            android: {
              height: "9%"
            }
          })
        },
        tabBarLabelStyle: {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 14,
          marginBottom: 8,
        },
        tabBarActiveBackgroundColor: "#912337"
      })}
    >
      <Tabs.Screen 
        name="ia/chronos" 
        options={{
          href: '/calendar/ia/chronos',
          tabBarLabel: 'Chronos',
        }}
      />
      <Tabs.Screen 
        name="dia" 
        options={{
          href: '/calendar/dia',
          tabBarLabel: 'Calendar',
        }}
      />
      <Tabs.Screen 
        name="user/user" 
        options={{
          href: '/calendar/user/user',
          tabBarLabel: 'Profile',
        }}
      />
      <Tabs.Screen
        name="semana"
        options={{
          href: null
        }}
      />
        <Tabs.Screen
            name="mes"
            options={{
                href: null
            }}
        />
    </Tabs>

  )
}
