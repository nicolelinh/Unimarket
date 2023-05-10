import React, { useState, useContext, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import profilepic from "../assets/profilepic.png";
import "../css/userprofile.css";
import userhistory from "../assets/userhistory.png";
import { AuthContext } from "../context/AuthContext";

function UserProfile() {
  document.title = "UserProfile";
  const [userProfileData, setUserProfileData] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const uid = currentUser.uid;

  useEffect(() => {
    async function getUserProfileData() {
      try {
        const docRef = doc(db, "userInfo", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Data from Firebase:", data);
          setUserProfileData(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    }

    getUserProfileData();
  }, [uid]);

  console.log("UserProfileData:", userProfileData);

  return (
    <main>
      
      <body>
        <div className="profile-padding">
        <div className="profilecontainer">
          <img className="profilepic" src={profilepic} alt="profilepic" />
          <p className="userprofile-username">{userProfileData?.username}</p>
          <div className="userinformation">
            <p className="userprofile">
            school:<br></br>[ {userProfileData?.school} ]
              <br />
              email:<br></br>[ {userProfileData?.email} ]
            </p>
          </div>
          <div className="button-padding"></div>

          <button className="userhistory">
            <a href="/userhistory"><img src= {userhistory} alt="User History"/>
            </a>
          </button>
        </div>
        </div>
        </body>
        </main>
        );
        }
export default UserProfile;
