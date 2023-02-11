
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { db } from '../firebaseConfig'
import { collection, getDocs, getDoc, setDoc, doc, serverTimestamp, updateDoc, query, where, Timestamp } from "firebase/firestore"
import '../App.css';
import ChatInput from '../components/chat/ChatInput.jsx'
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext"

// TODO:
// Fix bug where you need to click twice on a chat to render their messages (wtf)
// Notification when receiving a new message (how???)
// Integrate with other site components when they are completed (ex: message button on a listing page)
function Chat() {

    let navigate = useNavigate(); 
    const {currentUser} = useContext(AuthContext)
    const contextForChat = useContext(ChatContext)

    if (!currentUser) {
        navigate("/login")
    }

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "userInfo");

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getUsers();
    }, []);

    const handleSelect = async(user) => {
        let combinedId = null
        if (currentUser.uid > user.uid) {
            combinedId = currentUser.uid + user.uid
        } else {
            combinedId = user.uid + currentUser.uid
        }

        const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
        console.log(userDoc.data())

        await setDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {}, { merge: true });

        await setDoc(doc(db, "chatBetweenTwoUsers", userDoc.data().uid), {}, { merge: true });

        
        
        try {
            console.log(user.username)
            console.log(userDoc.data().username)
            const chatBetweenUsers = await getDoc(doc(db, "chats", combinedId))
            

            console.log(user.username)
            console.log(userDoc.data().username)
            if (!chatBetweenUsers.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                    [combinedId]: {
                        uid: user.uid,
                        userName: user.username,
                        date: Timestamp.now(),
                        lastMessage: ""
                    },
                });
    
                await updateDoc(doc(db, "chatBetweenTwoUsers", user.uid), {
                    [combinedId]: {
                        uid: currentUser.uid,
                        userName: userDoc.data().username,
                        date: Timestamp.now(),
                        lastMessage: ""
                    },
                });
            }


            contextForChat.changeCurrentChat(user)
            navigate("/chatpage") 
        } catch (err) {
            console.log("Error establishing a chat with this uer")
            console.log(err)
        }
            
    }

        return(
            <main>
                <section>
                    <div>
                        <h1>TEST!</h1>
                        {users.map((user) => {
                            if (user.uid !== currentUser.uid) {
                                return (
                                    <div key={user.uid}>
        
                                        <h4>Id: {user.uid}</h4>
                                        <button onClick={() => {handleSelect(user)}}>Chat with this user</button>
                                    </div>
                                    );
                            }
                        })}
                    </div>
                    
                </section>
            </main>
        )

    }

export default Chat;

