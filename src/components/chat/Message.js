// Message.jsx

import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
// This file is react component, which is used when rendering every single message.
// Import authContext so we know who the current logged in user is

const Message = ({data}) => {

    // Importing the current User context, needed to determine if the message belongs to whoever is currently logged in
    const { currentUser } = useContext(AuthContext)

    return (
        // It is crucial to know if the user sent the message or not. Messages are stylized according to who sent them,
        // Add a -owner to each class, if the currentUser is the message sender
        <div className={`chat-message-container ${data.senderId === currentUser.uid ? "chat-message-owner" : "chat-message"}`}>

            <div className={data.senderId === currentUser.uid ? "chat-message-div-owner" : "chat-message-div"}>
                <p className={data.senderId === currentUser.uid ? "chat-message-text-owner" : "chat-message-text"}>

                {/* && notation will only execute if the image exists */}
                {data.img && <img className={`chat-img ${data.senderId === currentUser.uid ? "chat-img-message-owner" : "chat-img-message"}`} src={data.img} alt="" />}
                    {data.text}
                </p>

            </div>
        </div>
    )
}

export default Message;