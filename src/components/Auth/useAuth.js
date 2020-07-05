import  { useEffect, useState } from 'react';
import firebase from '../../firebase';

const useAuth = () => {
  const [authUser, setAuthUser] = useState();
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return authUser;
};

export default useAuth;
