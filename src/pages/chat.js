// chat.js

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from '../firebaseConfig'
import { collection, getDocs, getDoc, setDoc, doc, updateDoc, Timestamp } from "firebase/firestore"
import '../App.css';
import { AuthContext } from "../context/AuthContext";
import { ConvoContext } from "../context/ConvoContext"
import "../css/chathome.css";


// TODO:
// Fix bug where you need to click twice on a chat to render their messages (wtf)
// Notification when receiving a new message (how???)
// Integrate with other site components when they are completed (ex: message button on a listing page)

// This page is a temporary listing of all current users, with buttons for going to the chatpage
// This will eventually be replaced, but is needed for testing.
// A lot of the functionality within this file will be used elsewhere
function Chat() {

    // naviagte is a React-router-dom import used to change page, in case of errors
    let navigate = useNavigate(); 

    // Importing our contexts (globally preserved states)
    const {currentUser} = useContext(AuthContext)
    const contextForConvo = useContext(ConvoContext)

    // Go to login if we aren't signed In
    if (!currentUser) {
        navigate("/login")
    }

    // Finding all users
    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "userInfo");

    // Using a React hook to update the users
    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getUsers();
    }, []);

    // Button logic
    const handleSelect = async(user) => {
        // The database stores a conversation between two users as a combined ID. The greater ID will be first.
        // This logic below finds that ID
        let convoID = null
        if (currentUser.uid > user.uid) {
            convoID = currentUser.uid + user.uid
        } else {
            convoID = user.uid + currentUser.uid
        }

        // Finding the current user (userInfo)
        const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
        // console.log(userDoc.data())

        // Creating a chat between both the currentUser and the clicked User (if it doesn't already exist -> (merge: true))
        await setDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {}, { merge: true });

        await setDoc(doc(db, "chatBetweenTwoUsers", userDoc.data().uid), {}, { merge: true });

        
        
        try {
            // console.log(user.username)
            // console.log(userDoc.data().username)

            // Create a chat (stores messages) between the two users (using the convoID calculated above)
            const chatBetweenUsers = await getDoc(doc(db, "chats", convoID))
            
            // console.log(user.username)
            // console.log(userDoc.data().username)

            // We might already have a chat between these two users
            if (!chatBetweenUsers.exists()) {
                // Setting the messages array to be empty, if a chat does NOT exist
                await setDoc(doc(db, "chats", convoID), { messages: [] });

                // Update the database for both the currently logged in user and the clicked user to reflect the new conversation
                // Note: strategy for database design referenced from the following video: https://www.youtube.com/watch?v=k4mjF4sPITE
                await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                    [convoID]: {
                        uid: user.uid,
                        userName: user.username, // The clicked user's information
                        date: Timestamp.now(), // Needed for sorting messages, (most recent)
                        lastMessage: "" // Lastmessage for ease of access, needed in the UI
                    },
                });
    
                await updateDoc(doc(db, "chatBetweenTwoUsers", user.uid), {
                    [convoID]: {
                        uid: currentUser.uid,
                        userName: userDoc.data().username, // The currently logged in user's information
                        date: Timestamp.now(),
                        lastMessage: ""
                    },
                });
            }

            // Set the currentChat user context (global state)
            contextForConvo.changeCurrentConvo(user)
            // Change to the chat page (UI for conversation)
            navigate("/chatpage") 
        } catch (err) {
            console.log("Error establishing a chat with this uer")
            console.log(err)
        }
            
    }

    // UI below, is not stylized because this page is temporary. 
    // The backend logic above and button logic below are the only important pieces
    // Will eventually be removed
        return(
            <main>
                <section>
                    <div className="container-mainchat">
                        <h1 className="mainchat-title">TEST!</h1>
                        {users.map((user) => {
                            // Don't show the currently logged in user
                            if (user.uid !== currentUser.uid) {
                                return (
                                    // Key is needed for React looping, just set it to ID since its unique
                                    <div className="usersegment-mainchat" key={user.uid}>
        
                                        <h4>Id: {user.uid}</h4>
                                        {/*Loop over all users, button with users info*/}
                                        <button className="mainchat-userbutton" onClick={() => {handleSelect(user)}}>Chat with this user</button>
                                    </div>
                                    );
                            }
                        })}
                    </div>
                    <div className="container-mainchat-background"></div>
                </section>
            </main>
        )

    }

export default Chat;

