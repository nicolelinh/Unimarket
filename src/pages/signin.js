import React, { useState } from "react";
import '../App.css';
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
            setNewEmail("");
            setNewPassword("");
            // refreshes page after signed in to update navbar
            window.location.reload(true);
        })
        .catch((error) => {
            console.log(error);
            // ..
        });
    };

    // visible portion of the page(buttons and input fields)
    return (
        <div className="SignIn">
            <h2>Sign In</h2>
                <form onSubmit={signIn}>
                    <div>
                    <h3>Enter email:
                    <input
                        type="email"
                        placeholder="Email..."
                        value={newEmail}
                        onChange={(event) => {
                            setNewEmail(event.target.value);
                        }}
                    />          
                    </h3>
                </div>
                <div>
                    <h3> Enter password:
                    <input
                        type="password"
                        placeholder="Password..."
                        value={newPassword}
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                        }}
                    />
                    </h3>
                </div>
                <button class="forgotpassword"><a href="/forgotpassword">forgotpassword</a></button>
                <button type="submit"> Sign In </button>
                </form>
        </div>
    );
}

export default SignIn;