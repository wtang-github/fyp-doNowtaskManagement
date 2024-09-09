import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet, Alert, Image} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const imagePath = require("../assets/images/alarm-clock_23f0.png");


export default function LoginScreen({navigation}){
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visualpwd, setVisualpwd] = useState(true);


    const navigatesignupScreen=()=>{
        navigation.navigate('Sign up');
      }

    const loginPress = async() =>{
        try{
            const userDetails = await auth().signInWithEmailAndPassword(email, password);
            const userid = userDetails.user.uid
            const userCollection = firestore().collection('users');
            const userCheck =  await userCollection.doc(userid).get();

            if(!userCheck.exists){
                Alert.alert('User does not exists! Please create a new account.');
                return; 
            }else{
                try{
                navigation.navigate('Home');

                }catch(error){
                    console.log(error.message);
                }
            }
        }catch(error){
            switch (error.code) {
                case 'auth/invalid-credential':
                    Alert.alert('Invalid email / password inputted. Please try again.');
                    break;              
                default:
                    Alert.alert('Please contact the developer: dev-doNow@gmail.com.');
                    console.log(error.message);
                    break;
            }
            }
        }

    
return (
    <SafeAreaView>
        <Text style={{textAlign:'center',fontSize:30,padding:30}}>Login to your account</Text>
        <Image source={imagePath} style={styles.image} />
        
        <TextInput
        mode= 'outlined'
        label="Email"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        value={email}
        onChangeText={text => setEmail(text)}
        />

      <TextInput
        mode= 'outlined'
        label="Password"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        right={
            <TextInput.Icon
              icon={visualpwd ? 'eye' : 'eye-off'}
              onPress={() => setVisualpwd(!visualpwd)}
            />}
        secureTextEntry={visualpwd}
        value={password}
        onChangeText={(input) => setPassword(input)}
      />
    <Pressable onPress={loginPress} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>Login</Text>
    </Pressable>

    <View style={{flexDirection:'row',alignSelf:'center'}}>
    <Text style={{textAlign:'center',marginTop:30}}>Do not have an account? </Text>
    <Pressable onPress={navigatesignupScreen}>
      <Text style={{textAlign:'center',color:'darkblue',marginTop:30}}>Create account</Text>
    </Pressable>
    </View>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
    input:{
        marginBottom:30,
        borderRadius:5,
        width:'80%',
        alignSelf:'center'
    },
    buttonStyle:{
        alignSelf:'center',
        backgroundColor:'lightblue',
        width:100,
        height:40,
        borderRadius:10,
        
    },
    buttonText:{
        textAlign:'center',
        padding:10,
    },
    image:{
        alignSelf:'center',
        width:70,
        height:70,
        marginBottom:40,
    },

});


