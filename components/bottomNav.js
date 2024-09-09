import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  SettingScreen,
  HomeScreen,
  PtimerScreen,
  CalendarScreen,
  EditAccountScreen,
  UpdatePasswordScreen,
  FeedbackScreen,
} from "../screens";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="settingScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="settingScreen" component={SettingScreen} />
      
      <Stack.Screen name="editAccountScreen" component={EditAccountScreen} />
      
      <Stack.Screen
        name="updatePasswordScreen"
        component={UpdatePasswordScreen}
      />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />

    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="HomeDefault">
      <Tab.Screen
        name="HomeDefault"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? "sticker-check" : "sticker-check-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="timerScreen"
        component={PtimerScreen}
        options={{
          tabBarLabel: "Pomodoro Timer",
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? "timer" : "timer-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="calendarScreen"
        component={CalendarScreen}
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? "calendar-check" : "calendar-check-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="settingStack"
        component={SettingsStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name={focused ? "account-cog" : "account-cog-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;