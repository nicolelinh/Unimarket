import React, { Component, useEffect, useState } from "react";
import {doc, getDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useLocation, Link } from "react-router-dom";
import './listingdetails.css';
import test from '../images/nintendo-switch-console.png';

// will display all listing details when a listing is clicked on from home page
const Listingdetails = () => {

    const [details, setDetails] = useState([]);

    const getDetails = async () => {
        // get document id by parsing url
        const did = window.location.pathname.split("/")[2];
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
    
    document.title="Listing Details";
    return (
        <div className="padding container">
            <form className="d-flex search-form">
                <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                <button className="search-btn btn-outline-success" type="submit">search by filter</button>
            </form>
            <div className="row row-style">
                <div className="col col-style">
                    <img src={test} class="col-style" alt="..."/>
                    <p>compare item link goes here</p>
                </div>
                <div className="col col-style">
                    <div>
                        <h4>{details.price}</h4> 
                        <h4>{details.title}</h4>
                        <h5>Seller:</h5>
                        <p><a href="#">{details.seller}</a></p>
                        <h5>Description:</h5>
                        <p>{details.description}</p>
                        <button type="submit">dm user button</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Listingdetails;