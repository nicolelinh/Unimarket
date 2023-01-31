import React, { Component, useState, useEffect } from "react";
import '../App.css';
import { auth } from '../firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    // variables to set new email and password
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const signIn = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, newEmail, newPassword)
        .then((userCredential) => {
            // Signed in 
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