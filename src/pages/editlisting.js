import React, { useEffect, useState } from "react";
import {collection, updateDoc} from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import {doc, getDoc, deleteDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";

// will allow the user to edit a listing they've previously created
const Editlisting = () => {
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

    // info needed to update listing
    const [t, setTitle] = useState(String(details.title));
    const [d, setDesc] = useState(String(details.description));
    const [p, setPrice] = useState(String(details.price));

    // edits listing in marketListings collection in database
    const updateListing = async (e) => {
        e.preventDefault();

        try {
            console.log("title: "+t);
            // updating document in collection
            const docRef = await updateDoc(doc(db, "marketListings", did), {
                title: t,
                description: d,
                price: p,
                //photo: imgURL,
                timeUpdated: Date().toLocaleString()
            })
            console.log("Document updated successfully");
            window.location.href='/listing-details/'+did; // on update, redirect to the listing details user just created
            
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }

    document.title="Edit Listing"

    return (
        <div className="padding container"> {/* using grid system (className=container/row/col) for layout: https://react-bootstrap.github.io/layout/grid/*/}
            <div className="row">
                <div className="col">
                    {/* allows user to upload an image and will preview that image back to the user, this maps image saved to img element */}
                    
                </div>
                <div className="col">
                    <div>
                        {/* sets all listing details on change event of each input area */}
                        <form style={{marginTop:"50px" }} onSubmit={(event) => {updateListing(event)}}>
                            <h5>item title:</h5>
                            <input type="text" placeholder="title" defaultValue={details.title}
                            onChange={(e)=>{setTitle(e.target.value)}} required />
                            <br/><br/>
                            <h5>item description:</h5>
                            <textarea type="text" placeholder="description" defaultValue={details.description}
                            onChange={(e)=>{setDesc(e.target.value)}} required />
                            <br/><br/>
                            <h5>item price:</h5>
                            <input type="text" placeholder="$0" defaultValue={details.price}
                            onChange={(e)=>{setPrice(e.target.value)}} required />
                            <br/><br/>
                            <button type="submit">re-list item</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editlisting;