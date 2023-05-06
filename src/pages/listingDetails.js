
import React, { Component, useEffect, useState, useContext } from "react";
import { addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, Timestamp, increment } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateCurrentUser } from "firebase/auth";



// will display all listing details when a listing is clicked on from home page
const Listingdetails = () => {
    // get document id by parsing url

    const {currentUser} = useContext(AuthContext);
    let navigate = useNavigate(); 
    const did = window.location.pathname.split("/")[2];
    const [details, setDetails] = useState([]);
    const [followingText, setFollowingText] = useState();


    // grabs the single document from db based on the document ID
    const getDetails = async () => {
        const docRef = doc(db, "marketListings", did); // getting document reference 
        
        // This increments twice, probably something to do with the way React renders components, leading to this
        // Code being run twice
        // Not a big deal and not worth rewriting stuff to fix this, since its still an accurate showing of how many
        // times something has been viewed
        await updateDoc(docRef, {
            views: increment(1)
        })

        await getDoc(docRef).then((docData)=>{
            const newData = docData.data();
            setDetails(newData);
        })

    }

    useEffect(()=>{
        getDetails();
    }, []);
    
    // checking if seller of listing is current user or not to display correct HTML
    let editButton;
    let listingButton; // this will either read "dm user" or "delete listing" based on who the seller is
    let submitEvent; // this will determine if user will delete the listing or be sent to "dm user" page...
    // checking is the seller of THIS listing is same as current user by checking emails since they're unique
    if (details.seller !== JSON.parse(window.localStorage.getItem('USER_EMAIL'))){
        listingButton = <button type="submit">dm user button</button>
        submitEvent = (event) => handleMessageSelect(event, details.seller); 
        
    } else {
        editButton = <Link to={{pathname:`/edit-listing/${did}`}}>edit</Link>
        listingButton = <button type="submit">delete listing</button>
        submitEvent = (event)=>deleteListing(event); // DELETES LISTING FROM DATABASE
    }

    // BE CAREFUL DEBUGGING!
    const deleteListing = async (e) => {
        e.preventDefault();

        try{
            // grabs the document in database by the document ID
            const docRef = doc(db, "marketListings", did);
            await deleteDoc(docRef); // deletes document
            console.log("Document successfully deleted! ");
            window.location.href='/home'; // takes user to home page once record has been deleted
        } catch(e){
            console.log("Error deleting document: ", e);
        } 
    }


    //this is a button function for the user to save the item as a favorite to follow
    //it will add in the document id to a new collection, saving the user id and document id
    //the saved id's will help display all the items the user saved in the following page
    // Fetch the user's list items from Firestore
    
    //info needed to create favorite item
    const userid = auth.currentUser.uid;
    const itemid = did;

    const addFavorite = async (event) =>{
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(db, "favorites"), {
                userid: userid,
                itemid: did
            })
            console.log("Document submitted successfully");
        } catch (event){
            console.error("Error adding document:", event);
        }
    }

    // ------------------------------------------------------------------Walid's Contribution-------------------------------------------------------------------------
    // React hook to dictate the text of the following button
    // We get the currently logged in User's ID, 
    // then set the text according to whether or not they are following or unfollowing
    useEffect(() => {
        async function setInitialFollowLogic() {
            const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
            if (userDoc.data().following.includes(details.seller)) {
                setFollowingText("Unfollow")
            } else {
                setFollowingText("Follow")
            }
        }
        setInitialFollowLogic();
    }, [details.seller]);

    // This is the button to handle the follow logic
    // We get the currently logged in user, then use a Firestore Query to check
    // whether or not the current listing's user is being followed
    // Then change button text accordingly
    const handleFollow = async (userEmail) => {
        const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
        if (!userDoc.data().following.includes(userEmail)) {
            await updateDoc(doc(db, "userInfo", currentUser.uid), { // Follow user if they are not in the following list
                following: arrayUnion(userEmail) // arrayUnion is an append
            });
            setFollowingText("Unfollow")
        } else {
            await updateDoc(doc(db, "userInfo", currentUser.uid), { // Remove if they are in the following list
                following: arrayRemove(userEmail)
            });
            setFollowingText("Follow")
        }
    }



    // Handles logic for message button
    const handleMessageSelect = async (event, userEmail) => {
        // https://stackoverflow.com/questions/58408111/firebase-firestore-query-get-one-result
        event.preventDefault();
        // Building the query for finding the user ID of the current page
        let userDoc;
        let dmUID;
        let dmUsername;
        try {
            userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
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
        if (currentUser.uid > dmUID) {

            convoID = currentUser.uid + dmUID;
        } else {
            convoID = dmUID + currentUser.uid;
        }
        const existingChat = await getDoc(doc(db, "messages", convoID));

        // If this is the first time being messaged, create a new conversation
        if (!existingChat.exists() && convoID) {
            await setDoc(doc(db, "messages", convoID), { messages: [] });

            // Update the database for both the currently logged in user and the clicked user to reflect the new conversation
            await updateDoc(doc(db, "userInfo", currentUser.uid), {
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
                    uid: currentUser.uid,
                    userName: userDoc.data().username, 
                    date: Timestamp.now(), 
                    lastMessage: "" 
                }
            });
        }
        // If the chat already exists, we are just taken to the chat page
        navigate('/chatpage');   
    }
    // -----------------------------------------------------------------End Walid's Contribution-----------------------------------------------------------


    document.title="Listing Details";

    return (
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}

            {/* using bootstrap for search bar form */}
            <form className="d-flex search-form">
                <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                <button className="search-btn btn-outline-success" type="submit">search by filter</button>
            </form>
            <div className="row">
                <div className="col">
                    <img src={details.photo} alt="..." width="300" height="300"/>
                    <p>compare item link goes here</p>
                </div>
                <div className="col">
                    <div>
                        {/* uses details from document grabbed earlier to fill out elements below */}
                        <h4>Price: {details.price}</h4> 
                        <h4>Title: {details.title}</h4>
                        <h5>Seller:</h5>
                        <p><a href="#">{details.seller}</a></p> {/* TO-DO: link to user profile*/}
                        <p><button id="following" onClick={() => {handleFollow(details.seller)}}>{followingText}</button></p>
                        <h5>Description:</h5>
                        <p>{details.description}</p>
                        {editButton}
                        {/* based on if listing belongs to current user, action of the button is different, as shown above */}
                        <form onSubmit={submitEvent}>{listingButton}</form>
                        <button onClick={addFavorite}>Add to Favorites</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listingdetails;