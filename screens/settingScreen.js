import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  Appearance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Icon,
  IconButton,
  Divider,
  Switch,
  TextInput,
  Button,
  useTheme,
} from "react-native-paper";
import {
  SetNewProfilePic,
  loadUserProfilePic,
} from "../utility/ProfilePicActions";
import auth from "@react-native-firebase/auth";
import useAuth from "../hook/useAuth";
import { useQuote } from "../utility/quoteAction";
import { useColorScheme } from "react-native";

const SettingScreen = ({ navigation }) => {
  const { user, loading, logoutUser } = useAuth(); 
  const { quote, updateQuote } = useQuote();
  const [currentPicture, setCurrentPicture] = useState(null);
  const [username, setNewusername] = useState("");
  const [currQuote, setQuote] = useState("");
  const [switchStatus, setSwitch] = useState(colorScheme === "light");

  useEffect(() => {
    const unsubscribe = auth().onUserChanged((updatedUser) => {
      if (updatedUser) {
        setNewusername(updatedUser.displayName, "");
      } else {
        setNewusername(username);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !user || !user.uid) return;

    const loadProfilePic = async () => {
      try {
        const { profilePicURL, error } = await loadUserProfilePic(user.uid);
        if (error) {
          console.error("Error loading profile picture:", error);
          Alert.alert("Error", "Failed to load profile picture.");
          return;
        }
        setCurrentPicture(profilePicURL);
      } catch (error) {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };
    loadProfilePic();
  }, [user, loading]);

  useEffect(() => {
    setQuote(quote);
  }, [quote]);

  const updateProfilePic = async () => {
    try {
      const newImageURL = await SetNewProfilePic(user.uid);
      if (!newImageURL) {
        Alert.alert(
          "No image selected",
          "Please select an image to update your profile picture."
        );
        return;
      }
      console.log("Image selected:", newImageURL);
      setCurrentPicture(newImageURL);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  const toggleTheme = () => {
    setSwitch(!switchStatus);
    Appearance.setColorScheme(!switchStatus ? "dark" : "light");
  };

  const handleUpdateQuote = () => {
    updateQuote(currQuote);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.onSecondary }]}>
      <SafeAreaView
        style={[
          styles.roundedSquare,
          { backgroundColor: colors.primaryContainer },
        ]}
      >
        <Text style={styles.welcomeText}>Settings</Text>
      </SafeAreaView>

      <View style={[styles.rectangle, { backgroundColor: colors.surface }]}>
        <ScrollView>
          <View style={styles.profileContainer}>
            <Image
              source={
                currentPicture
                  ? currentPicture
                  : { uri: "https://picsum.photos/seed/696/3000/2000" }
              }
              accessibilityLabel="Avatar"
              style={{ height: 100, width: 100, borderRadius: 60 }}
            />
            <IconButton
              icon="pencil"
              mode="contained-tonal"
              onPress={updateProfilePic}
              style={styles.penEdit}
            />
            <Text style={[styles.userNameText, { color: colors.onBackground }]}>
              {username}
            </Text>
          </View>
          <Divider />

          <View>
            <TouchableOpacity
              style={styles.settings}
              onPress={() => navigation.navigate("editAccountScreen")}
            >
              <Icon source="account" size={25} />
              <Text
                style={{
                  paddingRight: "40%",
                  paddingLeft: "5%",
                  color: colors.onBackground,
                }}
              >
                Account Settings
              </Text>
              <Icon source="chevron-right" size={20} />
            </TouchableOpacity>
            <Divider />

            <TouchableOpacity
              style={styles.settings}
              onPress={() => navigation.navigate("updatePasswordScreen")}
            >
              <Icon source="key" size={25} />
              <Text
                style={{
                  paddingRight: "38%",
                  paddingLeft: "5%",
                  color: colors.onBackground,
                }}
              >
                Change Password
              </Text>
              <Icon source="chevron-right" size={20} />
            </TouchableOpacity>

            <Divider />

            <View style={styles.settings}>
              <Icon source="theme-light-dark" size={25} />
              <Text
                style={{
                  paddingRight: "20%",
                  paddingLeft: "4.5%",
                  color: colors.onBackground,
                }}
              >
                Dark mode/Light mode
              </Text>
              <Switch value={switchStatus} onValueChange={toggleTheme} />
            </View>
          </View>
          <Divider />
          <TouchableOpacity
            style={styles.settings}
            onPress={() => navigation.navigate("FeedbackScreen")}
          >
            <Icon source="chat-processing" size={25} />
            <Text
              style={{
                paddingRight: "20%",
                paddingLeft: "4.5%",
                color: colors.onBackground,
              }}
            >
              Application Feedback
            </Text>
          </TouchableOpacity>
          <Divider />

          <View style={styles.settings}>
            <TextInput
              label="Quote of the day"
              style={{ width: "100%", height: 150 }}
              value={currQuote}
              onChangeText={(input) => setQuote(input)}
            />
            <IconButton
              icon="check"
              size={20}
              style={styles.checkIcon}
              onPress={handleUpdateQuote}
            />
          </View>

          <View style={{ padding: 20, alignItems: "center" }}>
            <Button mode="elevated" onPress={handleLogout}>
              Logout
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 30,
    width: "100%",
  },
  penEdit: {
    position: "absolute",
    bottom: 50,
    right: "32%",
  },
  roundedSquare: {
    borderRadius: 25,
    height: "70%",
    width: "100%",
    alignItems: "center",
  },
  welcomeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    paddingTop: 40,
  },
  rectangle: {
    borderRadius: 25,
    width: "90%",
    height: "82%",
    alignSelf: "center",
    position: "absolute",
    bottom: -20,
    elevation: 5,
  },
  userNameText: {
    marginTop: 20,
    fontWeight: "500",
  },
  settings: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  checkIcon: {
    position: "absolute",
    right: "4%",
    bottom: "10%",
  },
});

export default SettingScreen;
