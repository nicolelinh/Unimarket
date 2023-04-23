import React, {useState, useContext } from "react";
import {doc, getDoc} from "firebase/firestore";
import { db} from '../firebaseConfig';
import '../App.css';
import profilepic from '../assets/profilepic.png';
import '../css/userprofile.css';
import profilebackground from '../assets/profilebackground.png';
import userhistory from '../assets/userhistory.png';
import {AuthContext} from '../context/AuthContext';




    
      
function UserProfile () {
        document.title="UserProfile"
        const [email] = useState(() => {
            // getting user details from local storage
            const saved = window.localStorage.getItem('USER_EMAIL');
            const initialValue = JSON.parse(saved);
            return initialValue || "";
          }, []);
        
        const {currentUser} = useContext(AuthContext);
        const uid = currentUser.uid;
        
        

          
          

        return(
            <main>
                <section>
                    {/*container holds all information shown to user for their user profile*/}
                    <div className="profilecontainer">
                        <h1 className="userprofile">{email}</h1>
                        <img className="profilepic" src={profilepic} alt="profilepic" id="profilepic"/>
                        <div className="userinformation">
                            {/*this is filler of which user information will show below*/}
                            <p className="userprofile">{uid}<br></br>{currentUser.username}</p>
                        </div>
                        {/*this will link to the user history page for the user to navigate towards*/}
                        <button className="userhistory"><a href="/userhistory"><img src={userhistory} alt="userhistory" id="userhistory"></img></a></button>
                    </div>
                    <img className="profilebackground" src={profilebackground} alt="profilebackground" id="profilebackground"/>
                </section>
            </main>
        )

    }


export default UserProfile;