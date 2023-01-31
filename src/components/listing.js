import React, { Component } from "react";
import test from '../images/nintendo-switch-console.png';
import './listing.css';

class Listing extends Component {
    render() {
        return (
            <>
            <div class="card card-spacing" style={{"width": "18rem"}}>
                <img src={test} class="card-img-top" alt="..."/>
                <div class="card-body">
                    <div class="card-title diamond-shape"><h5 className="listing-price">$150</h5></div>
                    <p class="card-text">OLED nintendo switch, gray, in good condition</p>
                    <a href="#" >item name</a>
                </div>
            </div>
            </>
        )
    }
}

export default Listing;