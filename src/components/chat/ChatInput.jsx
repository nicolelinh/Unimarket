import React, { useState, useContext } from "react";
import { ConvoContext } from '../../context/ConvoContext';
import { AuthContext } from '../../context/AuthContext'
import { updateDoc, doc, arrayUnion, Timestamp } from "firebase/firestore";
import { db, storage } from '../../firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import "../chat/chatinput.css";

const ChatInput = () => {
    const [ text, setText ] = useState("")
    const [ img, setImg ] = useState(null)

    // Imports for context, used to globally preserve state changes in React
    // currentUser saves the current auth user logged in (Firebase auth, NOT the userInfo, so if you want user information, do a getDoc using currentUser.uid)
    const {currentUser} = useContext(AuthContext);
    // curretnChat saves the last user we had a conversation with. This is used to load messages. 
    const {currentConvo} = useContext(ConvoContext);

    // Function to generate a unique ID, used for generating an ID when successfully sending a message
    function generateId() {
        return "id" + Math.random().toString(16).slice(2)
    }

    // We store conversations between users as a combination of their two ID's.
    // We make the larger ID the first value
    let convoID = null;

    const handleSubmit = async() => {
        if (currentUser.uid > currentConvo.uid) {
            convoID = currentUser.uid + currentConvo.uid
        } else {
            convoID = currentConvo.uid + currentUser.uid
        }

        try {
            // If an image was uploaded
        if (img) {
            // Firebase reference to storage, takes an ID, which we generate with our function above
            const storageRef = ref(storage, generateId())
            // Firebase function needed to upload image
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                // In case we have an error
                (error) => {
                    console.log(error)
                    console.log("Error uploading chat image")
                }, () => {
                    // Firebase storage bucket generates a URL, which is stored in the database
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // Update the chat (holds all messages) with the message made
                        await updateDoc(doc(db, "chats", convoID), {
                            messages: arrayUnion({
                                id: generateId(), // unique id for the message
                                text: text, // Text entered
                                senderId: currentUser.uid, // ID of logged in User
                                date: Timestamp.now(), // time, needed for sorting
                                img: downloadURL // Img URL from the above function
                            })
                        })
                        
                        // update both chats with the message (lastmessage) and the time, for sorting
                        await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                            [convoID+".lastMessage"]: text, // dot (.) notation for saving nested data. Need to do this, otherwise ALL fields will get replaced
                            [convoID+".date"]: Timestamp.now()
                        })
                
                        await updateDoc(doc(db, "chatBetweenTwoUsers", currentConvo.uid), {
                            [convoID+".lastMessage"]: text, // dot (.) notation as explained in the above comment
                            [convoID+".date"]: Timestamp.now()
                        })
                    })
                }
            )
        } else {
            // If we don't have an image, do the same process above but without image data
            await updateDoc(doc(db, "chats", convoID), {
                messages: arrayUnion({ // Use arrayunion() firebase method to update an array, reference -> https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
                    id: generateId(),
                    text: text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            }).then(async () => {

                // updating both chats with the last message and the time for sorting
                await updateDoc(doc(db, "chatBetweenTwoUsers", currentUser.uid), {
                    [convoID+".lastMessage"]: text,
                    [convoID+".date"]: Timestamp.now()
                })
        
                await updateDoc(doc(db, "chatBetweenTwoUsers", currentConvo.uid), {
                    [convoID+".lastMessage"]: text,
                    [convoID+".date"]: Timestamp.now()
                })
            })
        }
        // https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
        // Update nested data, use dot (.) notation

        // Clear inputs for next message
        setText("")
        setImg(null)
    } catch (e) {
        // in case of an error
        console.log('error chatinput')
        console.log(e)
    }
    }


    // The rendered UI is shown below. This component is imported and used in other pages
    return (
        <div className="chat-input">
            <input className="chat-input-form" type="text" placeholder="text" onChange={e=>setText(e.target.value)} value={text}/>
            <div className="chat-submit">
                <input type="file" id="chat-img" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="chat-img" style={{ cursor: "pointer" }}> {/*This is not a button but behaves like one, 'pointer' indicates its clickable*/}
                    Image
                </label>
                <button className="chat-send" onClick={handleSubmit}>Send</button>
            </div>
            
        </div>
    )
}

export default ChatInput;

