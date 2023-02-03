import React, { useEffect, useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useLocation, Link } from "react-router-dom";
import './listingdetails.css';

// will display all listing details when a listing is clicked on from home page
const Listingdetails = _ => {
    const did = window.location.pathname.split("/")[2];

    document.title="Listing Details";
    return (
        <div className="padding container">
            <form className="d-flex search-form">
                <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                <button className="search-btn btn-outline-success" type="submit">search by filter</button>
            </form>
            <div className="row row-style">
                <div className="col col-style">
                    <p>item image goes here</p>
                    <p>compare item link goes here</p>
                </div>
                <div className="col col-style">
                    <div>
                        <p>listing title</p>
                        <p>listing seller</p>
                        <p>listing description</p>
                        <p>dm user button</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listingdetails;