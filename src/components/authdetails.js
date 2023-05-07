import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

const AuthDetails = () => {
    // variable to set new current authorized user
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user){
                setAuthUser(user);
                //saving user info to local storage to reference throughout site
                window.localStorage.setItem('USER_EMAIL', JSON.stringify(user.email));
            }else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);
};

export default AuthDetails;