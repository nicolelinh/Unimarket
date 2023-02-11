

// import React, { useContext, useEffect, useState } from 'react';
// import { doc, onSnapshot } from 'firebase/firestore'
// import { db } from '../../firebaseConfig';
// import { ChatContext } from '../../context/ChatContext';
// import { AuthContext } from '../../context/AuthContext'
// import Message from "./Message"
// import { useNavigate, redirect } from "react-router-dom";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);

//   const {currentUser} = useContext(AuthContext);
//   const {currentChat} = useContext(ChatContext);
//   const currentChatContext = useContext(ChatContext);
//   let navigate = useNavigate(); 

//   if (!currentUser.uid || !currentChat.uid) {
//     redirect("/chat");
//   }

//   let combinedId = null
  
//   useEffect(() => {
//     if (!currentUser.uid || !currentChat.uid) {
//       navigate("/chat");
//     } 

//     // console.log("CURRENT USER ID: " + currentUser.uid)
//     // console.log("CURRENT CHAT ID: " + currentChat)
//         if (currentUser.uid > currentChat.uid) {
//             combinedId = currentUser.uid + currentChat.uid
//         } else {
//             combinedId = currentChat.uid + currentUser.uid
//         }
//         // console.log("COMBINEDID " + combinedId)


//     const unsub = onSnapshot(doc(db, "chats", combinedId), (doc) => {
//       if (doc.exists) {
//         console.log("DOC DATA: " + doc.data().messages)
//         setMessages(doc.data().messages)
//       }
//     })

//     return () => {
//       unsub();
//     }
//   }, [combinedId]);


//   return (
//     <div>
//       {/* {console.log("CURRENTUSER IN RETURN: " + currentUser.uid)}
//       {console.log("CURRENTCHAT IN RETURN: " + currentChat.uid)}
//       {console.log(messages.length)}
//       MessagesTest */}
//       {messages.map(m => {
//         {console.log(m.text)}
//         <Message message={m} key={m.id}/>
//       })}
//     </div>
//   )
// }

// export default Messages;