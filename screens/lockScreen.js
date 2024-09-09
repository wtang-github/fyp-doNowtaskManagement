import React from 'react';
import {StyleSheet, Text, SafeAreaView,Platform,Image, Pressable} from 'react-native';
import Auth from '../utility/googleAuth';
import Fontisto from '@expo/vector-icons/Fontisto';
  
const imagePath = require("../assets/images/alarm-clock_23f0.png");


function LockScreen({ navigation }) {
    
      return (
        <SafeAreaView style={styles.container}>
          <Text style={[{fontFamily:Platform.select({android:'Mali_500Medium',ios:'Mali'}),fontSize:30}, styles.textStyles]}>-doNow-</Text>
          <Text style={[{fontFamily:Platform.select({android:'Mallanna_400Regular',ios:'Mallanna'})},styles.textStyles,styles.subtext]}>Simple task management application</Text>
          <Image source={imagePath} style={styles.image} />
          <Auth navigation={navigation}/>
          <Pressable onPress={()=>navigation.navigate('Sign in')} style={styles.button} accessibilityLabel='Email login'>
            <Fontisto name="email" size={20} color="black" style={styles.buttonAlign} />
            <Text style={[{fontSize:18},styles.buttonAlign,styles.robotoStyle]}>Email login</Text>
          </Pressable>

          <Pressable onPress={()=>navigation.navigate('Sign up')} accessibilityLabel='Sign up'> 
            <Text style={[styles.robotoStyle,{textAlign:'center',padding:20,color:'darkblue'}]}>
              Create your account now!
            </Text>
          </Pressable>

        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
      container:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
      },
      textStyles:{        
        textAlign:'center',
        justifyContent:'center',
        alignContent:'center',
      },
      image:{
        alignSelf:'center',
        width: 100,
        height:100,
        marginBottom:60,
      },
      subtext:{
        fontSize:18,
        margin:5,
        marginBottom:20,
      },
      button:{
        flexDirection:'row',
        borderRadius:25,
        width:210,
        padding:12,
        marginTop:30,
        backgroundColor:'lightblue',
        alignSelf:'center',
      },
      buttonAlign:{
        textAlign:'center',
        alignSelf:'center',
        marginLeft:20
      },
      robotoStyle:{
        fontFamily:Platform.select({android:'Roboto_500Medium',ios:'Roboto'})
      },
    })

export default LockScreen;