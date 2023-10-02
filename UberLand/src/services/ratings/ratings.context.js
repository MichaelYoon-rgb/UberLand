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
    const [ ratings, setRatings ] = useState({});
    const { user, initializing } = useContext(LoginContext);
    const [ requesting, setRequesting ] = useState(true);
    
    const loadRatings = () => {
        try {
            onValue(ref(db, '/Ratings'), querySnapShot => {
                let data = querySnapShot.val() || {};
                let temp = {};
                for (const [key, value] of Object.entries(data)) {
                    temp[Object.keys(value)[0]] = value[Object.keys(value)[0]]
                }
                setRatings(temp)
                setRequesting(false)
            });
            
        } catch (e) {
            console.log(e);
        }
    };

    const addRatings = async (driverUID, title, subtitle) => {
        var obj = {
            passengerUID: user.uid,
            driverUID,
            title,
            subtitle,
        }


        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWY4MTgyNzAtZGI1YS00Y2FjLThhZDItMmIyNzBkNjkzYmM3IiwidHlwZSI6ImFwaV90b2tlbiIsIm5hbWUiOiJVYmVyTGFuZFJlZ2lvbmFsIiwiaXNfY3VzdG9tIjp0cnVlfQ.FrwH_8bLHgLevJvW_kbiYsTzLoC7nJdEm4sv0ciV_ZI'
            },
            body: JSON.stringify({
              response_as_dict: true,
              attributes_as_list: false,
              show_original_response: false,
              providers: 'google',
              text: title+subtitle
            })
        };
          
        fetch('https://api.edenai.run/v2/text/sentiment_analysis', options)
            .then(response => response.json())
            .then(response => {
                obj.sentiment = response.google.general_sentiment_rate
                push(ref(db, '/Ratings/' + driverUID), obj);
            })
            .catch(err => console.error(err));
    }
    
    useEffect(() => {
        if (initializing === false && user !== undefined){
            loadRatings();
        }
    }, [initializing, user]);

    return (
        <RatingsContext.Provider
            value={{
                ratings,
                addRatings
            }}>
            {children}
        </RatingsContext.Provider>
    );
};