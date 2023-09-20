import React, {useState, useEffect, createContext, useContext} from 'react';
import { db } from "../../../firebase";
import {
    ref,
    onValue,
    push,
    update,
    remove,
  } from 'firebase/database';
import { LoginContext } from '../login/login.context';

export const RatingsContext = createContext();

export const RatingsContextProvider = ({children}) => {
    const [ ratings, setRatings ] = useState([]);
    const { user, initializing } = useContext(LoginContext);
    const [ requesting, setRequesting ] = useState(true);
    
    const loadRatings = () => {
        try {
            onValue(ref(db, '/Ratings'), querySnapShot => {
                let data = querySnapShot.val() || [];
                console.log("Ratings: ", data)
                setRatings(data)
                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const addRatings = async ({uid, stars, review}) => {
        var obj = {
            stars: stars,
            review: review
        }

        setRatings([
            ...ratings,
            obj,
        ]);
        
        push(ref(db, '/Ratings/' + uid), obj);
    }

    const deleteRatings = (key) => {
        // WARNING: PAY ATTENTION TO user.uid or uid
        remove(ref(db, '/Ratings/'  + user.uid + "/" + key));
    }

    const clearRatings = () => {
        setRatings([]);
        remove(ref(db, '/Ratings/'  + user.uid));
    };

    useEffect(() => {
        if (initializing === false && user !== undefined){
            loadRatings();
        }
    }, [initializing, user]);

    return (
        <RatingsContext.Provider
            value={{
                ratings,
                addRatings,
                deleteRatings,
                clearRatings
            }}>
            {children}
        </RatingsContext.Provider>
    );
};