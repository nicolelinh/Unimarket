import React from "react";
import { Link } from 'react-router-dom';
import './listing.css';

// Listing takes in props which are passed in from Home.js
const Listing = props => {

    // below is using bootstrap card styling: https://getbootstrap.com/docs/4.0/components/card/
    return (
        <div className="card card-spacing" style={{"width": "18rem"}}>
            <img src={ props.photo} className="card-img-top" width="300" height="300" alt="..."/>
            <div className="card-body">
                {/* uses the passed in props to display the actual data in the HTML elements/tags*/}
                <div className="card-title diamond-shape"><h5 className="listing-price">{ props.price }</h5></div>
                <p className="card-text">{ props.description }</p>
                {/* using Link tag to make each listing details page unique by appending the document id to end of url */}
                <Link to={{pathname:`/listing-details/${props.docid}`, state: { currListing : props}}} >{props.title}</Link>
            </div>
        </div>
    );
}

export default Listing;