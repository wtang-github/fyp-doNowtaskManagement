import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar, Agenda } from "react-native-calendars";
import { useTasks } from "../utility/taskActions";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, useTheme } from "react-native-paper";
import Checkbox from "expo-checkbox";
import * as expoCalendar from "expo-calendar";

const CalendarWithTasks = () => {
  const { tasks, deleteTask } = useTasks();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [view, setView] = useState("calendar");
  const [buttonOpen, setButtonOpen] = useState(false);
  const [items, setItems] = useState({});
  const [eventTitle, seteventTitle] = useState({});

  useEffect(() => {
    const dates = {};
    const items = {};
    tasks.forEach((task) => {
      const { duedate } = task;
      if (duedate) {
        if (!dates[duedate]) {
          dates[duedate] = { marked: true, dotColor: "#50cebb" };
        }
        if (!items[duedate]) {
          items[duedate] = [];
        }
        items[duedate].push(task);
      }
    });
    setItems(items);
    setMarkedDates(dates);
  }, [tasks]);

  useEffect(() => {
    const fetchData = async () => {
      const { status } = await expoCalendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await expoCalendar.getCalendarsAsync();

        const calendarIds = calendars.map((calendar) => calendar.id);

        const currentDate = new Date();
        const nextYear = new Date().setFullYear(currentDate.getFullYear() + 1);

        const events = await expoCalendar.getEventsAsync(
          calendarIds,
          currentDate,
          nextYear
        );

        console.log("events", events[5].title);

        const eventNames = {};
        const markedDatesData = {};

        events.forEach((event) => {
          const date = event.startDate.split("T")[0];
          const title = event.title;

          if (!markedDatesData[date]) {
            markedDatesData[date] = { marked: true, dotColor: "orange" };
          }

          if (!eventNames[date]) {
            eventNames[date] = [];
          }
          eventNames[date].push(title);
        });

        setMarkedDates((prevMarkedDates) => ({
          ...prevMarkedDates,
          ...markedDatesData,
        }));
        seteventTitle(eventNames);
      }
    };

    fetchData();
  }, [tasks]);

  useEffect(() => {
    if (selectedDate) {
      const tasksForDay = tasks.filter((task) => task.duedate === selectedDate);
      setTasksForSelectedDate(tasksForDay);
    } else {
      setTasksForSelectedDate([]);
    }
  }, [tasks, selectedDate]);

  const groupTasksByColor = (tasks) => {
    const groups = {};

    tasks.forEach((task) => {
      const color = task.color || "default";
      if (!groups[color]) {
        groups[color] = [];
      }
      groups[color].push(task);
    });

    return groups;
  };

  const groupedTasks = groupTasksByColor(tasksForSelectedDate);
  const groupedTasksArray = Object.entries(groupedTasks).map(
    ([color, tasks]) => ({ color, tasks })
  );

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      {view === "calendar" ? (
        <>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={"dot"}
          />
          {selectedDate && (
            <View>
              <Text
                style={[
                  styles.taskHeader,
                  { color: theme.colors.onBackground },
                ]}
              >
                Tasks due on {selectedDate}:
              </Text>
              {groupedTasksArray.length > 0 ? (
                <FlatList
                  data={groupedTasksArray}
                  keyExtractor={(item) => item.color}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.taskGroupContainer,
                        { backgroundColor: item.color },
                      ]}
                    >
                      <View>
                        {item.tasks.map((task) => (
                          <View
                            key={task.id}
                            style={{ flex: 1, flexDirection: "row" }}
                          >
                            <Checkbox
                              accessibilityLabel="checkbox"
                              style={{ margin: 5 }}
                              onValueChange={() => deleteTask(task.id)}
                            />
                            <Text
                              style={[
                                styles.taskItem,
                                { color: theme.colors.onBackground },
                              ]}
                            >
                              {task.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text style={{ color: theme.colors.onBackground }}>
                  No tasks available for this date.
                </Text>
              )}

              <Text
                style={[
                  styles.taskHeader,
                  { color: theme.colors.onBackground },
                ]}
              >
                Events on {selectedDate}:
              </Text>
              {eventTitle[selectedDate] ? (
                eventTitle[selectedDate].map((title, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.eventTitle,
                      {
                        backgroundColor: theme.colors.primaryContainer,
                        color: theme.colors.onBackground,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                ))
              ) : (
                <Text style={{ color: theme.colors.onBackground }}>
                  No events for this date
                </Text>
              )}
            </View>
          )}
        </>
      ) : (
        <Agenda
          markedDates={markedDates}
          items={items}
          renderEmptyData={() => {
            return (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, padding: 20 }}>
                  No tasks/events today
                </Text>
              </View>
            );
          }}
          renderItem={(item) => {
            if (!item || !item.name) {
              return (
                <View
                  style={[
                    styles.taskContainer,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Text>No data available</Text>
                </View>
              );
            }
            return (
              <View
                style={[styles.taskContainer, { backgroundColor: item.color }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Checkbox
                    accessibilityLabel="checkbox"
                    style={{ margin: 5 }}
                    onValueChange={() => deleteTask(item.id)}
                  />
                  <Text>{item.name}</Text>
                </View>

                <Text>Details: {item.details}</Text>
              </View>
            );
          }}
        />
      )}
      <FAB.Group
        style={styles.fab}
        open={buttonOpen}
        icon={buttonOpen ? "calendar-today" : "table-of-contents"}
        actions={[
          {
            icon: view === "calendar" ? "view-list" : "calendar-today",
            label: view === "calendar" ? "Agenda" : "Calendar",
            onPress: () => setView(view === "calendar" ? "agenda" : "calendar"),
          },
        ]}
        onStateChange={({ open }) => setButtonOpen(open)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskContainer: {
    marginTop: 35,
    margin: 35,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
  },
  taskHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskGroupContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  taskItem: {
    fontSize: 16,
    color: "white",
    paddingVertical: 5,
  },
  taskItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  section: {
    padding: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
  eventTitle: {
    borderWidth: 1,
    padding: 5,
    margin: 2,
    borderRadius: 10,
    width: 100,
  },
});

export default CalendarWithTasks;
