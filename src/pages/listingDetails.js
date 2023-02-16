import React, { Component, useEffect, useState } from "react";
import {doc, getDoc, deleteDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import './listingdetails.css';
import test from '../images/nintendo-switch-console.png';

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
    let listingButton; // this will either read "dm user" or "delete listing" based on who the seller is
    let submitEvent; // this will determine if user will delete the listing or be sent to "dm user" page...
    // checking is the seller of THIS listing is same as current user by checking emails since they're unique
    if (details.seller !== JSON.parse(window.localStorage.getItem('USER_EMAIL'))){
        listingButton = <button type="submit">dm user button</button>
        //submitEvent = navigate to dm user or similar....
        
    } else {
        listingButton = <button type="submit">delete listing</button>
        submitEvent = (event)=>deleteListing(event); // DELETES LISTING FROM DATABASE
    }

    // BE CAREFUL DEBUGGING!!!!!!!!!!
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

    document.title="Listing Details";
    return (
        <div className="padding container">
            <form className="d-flex search-form">
                <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                <button className="search-btn btn-outline-success" type="submit">search by filter</button>
            </form>
            <div className="row row-style">
                <div className="col col-style">
                    <img src={details.photo} class="col-style" alt="..."/>
                    <p>compare item link goes here</p>
                </div>
                <div className="col col-style">
                    <div>
                        {/* uses details from document grabbed earlier to fill out the HTML elements */}
                        <h4>{details.price}</h4> 
                        <h4>{details.title}</h4>
                        <h5>Seller:</h5>
                        <p><a href="#">{details.seller}</a></p>
                        <h5>Description:</h5>
                        <p>{details.description}</p>
                        {/* based on if listing belongs to current user, action of the button is different, as shown above */}
                        <form onSubmit={submitEvent}>{listingButton}</form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listingdetails;