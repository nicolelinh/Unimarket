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
            console.error("error adding doc: ", e);
        }
    }

    return (
        <div>
            {/* Prototype page 15 */}
        </div>
    );
}

export default Createlisting;