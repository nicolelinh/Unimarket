import React, { useState } from "react";
import '../css/signin.css';
import { auth } from '../firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";

function SignIn() {
    // variables to set new email and password
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    // sign in function
    const signIn = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, newEmail, newPassword)
        .then((userCredential) => {
            // Signed in 
            console.log(userCredential.user);
            // refreshes page after signed in to update navbar
            window.location.reload(true);
            // redirect to the home page after signing in
            window.location.href='/home';
        })
        .catch((error) => {
            alert(error);
        });
    };

    // visible portion of the page(buttons and input fields)
    return (
        <div className="main-container">
            <div className="SignIn">
                <h2>Sign In</h2>
                    <form onSubmit={signIn}>
                        <p>Welcome back to UniMarket</p>
                        <div className="userinput-container">
                            <div className="inputbox">
                            <h3 className="userinput">Enter email:</h3>
                            <input
                                type="email"
                                placeholder="Email..."
                                value={newEmail}
                                onChange={(event) => {
                                    setNewEmail(event.target.value);
                                }}
                            />          
                            </div>
                            <div className="inputbox">
                                <h3 className="userinput">Enter password:</h3>
                                <input
                                    type="password"
                                    placeholder="Password..."
                                    value={newPassword}
                                    onChange={(event) => {
                                        setNewPassword(event.target.value);
                                    }}
                                />

                            </div>
                        </div>
                    <button classname="forgotpass"><a href="/forgotpassword">forgotpassword</a></button>
                    <br></br>
                    <div className='singin-padding1'></div>
                    <button className="signinbutton" type="submit">Sign In</button>
                    </form>
            </div>
        </div>
    );
}

export default SignIn;