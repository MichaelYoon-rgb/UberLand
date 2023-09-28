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
import { RoutesContext } from '../routes/routes.context';
export const FamilyContext = createContext();

export const FamilyContextProvider = ({children}) => {
    const [family, setFamily] = useState([]);
    const [familyLocation, setFamilyLocation] = useState([]);
    const [requesting, setRequesting] = useState(true);

    const { user, initializing } = useContext(LoginContext);
    const { routes, allRoutes } = useContext(RoutesContext);
    
    const loadFamily = () => {
        try {
            onValue(ref(db, '/Family/' + user.uid), querySnapShot => {
                let data = querySnapShot.val() || [];
                let temp = [];
                for (const [key, value] of Object.entries(data)){
                    temp.push(value)
                }
                setFamily(temp)
                setFamilyLocationFunc(data)

                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const addFamily = async (uid) => {        
        var obj = uid

        setFamily([
            ...family,
            obj,
        ]);
        
        push(ref(db, '/Family/' + user.uid), obj);
    }

    const setFamilyLocationFunc = async (data) => {
        let temp = [];
        for (const [key, value] of Object.entries(data)){
            temp.push(allRoutes[value])
        }
        setFamilyLocation(temp)
    }


    const deleteFamily = (key) => {
        remove(ref(db, '/Family/'  + user.uid + "/" + key));
    }

    const clearFamily = () => {
        setFamily([]);
        remove(ref(db, '/Family/'  + user.uid));
    };

    useEffect(() => {
        if (initializing === false && user !== undefined){
            loadFamily();
        }
    }, [initializing, user]);

    return (
        <FamilyContext.Provider
            value={{
                family,
                addFamily,
                deleteFamily,
                clearFamily,
                familyLocation,
            }}>
            {children}
        </FamilyContext.Provider>
    );
};