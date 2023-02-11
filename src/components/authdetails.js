import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

const AuthDetails = () => {
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


    return (
        <div>
            {authUser ? <p>{`Signed In as ${authUser.email}, Email Verified: ${auth.currentUser.emailVerified}`}</p> : <p>Signed Out</p>}
        </div>
    );
};

export default AuthDetails;