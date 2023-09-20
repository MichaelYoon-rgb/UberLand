import React, {useState, useEffect, createContext, useContext} from 'react';
import { db } from "../../../firebase";
import {
    ref,
    onValue,
    push,
    update,
    remove,
    set,
  } from 'firebase/database';
import { LoginContext } from '../login/login.context';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({children}) => {
    const [profile, setProfile] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const { user, initializing } = useContext(LoginContext);
    const [requesting, setRequesting] = useState(true);

    const loadProfile = () => {
        try {
            onValue(ref(db, `/Profile/${user.uid}`), querySnapShot => {
                let data = querySnapShot.val() || [];
                setProfile(data)
                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const addProfile = async (status) => {
        var statusDict = {
            profile: status // driver or passenger
        }
        if (status === "driver"){
            statusDict.location = false;
        }
        
        setProfile([
            ...profile,
            statusDict,
        ]);
        
        set(ref(db, '/Profile/' + user.uid), statusDict);
    }

    const getDriversProfile = async () => {
        onValue(ref(db, `/Profile/`), querySnapShot => {
            let data = querySnapShot.val() || [];
            let temp = drivers
            for (const [key, value] of Object.entries(data)) {
                if (value.profile == "driver" && value.location != false){
                    temp.push({location: value.location, uid: key})
                }
            }
            setDrivers(temp)
        });
    }

    const updateLocation = async (location) => {
        if (profile.profile == "driver"){
            set(ref(db, `/Profile/${user.uid}/location`), {latitude: location.latitude, longitude: location.longitude});
        }
    }

    const removeLocation = async () => {
        if (profile.profile == "driver"){
            set(ref(db, `/Profile/${user.uid}/location`), false);
        }
    }

    useEffect(() => {
        if (initializing === false && user !== undefined){
            loadProfile();
            getDriversProfile();
        }
    }, [initializing, user]);

    return (
        <ProfileContext.Provider
            value={{
                profile,
                drivers,
                addProfile,
                updateLocation,
                removeLocation,
                getDriversProfile
            }}>
            {children}
        </ProfileContext.Provider>
    );
};