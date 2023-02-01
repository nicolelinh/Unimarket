import React, { useEffect, useState } from "react";
import {collection, addDoc} from "firebase/firestore";
import { db } from '../firebaseConfig';

const Createlisting = () => {
    const[title, setTitle] = useState("");
    const[desc, setDesc] = useState("");
    const[price, setPrice] = useState("");

    const addListing = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "marketListings"), {
                Title: title,
                Description: desc,
                Price: price
            });
            console.log("doc submitted successfully");
        } catch (e) {
            console.error("error addiing doc: ", e);
        }
    }

    return (
        <div>
            <center>
                <form style={{marginTop:"50px" }} onSubmit={(event) => {addListing(event)}}>
                    <input type="text" placeholder="your title"
                      onChange={(e)=>{setTitle(e.target.value)}} />
                      <br/><br/>
                    <input type="text" placeholder="your desc"
                      onChange={(e)=>{setDesc(e.target.value)}}/>
                      <br/><br/>
                    <input type="text" placeholder="your price"
                      onChange={(e)=>{setPrice(e.target.value)}}/>
                      <br/><br/>
                    <button type="submit">Submit</button>
                </form>
            </center>
        </div>
    );
}

export default Createlisting;