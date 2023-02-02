import React, { useEffect, useState } from "react";
import test from '../images/nintendo-switch-console.png';
import './listing.css';

const Listing = props => {

    return (
        <div class="card card-spacing" style={{"width": "18rem"}}>
            {/* will need to replace to imaage source with an actual img ot stock, but need to find how to store imgs in firestore db */}
            <img src={test} class="card-img-top" alt="..."/>
            <div class="card-body">
                <div class="card-title diamond-shape"><h5 className="listing-price">{ props.price }</h5></div>
                <p class="card-text">{ props.description }</p>
                <a href="#" >{props.title}</a>
            </div>
        </div>
    );
}

export default Listing;