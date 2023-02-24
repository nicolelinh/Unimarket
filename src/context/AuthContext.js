// This file essentially does what the authdetails.js does. I didn't realize we already had this functionality.
// Messaging relies on this though, so I will leave it for now, but I might refactor the messaging to use
// authdetails.js instead of this file if I have time.

import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"
import { collection, getDoc, doc } from "firebase/firestore"

// Context is used to manage React states globally, we save the logged in User for usage throughout the site
export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    // Variable and setter for out current user
    const [currentUser, setCurrentUser] = useState({})

    // Referenced https://johnwcassidy.medium.com/firebase-authentication-hooks-and-context-d0e47395f402
    useEffect(() => {
        // Fetches the user from the database, used React hooks to set the user
        // This user's auth state is then persisted using React context
        const userDoc = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
        })

        // This part "cleans up" the React hook
        // https://dev.to/elijahtrillionz/cleaning-up-async-functions-in-reacts-useeffect-hook-unsubscribing-3dkk
        return () => {
            userDoc();
        }
    }, []);



    return(
    // The logged in user is passed into all children, which are our React components, making it accessible throughout the site
    <AuthContext.Provider value={{currentUser}}> 
        {children}
    </AuthContext.Provider>
    )
};