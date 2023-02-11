
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, getDoc, setDoc, doc, serverTimestamp, updateDoc, where, query, onSnapshot } from "firebase/firestore"
import { ChatContext } from "../context/ChatContext";
import Messages from "../components/chat/Messages"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"

import "../components/chat/chat.css"

function ChatPage() {
    //https://stackoverflow.com/questions/70076937/how-to-change-value-of-react-context-from-another-component-react
    const {currentUser} = useContext(AuthContext);
    const {currentChat} = useContext(ChatContext);
    const currentChatContext = useContext(ChatContext);


    let navigate = useNavigate(); 

    if (!currentUser) {
        navigate("/login");
    }

    if (!currentChat) {
        navigate("/chat")
    }


    const [chats, setChats] = useState([]);
    useEffect(() => {
        const getChats = () => {
            const chatDoc = onSnapshot(doc(db, "chatBetweenTwoUsers", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
            console.log(chats)

        return () => {
            chatDoc();
        }
    };
        if (currentUser.uid) {
            getChats()
        }

    }, [currentUser.uid]);
    

    const [messages, setMessages] = useState([]);

    const handleSelect = async(uid) => {
        const data = await getDoc(doc(db, "userInfo", uid));
        currentChatContext.changeCurrentChat(data.data())

        let combinedId = null;
        if (currentUser.uid > currentChat.uid) {
            combinedId = currentUser.uid + currentChat.uid
        } else {
            combinedId = currentChat.uid + currentUser.uid
        }
        
            const chatDoc = onSnapshot(doc(db, "chats", combinedId), (doc) => {
                setMessages(doc.data().messages)
            })
    
            return () => {
                chatDoc();
            }
    }


    return (
            
            <div className="chat-home">
            

            <div className="chat-container">
                    <div className="chat-sidebar">
                        
                        <h5 className="chat-recent">Recent</h5>
                        {Object.entries(chats).sort((first, second)=>second[1].date - first[1].date).map((chat) => {
                            return <div className="chat-userChat" 
                                    key={chat[0]}
                                    onClick={() => handleSelect(chat[1].uid)}>

                            <div className="chat-userChatInfo"> 
                                <span className="chat-span">{chat[1].userName}</span>
                                <p className="chat-p">{chat[1].lastMessage}</p>
                            </div>
                            
                            </div>
                        })}
                    </div>

                    <div className="chat-main">
                        <div className="chat-info">
                            <span className="chat-username">
                                {currentChatContext.currentChatUsername}
                            </span>
                        </div>
                        <div className="chat-messages">
                            {messages.map((m) => {
                                return <Message message={m} key={m.id} />
                            })}
                        </div>
                        
                        <div>
                            <ChatInput/>
                        </div>
                    </div>

                </div>
                </div>

    )
}

export default ChatPage;


