import React, { Component, useEffect, useState } from "react";
import {doc, getDoc, deleteDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';

const ComparisonResult = () => {
    const did = window.location.pathname.split("/")[2];
    const did2 = window.location.pathname.split("/")[3];
    const [details, setDetails] = useState([]);
    const [details2, setDetails2] = useState([]);

    // Back function do redirect to previous page
    const goBack = () => {
        window.history.back();
    };

    // grabs the single document from db based on the document ID for first listing
    const getDetails = async () => {
        const docRef = doc(db, "marketListings", did); // getting document reference 
        await getDoc(docRef).then((docData)=>{
            const newData = docData.data();
            setDetails(newData);
            console.log(details, newData);
        })
    }

    // grabs the single document from db based on the document ID for second listing
    const getDetails2 = async () => {
        const docRef2 = doc(db, "marketListings", did2); // getting document reference 
        await getDoc(docRef2).then((docData)=>{
            const newData = docData.data();
            setDetails2(newData);
            console.log(details2, newData);
        })
    }
    

    useEffect(()=>{
        getDetails();       //first listing
        getDetails2();      //second listing
    }, []);

    const listings = [
        {
            price: details.price,
            title: details.title,
            seller: details.seller,
            description: details.description,
            photo: details.photo
        },
        {
            price: details2.price,
            title: details2.title,
            seller: details2.seller,
            description: details2.description,
            photo: details2.photo
        },
    ];

    return (
        <div>
            {/*Display everything inside of listing variables with spacing in between to clearly compare details between the selected listings*/}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {listings.map((listing, index) => (
                <div className="comparison-result">
                    <img src={listing.photo} alt="..." width="300" height="300"/>
                    <h2>{listing.title}</h2>
                    <p>Price: {listing.price}</p>
                    <p>Seller: {listing.seller}</p>
                    <p>{listing.description}</p>
                </div>
                ))}
            </div>
            <button onClick={goBack}>Go Back</button>
        </div>
      );
};
export default ComparisonResult;