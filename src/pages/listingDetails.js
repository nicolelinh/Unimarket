
import React, { Component, useEffect, useState, useContext } from "react";
import { addDoc, doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, Timestamp, increment } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateCurrentUser } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";
import './tagsinput.css';
import Error from "../components/error";
import '../css/listingdetails.css';

// will display all listing details when a listing is clicked on from home page
const Listingdetails = () => {
    const {currentUser} = useContext(AuthContext);
    let navigate = useNavigate(); 
    const did = window.location.pathname.split("/")[2];// get document id by parsing url
    const [details, setDetails] = useState([]);
    const [followingText, setFollowingText] = useState();

    useEffect(()=>{
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
                    //console.log(details, newData);
                })

        }
        getDetails();
    }, []);
    
    // checking if seller of listing is current user or not to display correct HTML
    let editButton;
    let listingButton; // this will either read "dm user" or "delete listing" based on who the seller is
    let submitEvent; // this will determine if user will delete the listing or be sent to "dm user" page...
    // checking is the seller of THIS listing is same as current user by checking emails since they're unique
    if (details.seller !== JSON.parse(window.localStorage.getItem('USER_EMAIL'))){
        listingButton = <button className="listingdetails-buttons" type="submit">dm user button</button>
        submitEvent = (event) => handleMessageSelect(event, details.seller); 
        
    } else {
        editButton = <button className="listingdetails-buttons" onClick={() => navigate(`/edit-listing/${did}`)}>Edit Listing</button>
    }

    //this is a button function for the user to save the item as a favorite to follow
    //it will add in the document id to a new collection, saving the user id and document id
    //the saved id's will help display all the items the user saved in the following page
    // Fetch the user's list items from Firestore
    
    //info needed to create favorite item
    const userid = currentUser.uid;
    const itemid = did;

    const addFavorite = async (event) =>{
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(db, "favorites"), {
                userid: userid,
                itemid: did
            })
            console.log("Document submitted successfully");
            alert("The item has been added to favorites!");
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

    const [email, setEmail] = useState(() => {
        // getting user details from local storage
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
    }, []);

    // makes sure search bar input is valid
    async function validateSearch(e) {
        e.preventDefault();

        var searchBarInput = document.getElementById('usersearch').value; // grabbing input from form below
        var searchBarInputURL = searchBarInput.replace(/\s/g, '_'); // replacing whitespace with an _ to create URL
        var searchBarLimit = document.getElementById('usersearch').value.length;
        var isValidSearch = false;

        if (searchBarLimit <= 40 || searchBarInput > 0) {
            isValidSearch = true;
        } else {
            alert('Search Bar character limit is 40 characters.');
        }

        if (isValidSearch) {
            console.log("redirecting to: " + searchBarInputURL);
            // removing tagsearch so previous results dont show up
            window.localStorage.removeItem('USER_TAGGABLESEARCH');
            //saving search bar input to local storage so it can be accessed and used in searchresults.js page
            window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            // takes user to /search-results/words_entered_in_search_bar
            window.location.href=("/search-results/"+searchBarInputURL);
        }
        return false;
    }
    
    document.title="Listing Details";

// if email is not empty, someone is signed in so it shows actual home page, NOT landing page
if (email !== "") {
    return (
        <center>
            <div className="listingdetails-background">
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
            {/* using bootstrap for search bar form */}
            <form className="d-flex search-form" onSubmit={(event) => {validateSearch(event)}}>
                <input className="form-control me-2 search-input" id="usersearch" type="search" placeholder="search here" aria-label="Search" required></input>
                <button className="search-btn btn-outline-success" type="submit" >search</button>
            </form>
            <br></br>
            <div className="listingdetails-querycard">
            <div className="row">
                <div className="col">
                    <img className= 'listingdetails-jpeg' src={details.photo} alt="..."/>
                    <br/>
                    <div className="listingdetails-padding1"></div>
                    <p><Link className="listingdetails-comparebtn" to={`/comparisonsearch/${did}`}>Compare Item</Link></p>
                </div>
                <div className="col">
                    <div className="listingdetails-padding2">
                        {/* uses details from document grabbed earlier to fill out elements below */}
                        <h4>Price: {details.price}</h4> 
                        <h4>Title:<br/> [ {details.title} ]</h4>
                        <h5>Seller:</h5>
                        <p><a className="listingdetails-userlink" href="#">{details.seller}</a></p> {/* TO-DO: link to user profile*/}
                        <p><button className="listingdetails-buttons" id="following" onClick={() => {handleFollow(details.seller)}}>{followingText}</button></p>
                        <h5>Description:</h5>
                        <p>{details.description}</p>
                        <h5>Tags:</h5>
                            <div className="tags-input-container">
                                    { details.tags?.map((tag, index) => (
                                        <div className="tag-item" id={index} key={index}>
                                            <span className="text">{tag}</span>
                                        </div>
                                    )) }
                            </div>
                            <br/>
                        {editButton}
                        {/* based on if listing belongs to current user, action of the button is different, as shown above */}
                        <form onSubmit={submitEvent}>{listingButton}</form>
                        <br></br>
                        <button className="listingdetails-buttons" onClick={addFavorite}>Add to Favorites</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </div>
        </center>
    )
} else {
        return(
            <Error/>
        )
    }
}

export default Listingdetails;