import React, { useState } from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton, Button, TextInput,useTheme } from "react-native-paper";

const FeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");
    const { colors } = useTheme();


  const sendFeedback = async () => {
    const devEmail = "fypdonowtaskmanagement@gmail.com";
    const emailContent = feedback;
    const mailURL = `mailto:${devEmail}?body=${encodeURIComponent(
      emailContent
    )}`;

    try {
      const openMail = await Linking.canOpenURL(mailURL);
      if (!openMail) {
        Alert.alert(
          "Error: The mail application is not supported on this device"
        );
      } else {
        await Linking.openURL(mailURL);
      }
    } catch (error) {
      console.error("Error sending feedback: ", error);
      Alert.alert("Error: ", error);
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
            style={styles.arrowIcon}
            onPress={() => navigation.navigate("settingScreen")}
          />
          <Text style={styles.welcomeText}>Feedback Form</Text>
        </View>
      </SafeAreaView>
      <View style={[styles.rectangle, { backgroundColor: colors.surface }]}>
        <TextInput
          label="Feedback"
          mode="outlined"
          multiline={true}
          placeholder="Enter your message"
          value={feedback}
          onChangeText={setFeedback}
          style={styles.textInput}
        />
        <Button
          mode="contained-tonal"
          onPress={sendFeedback}
          style={styles.submitButton}
        >
          send feedback
        </Button>
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
  arrowIcon: {
    position: "absolute",
    right: "54%",
    top: "50%",
  },
  textInput: {
    alignSelf: "center",
    height: 100,
    width: "90%",
    margin: 40,
  },
  submitButton: {
    width: "50%",
    alignSelf: "center",
  },
});

export default FeedbackScreen;
