import { useState , useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function useTagAction(){
    const [tag, setTag] = useState([]);

    const currUser = auth().currentUser;

    useEffect(()=>{
        if(currUser){
            const tag = firestore().collection('users').doc(currUser.uid).collection('tags');
            const subscribe = tag.onSnapshot(result=>{
                if (result.empty) {
                    console.log('No tags found for this user.');
                    setTag([]);
                }else {
                    const tagData = [];
                    result.forEach(doc => {
                        tagData.push({ id: doc.id, ...doc.data() });
                    });
                    setTag(tagData);
                  }
            });
            return () => subscribe();
        };
    },[currUser]);

 

    const addNewTag = async(tagName)=>{
        try {
            await firestore().collection('users').doc(currUser.uid).collection('tags').add({name:tagName});
            console.log('Added new tag to database'); 
        } catch (error) {
            console.log('Unable to add a new tag: ',error)
        }
        
    }

    const deleteTag = async (tagID) => {
        try {
            await firestore().collection('users').doc(currUser.uid).collection('tags').doc(tagID).delete();
            console.log('Tag deleted');
        } catch (error) {
            console.log('Unable to delete tag ',{tagID},': ',error);
            
        }  
    }

    return {
        tag,
        addNewTag,
        deleteTag
    }
       
}

