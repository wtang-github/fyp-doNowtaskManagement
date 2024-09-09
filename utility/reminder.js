import React, { useState,useEffect } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ReminderPicker = ({confirmDateTime,prevDateTime}) => {
  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [prevReminder, setprevReminder] = useState(prevDateTime); 


  useEffect(() => {
    if (prevDateTime) {
      console.log('initial reminder: ',prevDateTime)
      setSelectedDateTime(prevDateTime);
      setprevReminder(prevDateTime);
    }
}, [prevDateTime]);


  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const handleDateTimeConfirm = async (date) => {
    const formatDatetime = formatDateTime(date);
  if (formatDatetime !== prevReminder) {
    setSelectedDateTime(formatDatetime);
    hideDateTimePicker();
    confirmDateTime(formatDatetime);
  };
}

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Reminders';

    const day = dateTime.getDate();
    const month = dateTime.getMonth()+1;
    const year = dateTime.getYear();
    const formatyear = year.toString().slice(-2);

    const timeStr = `${dateTime.getHours()}:${dateTime.getMinutes().toString().padStart(2, '0')}`;

    return `${day}/${month}/${formatyear} ${timeStr}`;
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={showDateTimePicker} style={styles.button}>
        <AntDesign name="clockcircleo" size={15} color="grey" />
        <Text style={styles.buttonText}>
        {selectedDateTime ? selectedDateTime : "Reminder"}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        onConfirm={handleDateTimeConfirm}
        onCancel={hideDateTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    height:30,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 15,
  },
});

export default ReminderPicker;