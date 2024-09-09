import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, IconButton, Button,useTheme } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const EditAccountScreen = ({ navigation }) => {
  const [Newusername, setNewusername] = useState("");
  const [Newemail, setNewemail] = useState("");
  const [isGoogleUser, setisGoogleUser] = useState(false);
  const { colors } = useTheme();

  const user = auth().currentUser;
  const uid = user.uid;
  const name = user.displayName;
  const email = user.email;

  useEffect(() => {
    const unsubscribe = auth().onUserChanged((updatedUser) => {
      if (updatedUser) {
        setNewusername(updatedUser.displayName, "");
        setNewemail(updatedUser.email, "");
      } else {
        setNewusername("");
        setNewemail("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user.providerData[0].providerId === "google.com") {
      setisGoogleUser(true);
    }
  }, []);

  const updateUser = async () => {
    try {
      if (Newusername && Newusername != name) {
        try {
          const updateName = { displayName: Newusername };
          await Promise.all([
            auth().currentUser.updateProfile(updateName),
            firestore()
              .collection("users")
              .doc(uid)
              .update({ username: Newusername }),
          ]);
          console.log("Firestore: New username updated! ");
        } catch (error) {
          console.log("Firestore: Unable to update username -> ", error);
        }
      }

      if (Newemail && Newemail != email) {
        try {
          await Promise.all([
            user.updateEmail(Newemail),
            firestore()
              .collection("users")
              .doc(uid)
              .update({ email: Newemail }),
          ]);
          console.log("Updated email!");
        } catch (error) {
          console.log("Unable to update email: ", error);
        }
      }
      navigation.navigate("settingScreen");
    } catch (error) {
      console.log("Unable to update user details to firestore: ", error);
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
            style={{ position: "absolute", right: "50%", top: "50%" }}
            onPress={() => navigation.navigate("settingScreen")}
          />
          <Text style={styles.welcomeText}>Edit Account</Text>
        </View>
      </SafeAreaView>

      <View style={[styles.rectangle, { backgroundColor: colors.surface }]}>
        <View style={{ padding: 30 }}>
          <TextInput
            label="Username"
            mode="outlined"
            value={Newusername}
            style={{ marginBottom: 20 }}
            onChangeText={(text) => setNewusername(text)}
          />

          <TextInput
            label="Email"
            mode="outlined"
            disabled={isGoogleUser}
            value={Newemail}
            style={{ marginBottom: 50, overflow: "hidden" }}
            scrollEnabled={true}
            onChangeText={(text) => setNewemail(text)}
          />

          <Button mode="contained-tonal" onPress={updateUser}>
            Update Details
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

export default EditAccountScreen;
