import React, { Component} from "react";
import {doc, getDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useLocation, Link } from "react-router-dom";
import './listingdetails.css';
import test from '../images/nintendo-switch-console.png';

// will display all listing details when a listing is clicked on from home page
class Listingdetails extends Component {
    constructor(props){
        super(props);
        this.state={
            seller: ''
        };
    }

    async componentDidMount(){
        // grabs document id from url
        const did = window.location.pathname.split("/")[2];
        const docRef = doc(db, "marketListings", did);
        const docSnap = await getDoc(docRef).then((docData)=>{
            console.log("Doc data: ", docData.data());
        });
        this.setState({seller: 'test'});
        console.log(this.state)
    }

    render(){
        const {st} = this.state;
        console.log('leilani:', );

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
                            <p>listing price </p>
                            <p>listing title </p>
                            <p>listing seller </p>
                            <p>listing description </p>
                            <button type="submit">dm user button</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Listingdetails;