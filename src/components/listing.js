import React, { Component } from "react";
import test from '../images/nintendo-switch-console.png';

class Listing extends Component {
    render() {
        return (
            <>
            <h1>Create New Listing</h1>
            <div class="card" style={{"width": "18rem"}}>
                <img src={test} class="card-img-top" alt="..."/>
                <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
            </>
        )
    }
}

export default Listing;