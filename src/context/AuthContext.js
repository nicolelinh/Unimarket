import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"
import { collection, getDoc, doc } from "firebase/firestore"

// Context is used to manage React states globally, we save the logged in User for usage throughout the site
export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        // Fetches the user from the database, used React hooks to set the user
        // This user's auth state is then persisted using React context
        const userDoc = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
        })

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