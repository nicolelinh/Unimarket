import React, { useEffect, useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import { db } from '../firebaseConfig';

const Createlisting = () => {
    // grabs user data from local storage
    const currUser = window.localStorage.getItem('USER_EMAIL');
    // info needed to create listing
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState([]);
    const [imageURL, setImageURL] = useState([]);

    // 
    useEffect(() => {
        // if no image has been uploaded, nothing will be previewed
        if (image.length < 1) return;
        const newImageURL = [];
        // adding image to array to save the URL
        image.forEach(img => newImageURL.push(URL.createObjectURL(img))); // creates temporary local source for img
        setImageURL(newImageURL);
    }, [image]);

    function onImageChange(e){
        setImage([...e.target.files]);
    }

    // adds listing to marketListings collection in database
    const addListing = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "marketListings"), {
                title: title,
                description: desc,
                price: price,
                seller: JSON.parse(currUser) // need to parse first or else string contains ""
            });
            console.log("Document submitted successfully");
            window.location.href='/listing-details/'+docRef.id; // on creation, redirect to the listing details user just created
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    document.title="Create Listing";
    return (
        <div className="padding container">
            <div className="row row-style">
                <div className="col col-style">
                    {/* allows user to upload an image and will preview that image back to the user, this maps image saved to img element */}
                    { imageURL.map(imageSrc => <img src={imageSrc} width="300" height="300" />) } 
                    <br></br>
                    <input type="file" onChange={onImageChange}></input> 
                </div>
                <div className="col col-style">
                    <div>
                        {/* sets all listing details on change event of each input area */}
                        <form style={{marginTop:"50px" }} onSubmit={(event) => {addListing(event)}}>
                            <h5>item title:</h5>
                            <input type="text" placeholder="title"
                            onChange={(e)=>{setTitle(e.target.value)}} />
                            <br/><br/>
                            <h5>item description:</h5>
                            <textarea type="text" placeholder="description"
                            onChange={(e)=>{setDesc(e.target.value)}}/>
                            <br/><br/>
                            <h5>item price:</h5>
                            <input type="text" placeholder="your price"
                            onChange={(e)=>{setPrice(e.target.value)}}/>
                            <br/><br/>
                            <button type="submit">list item</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Createlisting;