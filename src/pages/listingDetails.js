import React, { Component, useEffect, useState, useContext } from "react";
import {collection, addDoc, doc, getDoc, deleteDoc, query, where, getDocs} from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateCurrentUser } from "firebase/auth";

// will display all listing details when a listing is clicked on from home page
const Listingdetails = () => {
    // get document id by parsing url
    const did = window.location.pathname.split("/")[2];
    const [details, setDetails] = useState([]);

    // grabs the single document from db based on the document ID
    const getDetails = async () => {
        const docRef = doc(db, "marketListings", did); // getting document reference 
        await getDoc(docRef).then((docData)=>{
            const newData = docData.data();
            setDetails(newData);
            console.log(details, newData);
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
        //submitEvent = navigate to dm user or similar....
        
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
                    <p><Link to={`/comparisonsearch/${did}`}>Compare Item</Link></p>
                </div>
                <div className="col">
                    <div>
                        {/* uses details from document grabbed earlier to fill out elements below */}
                        <h4>Price: {details.price}</h4> 
                        <h4>Title: {details.title}</h4>
                        <h5>Seller:</h5>
                        <p><a href="#">{details.seller}</a></p> {/* TO-DO: link to user profile*/}
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