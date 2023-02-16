import React, { useEffect, useState } from "react";
import test from '../images/nintendo-switch-console.png';
import './listing.css';
import { Link } from 'react-router-dom';

// Listing takes in props which are passed in from Home.js
const Listing = props => {

    return (
        <div class="card card-spacing" style={{"width": "18rem"}}>
            {/* will need to replace image src with an actual img NOT stock, but need to find how to store imgURLS in firestore db */}
            <img src={ props.photo} class="card-img-top" width="300" height="300" alt="..."/>
            <div class="card-body">
                {/* uses the passed in props to display the actual data in the HTML elements/tags*/}
                <div class="card-title diamond-shape"><h5 className="listing-price">{ props.price }</h5></div>
                <p class="card-text">{ props.description }</p>
                {/* using Link tag to make each listing details page unique by appending the document id to end of url */}
                <Link to={{pathname:`/listing-details/${props.docid}`, state: { currListing : props}}} >{props.title}</Link>
            </div>
        </div>
    );
}

export default Listing;