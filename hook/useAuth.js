import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  function onAuthStateChanged(user) {
    setUser(user);
    console.log('reach here in on AuthStateChange: ',loading);
    if (loading){
      setLoading(false);
    } 
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const logoutUser = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      console.log('Logout error: ', error);
    }
  };

  return { user, loading, logoutUser };
};

export default useAuth;
