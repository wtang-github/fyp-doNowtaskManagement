import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Chip } from "react-native-paper";

const FlagButton = ({ flagState, uid, taskid }) => {
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const flagDetails = await firestore()
          .collection("users")
          .doc(uid)
          .collection("tasks")
          .doc(taskid)
          .get();

        if (flagDetails.exists) {
          const currentFlag = flagDetails.data().flag;
          setFlagged(currentFlag);
          flagState(currentFlag);
        }
      } catch (error) {
        console.log("Flag button data unable to load: ", error);
      }
    };

    if (taskid && uid) {
      getData();
    }
  }, [taskid, uid]);

  const toggleFlag = () => {
    setFlagged(!flagged);
    flagState(!flagged);
  };

  return (
    <View style={styles.container}>
      <Chip
        accessibilityLabel="Flag"
        icon={flagged ? "flag" : "flag-outline"}
        onPress={toggleFlag}
        style={styles.chip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  chip: {
    width: 35, 
    height: 30,
    justifyContent: "center", 
    alignItems: "center",
  },
});

export default FlagButton;
