import React, { Component, useState, useEffect } from 'react';
import '../App.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, addDoc} from "firebase/firestore";

// setting up of inputs for a base level item request. 
const RequestItem = () => {
  const [item, setItem] = useState({ name: '', description: '', price: 0 });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  /*
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(item);
    // Submit the item data to database
    setItem({ name: '', description: '', price: 0 });
  };
  */

  // actual stage where the user inputs get transferred to a firebase item request folder. After submitting, inputs are reversed to their base version. 
  const addRequest = async (e) => {
        e.preventDefault();
        console.log(item);
        setItem({ name: '', description: '', price: 0 });
        const docRef = await addDoc(collection(db, "requestListings"), {
                item: item
        });
        docRef() //calling function to transfer user inputs to firebase folder. 
  }

  return (
    <form onSubmit={addRequest}>
      <h2>Create Item Request</h2>
      <label>
        Item Name:
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={item.price}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RequestItem;