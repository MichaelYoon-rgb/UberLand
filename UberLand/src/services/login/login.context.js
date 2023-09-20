import React, { useState, useEffect, createContext, useContext } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  
  const signOutFunc = async () => {
    await signOut(auth).then(() => console.log("User signed out!"));
  };
  const emailAndPasswordSignIn = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {


        if (error.code === "auth/invalid-email") {
          return "That email address is invalid!";
        }

        return error.code;
      });
  };

  const emailAndPasswordSignUp = async (email, password, ) => {
    email = email.trim()
    if (password.length == 0){
      return 'Password Field Is Empty'
    }
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User account created & signed in!");
        return ''
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          return "That email address is invalid!"
        } else if (error.code === "auth/network-request-failed"){
          return "Network Error"
        }
        else if (error.code === "auth/invalid-value-(email)"){
          return "Invalid Password"
        } else if (error.code === "auth/email-already-in-use") {
          return "That email address is already in use!";
        }
        return error.code
      });
  };
  
  const anonymousSignUp = async () => {
    await signInAnonymously(auth)
      .then(() => {
        console.log("User signed in anonymously");
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          console.log("Enable anonymous in your firebase console.");
        }

        console.error(error);
      });
  };

  // Handle user state changes

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUser(user);

      } else {
        setUser(undefined);
      }
      if (initializing) setInitializing(false);
    });
  }, []);

  return (
    <LoginContext.Provider
      value={{
        user,
        initializing: initializing,
        anonymousSignUp: anonymousSignUp,
        emailAndPasswordSignIn: emailAndPasswordSignIn,
        emailAndPasswordSignUp: emailAndPasswordSignUp,
        signOutFunc: signOutFunc,
        userId: userId,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
