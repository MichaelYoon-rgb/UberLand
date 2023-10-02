import React, {useState, useEffect, createContext, useContext} from 'react';
import { db } from "../../../firebase";
import {
    ref,
    onValue,
    push,
    set,
    remove,
    update
  } from 'firebase/database';
import { LoginContext } from '../login/login.context';
import { RoutesContext } from '../routes/routes.context';
import { ProfileContext } from '../profile/profile.context';
export const FamilyContext = createContext();

export const FamilyContextProvider = ({children}) => {

    const { addProfileFamily, profile } = useContext(ProfileContext)
    const { user, initializing } = useContext(LoginContext);

    const [family, setFamily] = useState(profile.family);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyLocation, setFamilyLocation] = useState([]);
    const [requesting, setRequesting] = useState(true);
    
    const loadFamily = () => {
        try {
            onValue(ref(db, '/Family/' + profile.family), querySnapShot => {
                let data = querySnapShot.val() || [];
                let temp = [];

                for (const [key, value] of Object.entries(data)) {
                    if (value != user.uid){
                        temp.push(value)
                    }
                }
                setFamily(profile.family)
                setFamilyMembers(temp)
                setRequesting(false)
            });
        } catch (e) {
            console.log(e);
        }
    };

    const addFamily = async (familyID) => {
        push(ref(db, '/Family/' + familyID), user.uid)
        setFamily(familyID);
        addProfileFamily(familyID)
    }

    const setupFamily = async () => {
        const familyID = await push(ref(db, '/Family/'), {});
        push(ref(db, '/Family/' + familyID.key), user.uid);
        setFamily(familyID.key);
        addProfileFamily(familyID.key)
    }

    const removeFamilyProfile = () => {
        setFamily(undefined);
    }

    useEffect(() => {
        if (initializing === false && user !== undefined && profile.family !== undefined){
            loadFamily();
        }
    }, [initializing, user, profile.family]);

    return (
        <FamilyContext.Provider
            value={{
                family,
                addFamily,
                setupFamily,
                familyMembers,
                familyLocation,
                removeFamilyProfile,
                requesting
            }}>
            {children}
        </FamilyContext.Provider>
    );
};