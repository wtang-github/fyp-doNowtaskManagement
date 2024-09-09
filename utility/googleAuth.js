import {GoogleSignin,isErrorWithCode,statusCodes} from '@react-native-google-signin/google-signin';
import {TouchableOpacity,Image,SafeAreaView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const path = require("../assets/images/android_light.png");


export default function googleAuth({navigation}){
    GoogleSignin.configure(
        {
          offlineAccess: true,
          webClientId:'61775532127-htmkdhs1vte9qogbhhhdsemo0rd620jn.apps.googleusercontent.com',
          iosClientId: '61775532127-2djv3l7d1e82birc1kfmuqa40ko5646t.apps.googleusercontent.com',
          scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
        });
    
        const googleSignIn = async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const { user: { name, email, photo },idToken } = await GoogleSignin.signIn();
              const googleCredential = auth.GoogleAuthProvider.credential(idToken);
              const credential = await auth().signInWithCredential(googleCredential);

              const userCollection = firestore().collection('users');               
              const uid = credential.user.uid
              const userCheck = await userCollection.doc(uid).get();

              if(!userCheck.exists){
                const googleuserData = {id:uid,email:email,username:name,profilepic:photo};
                try{
                  await userCollection.doc(uid).set(googleuserData);
                  await userCollection.doc(uid).collection('tags').add({ name: 'First tag' });
                  navigation.navigate('Home',{user:uid});
                  console.log('User data is added!');
                }catch(error){
                  console.log(error.message);
                  console.log('User data cannot be added');
                  }
              }else{
                const userInData = userCheck.data();
                navigation.navigate('Home',{userInData})
              }
            } catch (error) {
              if (isErrorWithCode(error)) {
                switch (error.code) {
                  case statusCodes.SIGN_IN_CANCELLED:
                    console.log('Google Sign in cancelled.');
                    break;
                  case statusCodes.IN_PROGRESS:
                    console.log('Google sign in in progress');
                    break;
                  case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    Alert.alert('Google play services is not available on this phone.');
                    break;
                  default:
                    console.log("google error code: ",error.code);
                    console.log(error.message);
                  break;
                }
              }
              else {
                console.log('An error that is not related to Google sign-in: ', error);
              }
            }
          };

        return(
          <SafeAreaView>
            <TouchableOpacity onPress={googleSignIn} accessibilityLabel='Google sign in'>
                <Image source={path} style={{width:210,height:48,alignSelf:'center'}}/>
            </TouchableOpacity>
          </SafeAreaView>
            
        );
        }