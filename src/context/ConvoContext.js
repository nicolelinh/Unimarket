// ChatContext.js
import { createContext, useState } from "react";


export const ConvoContext = createContext()

// ConvoContext preserves the last conversation the user was having.
// A bit of a janky solution, since Context is ideally used for states needed throughout the site 
// Might look into finding a better solution later, but this works for now
export const ConvoContextProvider = ({children}) => {
    // https://stackoverflow.com/questions/70076937/how-to-change-value-of-react-context-from-another-component-react

    // React hooks for setting information
    const [currentConvo, setCurrentConvo] = useState({})
    // const [currentMessages, setCurrentMessages] = useState([])
    const [currentConvoUsername, setCurrentConvoUsername] = useState()

    // When using the context, we pass a user into this function. The passed user is who we want to chat with.
    // Referred to the above stackoverflow link for this solution.
    // Also save the username for ease of access, rather than doing queries
    const changeCurrentConvo = (user) => {
        if (user) {
            setCurrentConvo(user)
            setCurrentConvoUsername(user.username)
            // console.log(currentChatUsername)
        }
    }

    return(
    // Passing the context into the app, which allows the value to be accessed in all children
    <ConvoContext.Provider value={{currentConvo, changeCurrentConvo, currentConvoUsername}}> 
        {children}
    </ConvoContext.Provider>
    )
};

