import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Checkbox from "expo-checkbox";
import Modal from "react-native-modal";
import { useOverlay } from "../utility/helperFunctions";
import FlagButton from "../utility/flagbutton";
import Datepick from "../utility/dateSelector";
import ReminderPicker from "../utility/reminder";
import { useTasks } from "../utility/taskActions";
import { useTheme, ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import TagDropdown from "../components/tagDropdown.js";
import useAuth from "../hook/useAuth.js";
import auth from "@react-native-firebase/auth";
import { SelectList } from "react-native-dropdown-select-list";
import useTagAction from "../utility/tagActions.js";

function HomeScreen() {
  const { tasks, taskcount, addNewTask, updateTask, deleteTask } = useTasks();
  const { isOverlayVisible, toggleOverlay } = useOverlay();
  const { user } = useAuth();
  const theme = useTheme();
  const { tag } = useTagAction();

  const [username, setNewusername] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [taskFlag, setTaskFlag] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [progressVal, setprogressVal] = useState(0);
  const [startTaskNum, setTaskNum] = useState(0);
  const [filterval, setFilterVal] = useState("all");
  const [filterTasks, setFilterTasks] = useState(tasks);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged((updatedUser) => {
      if (updatedUser) {
        setNewusername(updatedUser.displayName, "");
      } else {
        setNewusername("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (taskcount == 0) {
      setTaskNum(0);
    } else if (taskcount > startTaskNum) {
      setTaskNum(taskcount);
    }
    if (taskcount) {
      const progress = taskcount / startTaskNum;
      const finalProgress = Math.max(0, Math.min(progress, 1));
      setprogressVal(finalProgress);
    } else {
      setprogressVal(0);
    }
  }, [taskcount]);

  useEffect(() => {
    let filterTask;

    if (filterval === "flagged tasks") {
      filterTask = tasks.filter((task) => task.flag);
    } else if (filterval === "Due Date (Closest to Furthest)") {
      filterTask = tasks
        .filter((task) => task.duedate)
        .sort(
          (fardate, neardate) =>
            new Date(fardate.duedate) - new Date(neardate.duedate)
        );
    } else if (filterval === "all tasks" || filterval === "all") {
      filterTask = tasks;
    } else if (filterval) {
      filterTask = tasks.filter((task) => task.tag === filterval);
    }
    setFilterTasks(filterTask);
  }, [filterval, tasks]);

  const dynamicTagOptions = tag.map((tag, index) => ({
    key: 4 + index,
    value: tag.name,
  }));

  const filterOptions = [
    { key: "1", value: "all tasks" },
    { key: "2", value: "Due Date (Closest to Furthest)" },
    { key: "3", value: "flagged tasks" },
    ...dynamicTagOptions,
  ];

  const confirmDueDate = (date) => {
    setSelectedDate(date);
  };

  const confirmDateTime = (dateTime) => {
    setSelectedReminder(dateTime);
  };

  const confirmFlagState = (flagState) => {
    setTaskFlag(flagState);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const TaskAddorUpdate = () => {
    if (selectedTask) {
      const updatedDate = selectedDate || selectedTask.date;
      console.log("selectedtask: ", selectedTask);
      const updatedReminder = selectedReminder || selectedTask.reminders;
      updateTask(
        selectedColor,
        selectedTask.id,
        taskName,
        taskDetails,
        updatedDate,
        updatedReminder,
        taskFlag,
        selectedTag
      );
    } else {
      addNewTask(
        selectedColor,
        taskName,
        taskDetails,
        selectedDate,
        selectedReminder,
        taskFlag,
        selectedTag
      );
    }
    clearOverlay();
  };

  const openTaskOverlay = (color, task = null) => {
    setSelectedColor(color);
    if (task) {
      setTaskName(task.name);
      setTaskDetails(task.details);
      setSelectedTask(task);
      setSelectedTag(task.tag); 
    } else {
      setTaskName("");
      setTaskDetails("");
      setSelectedTask(null);
      setSelectedTag(null);
    }
    toggleOverlay();
  };

  const clearOverlay = () => {
    setTaskName("");
    setTaskDetails("");
    setSelectedTask(null);
    setSelectedColor("");
    setSelectedDate(null);
    setSelectedReminder(null);
    setSelectedTag(null);
    toggleOverlay();
  };

  const renderTasks = (color) =>
    filterTasks
      .filter((task) => task.color === color)
      .map((task) => (
        <Swipeable
          key={task.id}
          renderRightActions={() => (
            <TouchableOpacity onPress={() => deleteTask(task.id)}>
              <Text
                style={{ backgroundColor: "red", color: "white", fontSize: 10 }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          )}
        >
          <TouchableOpacity onPress={() => openTaskOverlay(color, task)}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                accessibilityLabel="checkbox"
                style={{ margin: 5 }}
                onValueChange={() => deleteTask(task.id)}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ alignSelf: "center" }}>{task.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      ));

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
    >
      <View style={{ top: "15%", paddingLeft: 10, paddingRight: 10 }}>
        <Text style={[styles.header, { color: theme.colors.onBackground }]}>
          Hello {username}
        </Text>

        <Text style={[styles.subheader, { color: theme.colors.onBackground }]}>
          Here are the tasks you need to complete:
        </Text>

        <View style={styles.progress}>
          <Text style={{ color: theme.colors.onBackground }}>
            Task completion progress:
          </Text>
          <ProgressBar progress={progressVal} color={theme.colors.primary} />
        </View>

        <View style={styles.sortingStyle}>
          <SelectList
            setSelected={setFilterVal}
            data={filterOptions}
            save="value"
            placeholder="Select Filter"
            maxHeight={80}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.rectangle, styles.red]}
        onPress={() => openTaskOverlay("red")}
      >
        <Text style={[styles.labels, { color: "red" }]}>
          Important & Urgent
        </Text>
        <ScrollView>{renderTasks("red")}</ScrollView>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.rectangle, styles.orange]}
        onPress={() => openTaskOverlay("orange")}
      >
        <Text style={[styles.labels, { color: "#d17819" }]}>
          Important/Not Urgent
        </Text>
        <ScrollView>{renderTasks("orange")}</ScrollView>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.rectangle, styles.green]}
        onPress={() => openTaskOverlay("green")}
      >
        <Text style={[styles.labels, { color: "green" }]}>
          Not Important/Urgent
        </Text>
        <ScrollView>{renderTasks("green")}</ScrollView>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.rectangle, styles.blue]}
        onPress={() => openTaskOverlay("blue")}
      >
        <Text style={[styles.labels, { color: "navy" }]}>
          Urgent/Not important
        </Text>
        <ScrollView>{renderTasks("blue")}</ScrollView>
      </TouchableOpacity>

      <Modal isVisible={isOverlayVisible} onBackdropPress={clearOverlay}>
        <View style={styles.modalView}>
          <TextInput
            style={[styles.input]}
            onChangeText={setTaskName}
            value={taskName}
            placeholder="Enter task name"
            placeholderTextColor="#cccccc"
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            onChangeText={setTaskDetails}
            value={taskDetails}
            multiline={true}
            numberOfLines={2}
            maxLength={30}
            placeholder="Enter task details"
            placeholderTextColor="#cccccc"
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 10,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Datepick
              initialDate={selectedTask ? selectedTask.duedate : null}
              confirmedDate={confirmDueDate}
            />

            <ReminderPicker
              prevDateTime={selectedTask ? selectedTask.reminders : null}
              confirmDateTime={confirmDateTime}
            />
          </View>

          <View
            style={{ flexDirection: "row", marginTop: 3, marginBottom: 20 }}
          >
            <FlagButton
              flagState={confirmFlagState}
              taskid={selectedTask ? selectedTask.id : null}
              uid={user?.uid}
            />

            <TagDropdown
              uid={user?.uid}
              select={handleTagSelect}
              defaultTag={selectedTask ? selectedTask.tag : null}
              taskid={selectedTask ? selectedTask.id : null}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.addTaskButton} onPress={TaskAddorUpdate}>
              <Text>{selectedTask ? "Update Task" : "Add Task"}</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={clearOverlay}>
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  rectangle: {
    borderWidth: 1,
    width: "45%",
    height: "25%",
    borderRadius: 10,
  },
  red: {
    backgroundColor: "#ffc1bd",
    borderColor: "#ff2617",
    borderWidth: 1.5,
    top: "25%",
    left: "2%",
  },
  green: {
    backgroundColor: "#ccffcc",
    borderColor: "#00b300",
    borderWidth: 1.5,
    left: "2%",
    top: "2%",
  },
  orange: {
    backgroundColor: "#ffdab3",
    borderColor: "orange",
    borderWidth: 1.5,
    left: "53%",
  },
  blue: {
    backgroundColor: "#cce6ff",
    borderColor: "#0073e6",
    borderWidth: 1.5,
    left: "53%",
    bottom: "22.5%",
  },
  labels: {
    textAlign: "right",
    fontSize: 8,
    marginRight: "3%",
    marginTop: "2%",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addTaskButton: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#6dc2e3",
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#6dc2e3",
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    top: "15%",
  },
  subheader: {
    fontSize: 20,
    top: "17%",
  },
  progress: {
    top: "20%",
  },
  sortingStyle: {
    paddingTop: 10,
    top: "20%",
    alignSelf: "flex-end",
  },
});

export default HomeScreen;
