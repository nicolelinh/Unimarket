
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../firebaseConfig';
import { getDoc, doc, onSnapshot, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import Message from "../components/chat/Message";
import send from '../assets/send-arrow.png';

import "../css/chat.css"

function ChatPage() {
    //https://stackoverflow.com/questions/70076937/how-to-change-value-of-react-context-from-another-component-react
    const {currentUser} = useContext(AuthContext);

    const [ messages, setMessages ] = useState([]);
    const [ chats, setChats ] = useState([]);
    const [ convoID, setConvoID ] = useState([]);
    const [ text, setText ] = useState("");
    const [ image, setImage ] = useState(null);
    const [ currentChatUsername, setCurrentChatUsername] = useState("");
    const [ currentChatUid, setCurrentChatUid] = useState("");

    function generateId() {
        return "id" + Math.random().toString(16).slice(2)
    }

    let navigate = useNavigate(); 

    // If we aren't loggedIn
    if (!currentUser) {
        navigate("/login");
    }

    useEffect(() => {
        const getChats = () => {
            const chatDoc = onSnapshot(doc(db, "userInfo", currentUser.uid), (doc) => {
                setChats(doc.data().conversations);
            });

            return () => {
                chatDoc();
            }
        };
        if (currentUser.uid) {
            getChats()
        }

    }, [currentUser.uid]);


    const changeConvo = async(uid) => {
        // This function fires when clicking a certain user in the chat UI sidebar, so we find the user based on the id
        const data = await getDoc(doc(db, "userInfo", uid));
        console.log(data.data())
        if (data.data().username) {
            setCurrentChatUsername(data.data().username)
        }
        setCurrentChatUid(uid);

        // Conversations are stored as a combination of the two ids, with the greater being first, this logic handles that
        if (currentUser.uid > uid) {
            setConvoID(currentUser.uid + uid)
        } else {
            setConvoID(uid + currentUser.uid)
        }
            
        // Finding the conversation (array of messages) with the combined ID and setting it
        const chatDoc = onSnapshot(doc(db, "messages", convoID), (doc) => {
            setMessages(doc.data().messages)
        })
    
        return () => {
            chatDoc();
        }
    }

    const handleSubmit = async() => {
        if (image) {
            // Firebase reference to storage, takes an ID, which we generate with our function above
            const storageRef = ref(storage, 'messages/', generateId())
            // Firebase function needed to upload image
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on(
                (error) => {
                    alert('Erorr uploading image. Please try again')
                    console.log(error)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "messages", convoID), {
                            messages: arrayUnion({
                                text: text, 
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        }).then(async() => {
                            await updateDoc(doc(db, "userInfo", currentUser.uid), {
                                ["conversations."+convoID+".lastMessage"]: text,
                                ["conversations."+convoID+".date"]: Timestamp.now()
                            })
    
                            await updateDoc(doc(db, "userInfo", currentChatUid), {
                                ["conversations."+convoID+".lastMessage"]: text, 
                                ["conversations."+convoID+".date"]: Timestamp.now()
                            })
                        })
                    })
                }
            )
        } else {
            // If we don't have an image, do the same process above but without image data
            await updateDoc(doc(db, "messages", convoID), {
                messages: arrayUnion({ 
                    text: text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            }).then(async () => {

                // updating both chats with the last message and the time for sorting
                await updateDoc(doc(db, "userInfo", currentUser.uid), {
                    ["conversations."+convoID+".lastMessage"]: text,
                    ["conversations."+convoID+".date"]: Timestamp.now()
                })

                await updateDoc(doc(db, "userInfo", currentChatUid), {
                    ["conversations."+convoID+".lastMessage"]: text, // dot (.) notation as explained in the above comment
                    ["conversations."+convoID+".date"]: Timestamp.now()
                })
            })
        }
        setText("")
        setImage(null)
    }


    return (
        <main>
            <body>
            <div className="chat-background">
            <center>
            <div className="chat-border">
            <div className="chat-home">
            <div className="chat-container">
                    <div className="chat-sidebar">
                        
                        <h5 className="chat-recent">Recent</h5>

                        {/*The following below converts the chats object into an array and sorts it based off of date, then loops over it*/}
                        {/* Strategy taken for this sorting taken from here: https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property*/}
                        {/* Also referenced https://www.youtube.com/watch?v=k4mjF4sPITE*/}
                        {Object.entries(chats).sort((first, second)=>second[1].date - first[1].date).map((chat) => {
                            {console.log("chat")}
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
                                { currentChatUsername }
                            </span>
                        </div>
                        <div className="chat-messages">
                            {/* Printing all messages, we render the message component created in another file. We pass the current message as an input to that component*/}
                            {messages.length > 0 && messages.map((m) => {
                                {console.log('message')}
                                return <Message data={m} />
                            })}
                        </div>
                        
                        <div> 
                            <div className="chat-input">
                                <input className="chat-input-form" type="text" placeholder="text" onChange={(text) => setText(text.target.value)} value={text}/>
                                <div className="chat-submit">
                                <input type="file" id="chat-img" onChange={(image) => setImage(image.target.files[0])}/>
                                    <label htmlFor="chat-img" style={{ cursor: "pointer" }}>
                                        Image
                                    </label>
                                    <button className="chat-send" onClick={handleSubmit}><img src={send} alt="Send"/></button>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
                </center>
                </div>
            </body>
        </main>
            
    )
}

export default ChatPage;


