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

export const RoutesContext = createContext();

export const RoutesContextProvider = ({children}) => {
    const [routes, setRoutes] = useState({});
    const [allRoutes, setAllRoutes] = useState({});
    const [driverRoutes, setDriverRoutes] = useState({});
    const { user, initializing } = useContext(LoginContext);
    const [requesting, setRequesting] = useState(true);

    const loadRoutes = () => {
        try {
            onValue(ref(db, `/Routes/${user.uid}`), querySnapShot => {
                let data = querySnapShot.val() || {};
                setRoutes(data)
                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const loadDriverRoutes = () => {
            onValue(ref(db, `/Routes/`), querySnapShot => {
                let data = querySnapShot.val() || {};
                for (const [key, value] of Object.entries(data)) {
                    if (value.driver == user.uid){
                        setDriverRoutes({origin: value.origin, destination: value.destination, uid: key})
                    }
                }
                setAllRoutes(data)
                setRequesting(false)
            });
    };

    const addRoutes = async (origin, destination) => {
        var route = {
            origin: origin,
            destination: destination,
            active: true
        }
        
        setRoutes(route);
        set(ref(db, '/Routes/' + user.uid), route);
    }

    const addRoutesDriver = async (uid) => {
        console.log("adding driver: ", uid)
        routes.driver = uid;
        set(ref(db, '/Routes/' + user.uid), routes);
    }

    const isDriver = async (uid) => {
        set(ref(db, '/Routes/' + user.uid), routes);
    }

    const deleteRoutes = (key) => {
        remove(ref(db, '/Routes/'  + user.uid + "/" + key));
    }

    const clearRoutes = () => {
        setRoutes([]);
        remove(ref(db, '/Routes/'  + user.uid));
    };

    useEffect(() => {
        if (initializing === false && user !== undefined){
            loadRoutes();
            loadDriverRoutes();
        }
    }, [initializing, user]);

    return (
        <RoutesContext.Provider
            value={{
                routes,
                addRoutes,
                deleteRoutes,
                clearRoutes,
                addRoutesDriver,
                driverRoutes,
                allRoutes
            }}>
            {children}
        </RoutesContext.Provider>
    );
};