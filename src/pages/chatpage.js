
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, setDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"

function ChatPage() {
    const {currentUser} = useContext(AuthContext);
    let navigate = useNavigate(); 

    if (!currentUser) {
        navigate("/login");
    }

    const [chats, setChats] = useState([]);

    const q = query(collection(db, "userChats"), where("capital", "==", true));

    useEffect(() => {
        const getChats = async () => {
            const data = await getDocs(usersChatsCollectionRef);
            setChats(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
            console.log(data);
        }
        getChats();
    }, []);


    return (

            <div>
                <h4>Logged in User: {currentUser.uid}</h4>
                {chats.map((chat) => {
                                return (
                                    <div>

                                        <h4>Chat: {chat.userInfo.uid}</h4>
                                    </div>
                                    );
                        })}
            </div>
    )
}

export default ChatPage;