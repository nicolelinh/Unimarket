import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect, useContext, useReducer } from "react";
import { db } from "../firebaseConfig"
import { collection, getDoc, setDoc, doc } from "firebase/firestore"


export const ChatContext = createContext()

export const ChatContextProvider = ({children}) => {
    // https://stackoverflow.com/questions/70076937/how-to-change-value-of-react-context-from-another-component-react

    const [currentChat, setCurrentChat] = useState({})
    const [currentMessages, setCurrentMessages] = useState([])
    const [currentChatUsername, setCurrentChatUsername] = useState()

    const changeCurrentChat = (user) => {
        if (user) {
            setCurrentChat(user)
            setCurrentChatUsername(user.username)
            // console.log(currentChatUsername)
        }
    }

    return(
    <ChatContext.Provider value={{currentChat, changeCurrentChat, currentChatUsername}}> 
        {children}
    </ChatContext.Provider>
    )
};

