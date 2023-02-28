import React, { Component, useState, useEffect } from "react";
import '../App.css';
import { auth, db } from '../firebaseConfig'
import { doc, setDoc } from "firebase/firestore"
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    // variables to set new email and password
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const signIn = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, newEmail, newPassword)
        .then(async(userCredential) => {
            // Signed in 

            // On login, we possible create another database document which stores the conversations between two users
            // Do this in case of errors. It doesn't override, just creates incase it doesn't exist (using the merge keyword)
            // await setDoc(doc(db, "chatBetweenTwoUsers", userCredential.user.uid), {}, { merge: true });
            console.log(userCredential.user);
            // ...
        })
        .catch((error) => {
            console.log(error);
            // ..
        });
    };

    return (
        <div className="Login">
            <h2>Login</h2>
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
                <button type="submit"> Login </button>
                </form>
        </div>
    );
}

export default Login;