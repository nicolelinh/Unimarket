// carpoolDetails.js
import React, { useEffect, useState, useContext } from "react";
import { doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, Timestamp, increment } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader } from "@googlemaps/js-api-loader"
// import { Map, GoogleApiWrapper } from 'google-maps-react';
import '../css/carpooldetails.css';

const CarpoolDetails = () => {
    const [details, setDetails] = useState([]);
    const [API_KEY, setAPI_KEY] = useState("");

    const FetchKey = async () => {
        await getDocs(query(collection(db, "API_KEY"))).then((querySnapshot) => {
            const data = querySnapshot.docs.map(
                (doc) => ({...doc.data()})
            );
            console.log(data[0].key)
            setAPI_KEY(data[0].key)
        })
    }

    useEffect(() => {
        FetchKey();
    }, [])

    document.title = 'Carpool Details';
    const {currentUser} = useContext(AuthContext);
    let navigate = useNavigate(); 
    const did = window.location.pathname.split("/")[2];
    
    const getDetails = async () => {
        const docRef = doc(db, "carpoolRequests", did); 

        await getDoc(docRef).then((docData) => {
            const newData = docData.data();
            setDetails(newData);
            // console.log(details, newData);
        })

    }

    useEffect(()=>{
        getDetails();
    }, []);

    let listingButton; // this will either read "dm user" or "delete listing" based on who the seller is
    let submitEvent; // this will determine if user will delete the listing or be sent to "dm user" page...
    // checking is the seller of THIS listing is same as current user by checking emails since they're unique
    if (details && details.seller !== JSON.parse(window.localStorage.getItem('USER_EMAIL'))){
        listingButton = <button className="carpooldetails-dmbutton" type="submit">dm user button</button>
        submitEvent = (event) => handleMessageSelect(event, details.seller); 
    } else {
        listingButton = <button className="carpooldetails-dmbutton" type="submit">delete listing</button>
        submitEvent = (event)=>deleteListing(event); // DELETES LISTING FROM DATABASE
    }

    const deleteListing = async (e) => {
        e.preventDefault();
        try{
            // grabs the document in database by the document ID
            const docRef = doc(db, "carpoolRequests", did);
            await deleteDoc(docRef); // deletes document
            console.log("Document successfully deleted! ");
            window.location.href='/home'; // takes user to home page once record has been deleted
        } catch(e){
            console.log("Error deleting document: ", e);
        } 
    }

    const handleMessageSelect = async (event, userEmail) => {
        // https://stackoverflow.com/questions/58408111/firebase-firestore-query-get-one-result
        event.preventDefault();
        // Building the query for finding the user ID of the current page
        const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
        const userInfoRef = collection(db, "userInfo");
        const q = query(userInfoRef, where("email", "==", userEmail)); // We know the email, but we need ID
        const querySnapshot = await getDocs(q);
        const x = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }))
        const dmUID = x[0].uid // Since the query only returns ONE value (email is unique), first element of the array will hold the value

        // A conversation in the database is identified by a combination of ID's
        // the greater of the ID is first, this logic handles that
        let convoID = null;
        if (currentUser.uid > dmUID) {

            convoID = currentUser.uid + dmUID;
        } else {
            convoID = dmUID + currentUser.uid;
        }
        const existingChat = await getDoc(doc(db, "messages", convoID))

        // If this is the first time being messaged, create a new conversation
        if (!existingChat.exists() && convoID) {
            await setDoc(doc(db, "messages", convoID), { messages: [] });

            // Update the database for both the currently logged in user and the clicked user to reflect the new conversation
            await updateDoc(doc(db, "userInfo", currentUser.uid), {
                ["conversations."+convoID]: {
                    uid: dmUID,
                    userName: details.seller, // The clicked user's information
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


    // Using the Google maps JavaScript API to create a map
    let map;
    if (API_KEY !== "") {
        const loader = new Loader({
            apiKey: API_KEY,
            version: "weekly",
          });
          
          loader.load().then(async () => {
            const { Map, InfoWindow } = await window.google.maps.importLibrary("maps");
            const { Marker } = await window.google.maps.importLibrary("marker")
    
            // lat/lng position of our location
            const position = {
                lat: details.coords.fromCoords.lat,
                lng: details.coords.fromCoords.lng
            }
    
            // lat/lng position of the destination
            const toPosition = {
                lat: details.coords.toCoords.lat,
                lng: details.coords.toCoords.lng
            }
    
            const infoWindow = new InfoWindow({
                content: "",
                disableAutoPan: true,
            });
    
            
            map = new Map(document.getElementById("map"), {
              center: position,
              zoom: 10,
            });
    
            // Markers for both start and end locations
            const fromMarker = new Marker({
                map: map,
                position: position,
            })
            
            
            const toMarker = new Marker({
                map: map,
                position: toPosition,
            })
            
            // Markers that will open with a text box when clicked, showing both start and end locations
            fromMarker.addListener("click", () => {
                infoWindow.setContent("Starting Location");
                infoWindow.open(map, fromMarker);
            });
    
            toMarker.addListener("click", () => {
                infoWindow.setContent("Destination");
                infoWindow.open(map, toMarker);
            });
          });
    }
    

    return (
        <div className="carpooldetails-background">
            <center>
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
            <div className="row">
                <div className="col"style={{ height: '400px', width: '100%' }}id="map">
                </div>
                <div className="col">
                    <div className="carpooldetails-details">
                        {/* uses details from document grabbed earlier to fill out elements below */}
                        <h4 className="carpooldetails-name">Name: {details.name}</h4>
                        <h4 className="carpooldetails-subdetails">From: {details.location_from}</h4>
                        <h4 className="carpooldetails-subdetails">To: {details.location_to}</h4>
                        <h5 className="carpooldetails-subdetails">Contact:</h5>
                        <h6 className="carpooldetails-subdetails">[ {details.phone_number} ]</h6>
                        <p>{details.seller}</p> 
                        <div>
                            <div className="carpooldetails-buttonpadding">
                            <form onSubmit={submitEvent}>{listingButton}</form>
                            </div>
                        </div>
                        {/* <p><button id="following" onClick={() => {handleFollow(details.seller)}}>{followingText}</button></p> */}
                        <h5 className="carpooldetails-subdetails">Description:</h5>
                        {/* <p>{details.description}</p> */}
                        {/* {editButton} */}
                        {/* based on if listing belongs to current user, action of the button is different, as shown above */}
                        {/* <form onSubmit={submitEvent}>{listingButton}</form> */}
                    </div>
                </div>
            </div>
        </div>
        </center>
        </div>
    )
}

export default CarpoolDetails;