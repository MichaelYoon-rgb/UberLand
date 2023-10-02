import React, {useState, useEffect, createContext, useContext} from 'react';
import { db } from "../../../firebase";
import {
    ref,
    onValue,
    push,
    update,
    get,
    remove,
    set,
  } from 'firebase/database';
import { LoginContext } from '../login/login.context';

export const ProfileContext = createContext();

export const ProfileContextProvider = ({children}) => {
    const [profile, setProfile] = useState({});
    const [drivers, setDrivers] = useState([]);
    const [familyProfiles, setFamilyProfiles] = useState({});
    const [driverProfiles, setDriverProfiles] = useState({});
    const { user, initializing } = useContext(LoginContext);
    const [requesting, setRequesting] = useState(true);

    const loadProfile = () => {
        try {
            onValue(ref(db, `/Profile/${user.uid}`), querySnapShot => {
                let data = querySnapShot.val() || {};
                setProfile(data)
                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const addProfile = async (status) => {
        var statusDict = {
            profile: status,
            location: false,
        }
        
        setProfile(statusDict);
        set(ref(db, '/Profile/' + user.uid), {profile: status, location: false});
    }

    const addProfileNumberPlate = (numberPlate) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://api.checkcardetails.co.uk/vehicledata/vehicleregistration?apikey=${"fcb24b85c64b2e5cda67ac59553733ce"}&vrm=${"EA65AMX"}`, requestOptions)
            .then(response => response.json())
            .then(result => {set(ref(db, `/Profile/${user.uid}/numberPlate`), result)})
            .catch(error => console.log('error', error));
    }

    const getProfileNumberPlate = async (driverUID) => {
        const snapshot = await get(ref(db, `/Profile/${driverUID}/numberPlate`));
        const data = snapshot.val() || {};
        console.log(data)
        return data;
    }

    const addProfileFamily = async (family) => {
        set(ref(db, `/Profile/${user.uid}/family`), family);
    }


    const addPreviousRoutes = (driver, destination, origin, last_location) => {
        const date = new Date();
        push(ref(db, `/Profile/${user.uid}/history`), {driver, destination, origin, last_location, date: date.getTime()});
    }

    

    const getDriversProfile = async () => {
        onValue(ref(db, `/Profile/`), querySnapShot => {
            
            let data = querySnapShot.val() || [];
            let temp = []
            for (const [key, value] of Object.entries(data)) {
                if (value.profile == "driver" && value.location != false){
                    temp.push({location: value.location, uid: key})
                }
            }

            setDrivers(temp)
        });
    }

    const getFamilyProfile = async () => {
        onValue(ref(db, `/Profile/`), querySnapShot => {

            let data = querySnapShot.val() || [];
            let temp = {}
            
            for (const [key, value] of Object.entries(data)) {
                temp[key] = {location: value.location}
            }

            setFamilyProfiles(temp)
        });
    }



    const updateLocation = async (location) => {
        console.log(location)
        if (location){
            set(ref(db, `/Profile/${user.uid}/location`), {latitude: location.latitude, longitude: location.longitude});
        }
        
    }

    const removeLocation = async () => {
        set(ref(db, `/Profile/${user.uid}/location`), false);
    }

    const removeFamily = async () => {
        remove(ref(db, `/Profile/${user.uid}/family`));
        let temp = {...profile};
        delete temp.family;
        setProfile(temp)
    }

    useEffect(() => {
        if (user !== undefined){
            loadProfile();
            getDriversProfile();
            getFamilyProfile();
        }
    }, [user]);

    return (
        <ProfileContext.Provider
            value={{
                profile,
                drivers,
                familyProfiles,
                addProfile,
                updateLocation,
                removeLocation,
                getDriversProfile,
                addProfileFamily,
                addPreviousRoutes,
                addProfileNumberPlate,
                getProfileNumberPlate,
                removeFamily
            }}>
            {children}
        </ProfileContext.Provider>
    );
};