import React, { Component, useState, useEffect } from 'react';
import '../App.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, addDoc} from "firebase/firestore";

// setting up of inputs for a base level carpool request. 
const RequestCarpool = () => {
  const [item, setItem] = useState({ name: '', location_from: '', location_to: '', pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  // cancel button function (still needs fixing to completely work)
  const handleCancel = (event) => {
    setItem({ name: '', location_from: '', location_to: '', pick_up_time_date:   'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
  };

  // addition of the user inputs into a single carpool listing request into the database folder. item (user inputs) is logged and transfered to the firebase. 
  const addCarpool = async (e) => {
        e.preventDefault();
        console.log(item);
        setItem({ name: '', location_from: '', location_to: '', pick_up_time_date:   'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
        const docRef = await addDoc(collection(db, "carpoolRequests"), {
                item: item
        });
        docRef()
  }

  return (
    <form onSubmit={addCarpool}>
      <h2>Create Carpool Request</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Location from:
        <textarea
          name="location_from"
          value={item.location_from}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Location to:
        <textarea
          name="location_to"
          value={item.location_to}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Pick-up time/date:
        <textarea
          name="pick_up_time_date"
          value={item.pick_up_time_date}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Est drive time:
        <input
          type="number"
          name="est_drive_time"
          value={item.est_drive_time}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        How many passengers:
        <input
          type="number"
          name="how_many_passengers"
          value={item.how_many_passengers}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Passenger note:
        <textarea
          name="passenger_note"
          value={item.passenger_note}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit" onClick={handleCancel}>Cancel</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RequestCarpool;