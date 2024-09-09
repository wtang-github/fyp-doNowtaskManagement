import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState , useEffect} from 'react';


export const useQuote = () =>{
    const currUser = auth().currentUser;
    const [quote , setQuote] = useState('');


    useEffect(()=>{
        if (!currUser) return ;

        const subscribe = firestore().collection('users').doc(currUser.uid).onSnapshot(result => {
        if (result.exists) {
            const data = result.data().quote;
            setQuote(data);
        }else{
            console.log('No such user!')
        }
        });
        return ()=> subscribe();
    },[currUser]);


    const updateQuote = async(newQuote) =>{
        try {
            await firestore().collection('users').doc(currUser.uid).update({quote:newQuote});
            console.log('Update quote successful');
        } catch (error) {
            console.log('Unable to update quote: ', error);
        }
    }

    return {
        quote,
        updateQuote
    }
}