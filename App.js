import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import useAuth from "./hook/useAuth";
import { LockScreen, LoginScreen, SignUpScreen } from "./screens";
import BottomNav from "./components/bottomNav";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "./utility/theme";
import { useColorScheme } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const { user } = useAuth();

  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Group>
              <Stack.Screen name="Home" component={BottomNav} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="LockScreen" component={LockScreen} />
              <Stack.Screen name="Sign in" component={LoginScreen} />
              <Stack.Screen name="Sign up" component={SignUpScreen} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
