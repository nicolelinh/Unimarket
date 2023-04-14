
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { getDoc, doc, onSnapshot } from "firebase/firestore"
import { ConvoContext } from "../context/ConvoContext";
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"

import "../css/chat.css"

function ChatPage() {
    //https://stackoverflow.com/questions/70076937/how-to-change-value-of-react-context-from-another-component-react
    const {currentUser} = useContext(AuthContext);
    const {currentConvo} = useContext(ConvoContext);
    const currentConvoContext = useContext(ConvoContext);

    // navigate is from the react-router-dom, used to change pages
    let navigate = useNavigate(); 

    // If we aren't loggedIn
    if (!currentUser) {
        navigate("/login");
    }

    // If we don't have someone we are currently chatting with
    if (!currentConvo) {
        navigate("/chat")
    }

    // Variable for holding our conversations
    const [chats, setChats] = useState([]);
    useEffect(() => {
        //React hook
        const getChats = () => {
            // onSnapshot is a firebase function that will listen and continually update when the database is updates
            // Needed because the UI changes as new messages are made
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

    }, [currentUser.uid]); // React hook dependency
    
    // Our array of messages variable
    const [messages, setMessages] = useState([]);

    const changeConvo = async(uid) => {
        // This function fires when clicking a certain user in the chat UI sidebar, so we find the user based on the id
        const data = await getDoc(doc(db, "userInfo", uid));
        // Setting the ChatContext to the information of the clicked user
        currentConvoContext.changeCurrentConvo(data.data())

        // Conversations are stored as a combination of the two ids, with the greater being first, this logic handles that
        let convoID = null;
        if (currentUser.uid > currentConvo.uid) {
            convoID = currentUser.uid + currentConvo.uid
        } else {
            convoID = currentConvo.uid + currentUser.uid
        }
            // Finding the conversation (array of messages) with the combined ID and setting it
            const chatDoc = onSnapshot(doc(db, "chats", convoID), (doc) => {
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

                        {/*The following below converts the chats object into an array and sorts it based off of date, then loops over it*/}
                        {/* Strategy taken for this sorting taken from here: https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property*/}
                        {/* Also referenced https://www.youtube.com/watch?v=k4mjF4sPITE*/}
                        {Object.entries(chats).sort((first, second)=>second[1].date - first[1].date).map((chat) => {
                            return <div className="chat-userChat" 
                                    onClick={() => changeConvo(chat[1].uid)}>

                            <div className="chat-userChatInfo"> 
                                <div className="chat-span">{chat[1].userName}</div>
                                <div className="chat-p">{chat[1].lastMessage}</div>
                            </div>
                            
                            </div>
                        })}
                    </div>

                    <div className="chat-main">
                        <div className="chat-info">
                            <span className="chat-username">
                                {currentConvoContext.currentConvoUsername}
                            </span>
                        </div>
                        <div className="chat-messages">
                            {/* Printing all messages, we render the message component created in another file. We pass the current message as an input to that component*/}
                            {messages.map((m) => {
                                return <Message data={m} />
                            })}
                        </div>
                        
                        <div> 
                            {/* Render the chatinput component, needed*/}
                            <ChatInput/>
                        </div>
                    </div>

                </div>
                <div className="background-chatpage"></div>
                </div>

    )
}

export default ChatPage;


