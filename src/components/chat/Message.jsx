import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const Message = ({message}) => {
    const { currentUser } = useContext(AuthContext)

    return (
        
        <div className={`chat-message-container ${message.senderId === currentUser.uid ? "chat-message-owner" : "chat-message"}`}>

            <div className={message.senderId === currentUser.uid ? "chat-message-div-owner" : "chat-message-div"}>
                <p className={message.senderId === currentUser.uid ? "chat-message-text-owner" : "chat-message-text"}>

                {message.img && <img className={`chat-img ${message.senderId === currentUser.uid ? "chat-img-message-owner" : "chat-img-message"}`} src={message.img} alt="" />}
                    {message.text}
                </p>

                {/* <p>
                    {message.img && <img className={`chat-img ${message.senderId === currentUser.uid ? "chat-img-message-owner" : "chat-img-message"}`} src={message.img} alt="" />}
                </p> */}
            </div>
        </div>
    )
}

export default Message;