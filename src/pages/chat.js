
import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig'
import { collection, getDocs, getDoc, setDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import '../App.css';
import ChatInput from '../components/chat/ChatInput.jsx'
import { AuthContext } from "../context/AuthContext";


function Chat() {

    const {currentUser} = useContext(AuthContext)

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db, "userInfo");

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
            console.log(data);
        }
        getUsers();
    }, []);

    const handleSelect = async(user) => {
        console.log(user)
        console.log(currentUser.uid)
        console.log(user.uid)
        let combinedId = null
        if (currentUser.uid > user.uid) {
            combinedId = currentUser.uid + user.uid
        } else {
            combinedId = user.uid + currentUser.uid
        }
        try {
            const chatBetweenUsers = await getDoc(doc(db, "chats", combinedId))

            if (!chatBetweenUsers.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        email: user.email,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                })

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId+".userInfo"]: {
                        uid: currentUser.uid,
                        email: currentUser.email,
                    },
                    [combinedId+".date"]: serverTimestamp(),
                })
            } 
        } catch (err) {
            console.log("Error with establishing user chats")
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
                                    <div>
        
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

