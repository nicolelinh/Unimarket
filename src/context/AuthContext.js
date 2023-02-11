import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig"
import { collection, getDoc, doc } from "firebase/firestore"


export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const userDoc = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)
        })

        return () => {
            userDoc();
        }
    }, []);



    return(
    <AuthContext.Provider value={{currentUser}}> 
        {children}
    </AuthContext.Provider>
    )
};