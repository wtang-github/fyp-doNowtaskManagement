import { useState,useEffect } from "react";
import { Pressable, Text, StyleSheet, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Datepick = ({confirmedDate,initialDate}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [prevDate, setPrevDate] = useState(initialDate);

  useEffect(() => {
    if (initialDate) {
      console.log('initial date: ',initialDate)
        setSelectedDate(initialDate);
        setPrevDate(initialDate); 
    }
}, [initialDate]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };


  const handleConfirm = async (date) => {
    const selectedcalDate = date.toLocaleDateString('en-CA');

  if (selectedcalDate !== prevDate) {
    setSelectedDate(selectedcalDate);
    hideDatePicker();
    confirmedDate(selectedcalDate);

} else {
  console.log('Selected date is the same as the previous date, no update needed.');
  hideDatePicker();
}
};


  return (
    <View style={styles.container}>
      <Pressable onPress={showDatePicker} style={styles.button}>
        <FontAwesome name="calendar" size={15} color="grey" />
        <Text style={styles.buttonText} accessibilityLabel="date">
          {selectedDate ? selectedDate : "End Date"}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
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

export default Datepick;