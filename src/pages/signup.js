import React, { useState } from "react";
import '../App.css';
import '../css/signup.css';
import { auth, db } from '../firebaseConfig'
import { doc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import schoolsData from "../assets/schools.json"

function SignUp() {
    // variables to set new email, password, username, and school
    const [newSchool, setNewSchool] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");

    //sign up function
    const signUp = (event) => {
        event.preventDefault();
        console.log(newSchool, newUserName, newEmail, newPassword, newPhoneNumber)
        createUserWithEmailAndPassword(auth, newEmail, newPassword)
            .then(async (userCredential) => {
                // Signed in
                // Send verification email to user
                await sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log("email sent!");
                    });
                    await setDoc(doc(db, "userInfo", userCredential.user.uid), {
                        uid: userCredential.user.uid,
                        email: newEmail,
                        school: newSchool,
                        username: newUserName,
                        phoneNumber: newPhoneNumber,
                        conversations: {},
                        following: []
                    })
                    
                // On signup, create a new database document that will store all chats between two users for this particular user
                // It is not saved directly to the userInfo collection, so we use the users ID to reference it (one to one relationship)
                // await setDoc(doc(db, "chatBetweenTwoUsers", userCredential.user.uid), {});
                
                console.log(userCredential.user);
                console.log(auth.currentUser.email);
                
                //redirect to the home page once the sign up form is submitted
                window.location.href='/signin';
            })
            .catch((error) => {
                alert(error);
            });
    };
    
    // visible portion of the page(buttons and input fields)
    return (
        <div className="main-container">
        <div className="SignUp">
            <h2>Create an account</h2>
                <p className="desc">You must have a valid school email to use UniMarket</p>
                <p className="important">Important: * are required fields</p>
                <form className="signup-userinput" onSubmit={signUp}>
                    <div>
                    <h3>Enter school *:
                        <select type="school"
                                value={newSchool}
                                onChange={(event) => setNewSchool(event.target.value)} required>
                                <option value="">-- Select a school --</option>
                                {schoolsData.map((school) => (
                                    <option key={school.id} value={school.name}>
                                        {school.name}
                                    </option>
                                ))}
                        </select>
                    </h3>    
                    </div>
                    <div>
                    <h3>Enter username *:
                        <input
                            type="text"
                            placeholder="Username..."
                            value={newUserName}
                            onChange={(event) => {
                                setNewUserName(event.target.value);
                            }}
                            required
                        />          
                    </h3>
                    </div>
                    <div>
                    <h3>Enter email *:
                        <input
                            type="email"
                            placeholder="Email..."
                            value={newEmail}
                            onChange={(event) => {
                                setNewEmail(event.target.value);
                            }}
                            required
                        />          
                    </h3>
                    </div>
                    <div>
                        <h3> Enter password *:
                            <input
                                type="password"
                                placeholder="Password..."
                                value={newPassword}
                                onChange={(event) => {
                                    setNewPassword(event.target.value);
                                }}
                                required
                            />
                        </h3>
                    </div>
                    <div>
                        <h3> Enter phone number:
                            <input
                                type="text"
                                placeholder="Phone Number..."
                                value={newPhoneNumber}
                                onChange={(event) => {
                                    setNewPhoneNumber(event.target.value);
                                }}
                            />
                        </h3>
                    </div>
                    <button className="signupbutton" type="submit">Sign Up</button>
                </form>
        </div>
        </div>
    );
}

export default SignUp;