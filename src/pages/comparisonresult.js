import React, { useEffect, useState } from "react";
import { doc, updateDoc, setDoc, getDoc, getDocs, collection, query, where, Timestamp } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../css/comparisonresult.css';

const ComparisonResult = () => {
    const did = window.location.pathname.split("/")[2];
    const did2 = window.location.pathname.split("/")[3];
    const [details, setDetails] = useState([]);
    const [details2, setDetails2] = useState([]);
    let navigate = useNavigate(); 

    // Back function do redirect to previous page
    const goBack = () => {
        window.history.back();
    };

    // grabs the single document from db based on the document ID for first listing
    const getDetails = async () => {
        const docRef = doc(db, "marketListings", did); // getting document reference 
        await getDoc(docRef).then((docData)=>{
            const newData = docData.data();
            setDetails(newData);
            console.log(details, newData);
        })
    }

    // grabs the single document from db based on the document ID for second listing
    const getDetails2 = async () => {
        const docRef2 = doc(db, "marketListings", did2); // getting document reference 
        await getDoc(docRef2).then((docData)=>{
            const newData = docData.data();
            setDetails2(newData);
            console.log(details2, newData);
        })
    }
    
    useEffect(()=>{
        getDetails();       //first listing
        getDetails2();      //second listing
    }, []);

    const listings = [
        {
            price: details.price,
            title: details.title,
            seller: details.seller,
            description: details.description,
            photo: details.photo
        },
        {
            price: details2.price,
            title: details2.title,
            seller: details2.seller,
            description: details2.description,
            photo: details2.photo
        },
    ];

      // Handles logic for message button
  const handleMessageSelect = async (event, userEmail) => {
    // https://stackoverflow.com/questions/58408111/firebase-firestore-query-get-one-result
    event.preventDefault();
    // Building the query for finding the user ID of the current page
    let userDoc;
    let dmUID;
    let dmUsername;
    try {
        userDoc = await getDoc(doc(db, "userInfo", auth.currentUser.uid))
        const userInfoRef = collection(db, "userInfo");
        const q = query(userInfoRef, where("email", "==", userEmail)); // We know the email, but we need ID
        const querySnapshot = await getDocs(q);
        const x = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        dmUID = x[0].uid; // Since the query only returns ONE value (email is unique), first element of the array will hold the value
        dmUsername = x[0].username;
        console.log("DMUID " + dmUID)
    } catch (e) {
        alert("Error establishing a direct message. Please refresh and try again. If the error persists, please contact the user through other means (email or phone number)")
    }

    // A conversation in the database is identified by a combination of ID's
    // the greater of the ID is first, this logic handles that
    let convoID = null;
    if (auth.currentUser.uid > dmUID) {

        convoID = auth.currentUser.uid + dmUID;
    } else {
        convoID = dmUID + auth.currentUser.uid;
    }
    const existingChat = await getDoc(doc(db, "messages", convoID));

    // If this is the first time being messaged, create a new conversation
    if (!existingChat.exists() && convoID) {
        await setDoc(doc(db, "messages", convoID), { messages: [] });

        // Update the database for both the currently logged in user and the clicked user to reflect the new conversation
        await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
            ["conversations."+convoID]: {
                uid: dmUID,
                userName: dmUsername, // The clicked user's information
                date: Timestamp.now(), // Needed for sorting messages, (most recent)
                lastMessage: "" // Lastmessage for ease of access, needed in the UI
            }
        });

        // Update the database for the other user (listing page owner, NOT logged in user)
        await updateDoc(doc(db, "userInfo", dmUID), {
            ["conversations."+convoID]: {
                uid: auth.currentUser.uid,
                userName: userDoc.data().username, 
                date: Timestamp.now(), 
                lastMessage: "" 
            }
        });
    }
    // If the chat already exists, we are just taken to the chat page
    navigate('/chatpage');   
  }

    return (
        <div className="comparisonresult-background">
            {/*Display everything inside of listing variables with spacing in between to clearly compare details between the selected listings*/}
            <div className='comparisonresult-padding1'>
            {listings.map((listing, index) => (
                <div className="comparisonresult-result" key={index}>
                    <img className='comparisonresult-jpg' src={listing.photo} alt="..." width="300" height="300"/>
                    <h2 className="comparisinresult-itemtitle">{listing.title}</h2>
                    <p>Price: {listing.price}</p>
                    <p>Seller: {listing.seller}</p>
                    <p>{listing.description}</p>
                    <button className='comparisonresult-buttons' onClick={(event) =>handleMessageSelect(event, listing.seller)}>dm user button</button>
                </div>
                ))}
            </div>
            <button className='comparisonresult-buttons' onClick={goBack}>Go Back</button>
        </div>
      );
};
export default ComparisonResult;