import React, { Component, useState, useEffect } from "react";
import '../App.css';
//import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'
import { doc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function SignUp() {
    // variables to set new email, password, username, and school
    const [newSchool, setNewSchool] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");


    const signUp = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, newEmail, newPassword)
            .then(async (userCredential) => {
                // Signed in 
                await sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log("email sent!");
                    });
                    await setDoc(doc(db, "userInfo", userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        school: newSchool,
                        username: newUserName
                    })
                

                console.log(userCredential.user);
                console.log(auth.currentUser.email);
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
                    <h3>Enter school:
                        <input
                            type="text"
                            placeholder="School..."
                            value={newSchool}
                            onChange={(event) => {
                                setNewSchool(event.target.value);
                            }}
                        />          
                    </h3>
                    </div>
                    <div>
                    <h3>Enter username:
                        <input
                            type="text"
                            placeholder="Username..."
                            value={newUserName}
                            onChange={(event) => {
                                setNewUserName(event.target.value);
                            }}
                        />          
                    </h3>
                    </div>
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