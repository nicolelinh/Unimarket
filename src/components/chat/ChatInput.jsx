import React, { Component, useState, useContext } from "react";
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext'
import { updateDoc, doc, arrayUnion, Timestamp, serverTimestamp } from "firebase/firestore";
import { db, storage } from '../../firebaseConfig';
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"



const ChatInput = () => {
    const [ text, setText ] = useState("")
    const [ img, setImg ] = useState(null)

    const {currentUser} = useContext(AuthContext);
    const {currentChat} = useContext(ChatContext);
    const currentChatContext = useContext(ChatContext);

    function generateId() {
        return "id" + Math.random().toString(16).slice(2)
    }


    let combinedId = null;

    const handleSend = async() => {
        if (currentUser.uid > currentChat.uid) {
            combinedId = currentUser.uid + currentChat.uid
        } else {
            combinedId = currentChat.uid + currentUser.uid
        }


        if (img) {
            const storageRef = ref(storage, uuid())
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                (error) => {
                    console.log(error)
                    console.log("Error uploading chat image")
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", combinedId), {
                            messages: arrayUnion({
                                id: generateId(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL
                            })
                        })
                        

                        await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                            [combinedId+".lastMessage"]: text,
                            [combinedId+".date"]: Timestamp.now()
                        })
                
                        await updateDoc(doc(db, "chatBetweenTwoUsers", currentChat.uid), {
                            [combinedId+".lastMessage"]: text,
                            [combinedId+".date"]: Timestamp.now()
                        })
                    })
                }
            )
        } else {
            await updateDoc(doc(db, "chats", combinedId), {
                messages: arrayUnion({
                    id: generateId(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            }).then(async () => {
                await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                    [combinedId+".lastMessage"]: text,
                    [combinedId+".date"]: Timestamp.now()
                })
        
                await updateDoc(doc(db, "chatBetweenTwoUsers", currentChat.uid), {
                    [combinedId+".lastMessage"]: text,
                    [combinedId+".date"]: Timestamp.now()
                })
            })
        }
        // https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
        // Update nested data, use dot (.) notation

        setText("")
        setImg(null)
    };


    return (
        <div className="chat-input">
            <input className="chat-input-form" type="text" placeholder="be nice :))" onChange={e=>setText(e.target.value)} value={text}/>
            <div className="chat-submit">
                <input type="file" id="chat-img" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="chat-img" style={{ cursor: "pointer" }}>
                    Image
                </label>
                <button className="" onClick={handleSend}>Send</button>
            </div>
            
        </div>
    )
}

export default ChatInput;

