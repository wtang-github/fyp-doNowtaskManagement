import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

const pickProfilePic = async () => {
  let profilePic = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.4,
  });

  if (!profilePic.canceled) {
    return profilePic.assets[0].uri;
  } else {
    return null;
  }
};

const uploadImage = async pfpuri => {
  const imageName = pfpuri.substring(pfpuri.lastIndexOf('/') + 1);
  const imageRef = storage().ref(imageName);

  try {
    console.log('Starting file upload...');
    await imageRef.putFile(pfpuri);
    console.log('File uploaded successfully');
    const downloadURL = await imageRef.getDownloadURL();
    console.log('File available at', downloadURL);
    return downloadURL;
  } catch (error) {
    console.log('Error uploading file:', error.code);
    console.log('Error details:', error.message);
    Alert.alert('Unable to upload image!', error.message);
  }
};

const saveURL = async (uid, pfpurl) => {
  try {
    await firestore().collection('users').doc(uid).update({
      profilepic: pfpurl,
    });

    console.log('Image URL saved to Firestore:', pfpurl);
    return pfpurl;
  } catch (error) {
    console.log('Unable to save image URL to Firestore: ', error);
    Alert.alert('Error', 'Unable to save image URL. Please try again later.');
  }
};

const gettingProfilePic = async uid => {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    console.log(uid);

    if (userDoc.exists) {
      const userData = userDoc.data();
      const profilepicURL = userData.profilepic;

      console.log('Profile pic URL:', profilepicURL);
      return profilepicURL;
    } else {
      console.log('User document does not exist');
      return null; 
    }
  } catch (error) {
    console.log('Unable to retrieve profile pic:', error);
    return null;
  }
};

export const SetNewProfilePic = async uid => {
  try {

    const imageURI = await pickProfilePic();
    if (!imageURI) {
      console.log('No image selected.');
      return null;
    }

    console.log('Image URI loaded: ', imageURI);

    const imageURL = await uploadImage(imageURI);
    if (!imageURL) {
      console.log('Failed to upload image.');
      return null;
    }

    console.log('Image uploaded:', imageURL);

    const result = await saveURL(uid, imageURL);
    if (!result) {
      console.log('Failed to save image URL.');
      return null;
    }

    console.log('Image URL saved:', result);

    return result;
  } catch (error) {
    console.log('Error in SetNewProfilePic:', error);
    return null;
  }
};


export const loadUserProfilePic = async uid => {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }
    const profilePicURL = await gettingProfilePic(uid);

    if (!profilePicURL) {
      console.log('No profile picture found for this user.');
      return {
        profilePicURL: '',
        error: null,
      };
    }

    console.log('Profile picture URL:', profilePicURL);
    return {
      profilePicURL,
      error: null,
    };
  } catch (error) {
    console.error('Error loading profile picture:', error);
    return {
      profilePicURL: '',
      error,
    };
  }
};