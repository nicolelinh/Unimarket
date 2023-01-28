import React, { Component, useState, useEffect } from "react";
import '../App.css';
//import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function SignUp() {
    // variables to set new email and password
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");


    const signUp = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, newEmail, newPassword)
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
        <div className="SignUp">
            <h2>Sign Up</h2>
                <form onSubmit={signUp}>
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
                <button type="submit"> Sign Up </button>
                </form>
        </div>
    );
}

export default SignUp;