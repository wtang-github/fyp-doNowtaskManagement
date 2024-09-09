import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, SegmentedButtons,useTheme } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { SelectList } from 'react-native-dropdown-select-list';
import { useTasks } from '../utility/taskActions';
import { useState,useEffect } from 'react';
import {useQuote} from '../utility/quoteAction'

const TimerScreen = () =>{
  const {tasks} = useTasks();
  const {quote} = useQuote();
  const theme = useTheme(); 


  const [selectedSegment, setSelectedSegment] = useState('25'); 
  const [selectTask , setselectTask] = useState('');
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [currQuote , setQuote] = useState('');


  useEffect(() => {
    setQuote(quote);
}, [quote]);

  
  const tasksDropdown = tasks.map((task)=>({
    value : task.name
  }));

  const handleRestartbutton = () =>{
    setKey(prevKey => prevKey + 1);
  }

    const timeSegments = {
      '25': 25 * 60,
      '45': 45 * 60,
      '60': 60 * 60,
    };

  
    const durationInSeconds = timeSegments[selectedSegment];


  return (
    <SafeAreaView style={{ padding: 20 }}>
      <SelectList
        data={tasksDropdown}
        placeholder="Select a task"
        setSelected={(input) => setselectTask(input)}
        maxHeight={200}
        boxStyles={{ backgroundColor: theme.colors.primary }}
        dropdownStyles={{ backgroundColor: theme.colors.primary }}
        dropdownTextStyles={{ color: theme.colors.onPrimary }}
        inputStyles={{ color: theme.colors.onPrimary }}
      />
      <View style={styles.container}>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={durationInSeconds}
          colors={["#004777", "#F7B801", "#db0202", "#db0202"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => (Alert.alert('Your pomodoro session is done!'))}
          size={300}
        >
          {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            return (
              <Text
                style={[styles.timerText, { color: theme.colors.onBackground }]}
              >
                {minutes}:{formattedSeconds}
              </Text>
            );
          }}
        </CountdownCircleTimer>

        <SegmentedButtons
          style={{ paddingTop: 40, paddingBottom: 30 }}
          value={selectedSegment}
          onValueChange={(value) => {
            setSelectedSegment(value);
            handleRestartbutton();
          }}
          buttons={[
            { value: "25", label: "25 Minute" },
            { value: "45", label: "45 Minutes" },
            { value: "60", label: "60 Minutes" },
          ]}
        />

        <Card.Title
          title={`"${currQuote}"`}
          titleStyle={{ alignSelf: "center", color: "black" }}
          titleNumberOfLines={3}
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            marginBottom: 10,
          }}
        />

        <View style={styles.buttonContainer}>
          <Button icon="replay" mode="contained" onPress={handleRestartbutton}>
            {" "}
            Restart
          </Button>
          <Button
            icon={isPlaying ? "pause" : "play"}
            mode="contained"
            style={{ marginLeft: 10, width: 115 }}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {" "}
            {isPlaying ? "pause" : "play"}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        marginTop:20,
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer:{
      flexDirection:'row',
      margin:10
    },
});

export default TimerScreen;