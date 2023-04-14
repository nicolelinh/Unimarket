import React, { Component, useState } from "react";
import '../App.css';
import profilepic from '../assets/profilepic.png';
import '../css/userprofile.css';
import profilebackground from '../assets/profilebackground.png';
import userhistory from '../assets/userhistory.png';



    
      
class UserProfile extends Component {
        render() {
        document.title="UserProfile"
        
        return(
            <main>
                <section>
                    {/*container holds all information shown to user for their user profile*/}
                    <div className="profilecontainer">
                        <h1 className="userprofile">UniMarket UserProfile</h1>
                        <img className="profilepic" src={profilepic} alt="profilepic" id="profilepic"/>
                        <div className="userinformation">
                            {/*this is filler of which user information will show below*/}
                            <p className="userprofile">user information<br></br>user information</p>
                        </div>
                        {/*this will link to the user history page for the user to navigate towards*/}
                        <button className="userhistory"><a href="/userhistory"><img src={userhistory} alt="userhistory" id="userhistory"></img></a></button>
                    </div>
                    <img className="profilebackground" src={profilebackground} alt="profilebackground" id="profilebackground"/>
                </section>
            </main>
        )

    }
}

export default UserProfile;