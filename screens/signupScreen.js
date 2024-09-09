import React, { useState } from 'react';
import {Pressable, Text, StyleSheet,View, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function SignupScreen({navigation}){
  const [email,setEmail] = useState('');
  const [username , setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkpassword, setCheckpassword] = useState('');
  const [visualpwd, setVisualpwd] = useState(true);
  const [visualpwd1, setVisualpwd1] = useState(true);

  const defaultQuote = 'Get your work done!';



  const navigateloginScreen=()=>{
    navigation.navigate('Sign in');
  }

  const passwordValidation = (pwd) => {
    const pwdpattern = /^(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+).{8,}$/;
    return pwdpattern.test(pwd);
  }

  const registerPress = async() =>{
    if (passwordValidation(password)){

      if(password!=checkpassword){
        Alert.alert('Passwords do not match. Please try again.',[{ text: "OK", onPress: () => console.log("OK Pressed") }]);
        return; 
      }
        try{
            const userRegisterCred = await auth().createUserWithEmailAndPassword(email, password);
            const userID = userRegisterCred.user.uid
            const newuserData = {id:userID,email,username,quote:defaultQuote};

            await userRegisterCred.user.updateProfile({
              displayName: username
            });

            try{
              await firestore().collection('users').doc(userID).set(newuserData);
              console.log('User data is added!');
              navigation.navigate('Home');
            }catch(error){
              console.log(error.message);
              console.log('User data cannot be added');
              }
        
        }catch(error){
            switch (error.code) {
              case 'auth/email-already-in-use':
                Alert.alert('Existing account with the same email address.');
                break;
              case 'auth/invalid-email':
                Alert.alert('Email address is not valid.');
                break;
              case 'auth/operation-not-allowed':
                Alert.alert('Please contact the developer: dev-doNow@gmail.com.');
                break;
              case 'auth/weak-password':
                Alert.alert('Password is weak. Please strengthen your password.');
                break; 
          
              default:
                Alert.alert('Please contact the developer: dev-doNow@gmail.com.');
                console.log(error.message);
                break;
          }
            }
        }else{
          Alert.alert('Please make sure your password is at least 8 characters long and includes at least one uppercase letter and one number.');
        }
  }

  
return (
  <SafeAreaView>
      <Text style={{textAlign:'center',fontSize:30,padding:30}} accessibilityLabel='Create your account'>Create your account</Text>
      <TextInput
        accessibilityLabel='Input username'
        mode= 'outlined'
        label="Username"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        value={username}
        onChangeText={input => setUsername(input)}
        />
    
    <TextInput
        accessibilityLabel='Input email'
        mode= 'outlined'
        label="Email"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        value={email}
        onChangeText={input => setEmail(input)}
        /> 


<TextInput
        accessibilityLabel='Input password'
        mode= 'outlined'
        label="Password"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        right={
            <TextInput.Icon
              icon={visualpwd1 ? 'eye' : 'eye-off'}
              onPress={() => setVisualpwd1(!visualpwd1)}
            />}
        secureTextEntry={visualpwd1}
        value={password}
        onChangeText={(input) => setPassword(input)}
      />

    <TextInput
        accessibilityLabel='Input password again'
        mode= 'outlined'
        label="Confirm Password"
        style={styles.input}
        outlineColor='#56bfe8'
        activeOutlineColor='#0b81b0'
        right={
            <TextInput.Icon
              icon={visualpwd ? 'eye' : 'eye-off'}
              onPress={() => setVisualpwd(!visualpwd)}
            />}
        secureTextEntry={visualpwd}
        value={checkpassword}
        onChangeText={(input) => setCheckpassword(input)}
      />

    <Pressable onPress={registerPress} style={styles.buttonStyle} accessibilityLabel='Create account'>
        <Text style={styles.buttonText}>Create account</Text>
    </Pressable>

    <View style={{flexDirection:'row',alignSelf:'center'}}>
    <Text style={{textAlign:'center',marginTop:30}}>Already have an account? </Text>
    <Pressable onPress={navigateloginScreen} accessibilityLabel='Login'>
      <Text style={{textAlign:'center',color:'darkblue',marginTop:30}}>Log in</Text>
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
      alignSelf:'center',
  },
  buttonStyle:{
      alignSelf:'center',
      backgroundColor:'lightblue',
      width:200,
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


