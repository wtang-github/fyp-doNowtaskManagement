import { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, IconButton, useTheme } from "react-native-paper";
import auth from "@react-native-firebase/auth";

const UpdatePasswordScreen = ({ navigation }) => {
  const [Currentpassword, setCurrentpassword] = useState("");
  const [Newpassword, setNewpassword] = useState("");
  const [cfmpwd, setcfmpwd] = useState("");
  const [visualpwd, setVisualpwd] = useState(true);
  const [visualpwd1, setVisualpwd1] = useState(true);
  const [visualpwd2, setVisualpwd2] = useState(true);
  const [isGoogleUser, setisGoogleUser] = useState(false);
  const { colors } = useTheme();

  const user = auth().currentUser;

  useEffect(() => {
    if (user.providerData[0].providerId === "google.com") {
      setisGoogleUser(true);
    }
  }, []);


  const passwordValidation = (pwd) => {
    const pwdpattern = /^(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+).{8,}$/;
    return pwdpattern.test(pwd);
  };

  const updatepassword = async () => {
    if (user.providerData[0].providerId === "password") {
      if (passwordValidation(Newpassword)) {
        if (Newpassword !== cfmpwd) {
          Alert.alert("Passwords do not match. Please try again.", [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
          return; 
        }
        try {
          const credential = auth.EmailAuthProvider.credential(
            user.email,
            Currentpassword
          );

          await user.reauthenticateWithCredential(credential);
          console.log("User reauthenticated successfully");

          await user.updatePassword(Newpassword);
          console.log("Password updated successfully");

          navigation.navigate("settingScreen");
        } catch (error) {
          console.log("Unable to update password: ", error);
          Alert.alert("Error", error.message, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
      }
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
        <View style={{ paddingTop: 30 }}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={35}
            style={{ position: "absolute", right: "57%", top: "50%" }}
            onPress={() => navigation.navigate("settingScreen")}
          />
          <Text style={styles.welcomeText}>Change password</Text>
        </View>
      </SafeAreaView>
      <View style={[styles.rectangle,{ backgroundColor: colors.surface }]}>
        <View style={{ padding: 30 }}>
          <TextInput
            label="Current Password"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={visualpwd ? "eye" : "eye-off"}
                onPress={() => setVisualpwd(!visualpwd)}
              />
            }
            disabled={isGoogleUser}
            secureTextEntry={visualpwd}
            value={Currentpassword}
            style={{ marginBottom: 20 }}
            onChangeText={(text) => setCurrentpassword(text)}
          />

          <TextInput
            label="New Password"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={visualpwd1 ? "eye" : "eye-off"}
                onPress={() => setVisualpwd1(!visualpwd1)}
              />
            }
            disabled={isGoogleUser}
            secureTextEntry={visualpwd1}
            value={Newpassword}
            style={{ marginBottom: 20 }}
            onChangeText={(text) => setNewpassword(text)}
          />

          <TextInput
            label="Confirm New Password"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={visualpwd2 ? "eye" : "eye-off"}
                onPress={() => setVisualpwd2(!visualpwd2)}
              />
            }
            disabled={isGoogleUser}
            secureTextEntry={visualpwd2}
            value={cfmpwd}
            style={{ marginBottom: 60 }}
            onChangeText={(text) => setcfmpwd(text)}
          />

          <Button
            mode="contained-tonal"
            onPress={updatepassword}
            disabled={isGoogleUser}
          >
            Update password
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  roundedSquare: {
    backgroundColor: "#b3d7ff",
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
  },
  rectangle: {
    backgroundColor: "white",
    borderRadius: 25,
    width: "90%",
    height: "82%",
    alignSelf: "center",
    position: "absolute",
    bottom: -20,
    elevation: 5,
  },
});

export default UpdatePasswordScreen;
