import React, { Component, useState, useEffect } from "react";
import '../App.css';
//import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'
import { collection, getDocs, addDoc } from "firebase/firestore"

function SignUp() {
    // variables to set new email, password, and username
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");

    // creates an array type to store all information about each user
    const [users, setUsers] = useState([]);

    // gets data from the collection "users"
    const usersCollectionRef = collection(db, "users");

    // create users function
    const createUser = async () => {
    await addDoc(usersCollectionRef, {email: newEmail, password: newPassword, username: newUsername});
    }

    useEffect(() => {
    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        console.log(data);
    }
    getUsers();
    }, []);

    return (
        <div className="App">
            <h2>Sign Up!</h2>
                
                <div>
                    <h3>Enter email:
                    <input
                        placeholder="Email..."
                        onChange={(event) => {
                        setNewEmail(event.target.value);
                        }}
                    />          
                    </h3>
                </div>
                <div>
                    <h3> Enter password:
                    <input
                        placeholder="Password..."
                        onChange={(event) => {
                        setNewPassword(event.target.value);
                        }}
                    />
                    </h3>
                </div>
                <div>
                    <h3>Enter username:
                    <input
                        placeholder="Username..."
                        onChange={(event) => {
                        setNewUsername(event.target.value);
                        }}
                    />
                    </h3>
                </div>
                <button>Show existing users</button>
                <button onClick={createUser}> Create User </button>
                {users.map((user) => {
                    return (
                    <div>
                        <h4>Email: {user.email}</h4>
                        <h4>Password: {user.password}</h4>
                        <h4>Username: {user.username}</h4>
                    </div>
                    );
                })}
        </div>
    );
}

export default SignUp;