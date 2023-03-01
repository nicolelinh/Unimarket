import React, { useState, useEffect } from 'react';
import '../App.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, addDoc, getDocs, orderBy, query} from "firebase/firestore";

// setting up of inputs for a base level carpool request. 
const RequestCarpool = () => {
  const [item, setItem] = useState({ name: '', phone_number: '', location_from: '', location_to: '', pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
  const [carpoolRequests, setCarpoolRequests] = useState([]);

  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  // cancel button function (still needs fixing to completely work)
  const handleCancel = (event) => {
    setItem({ name: '', phone_number: '', location_from: '', location_to: '', pick_up_time_date:   'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
  };

  // addition of the user inputs into a single carpool listing request into the database folder. item (user inputs) is logged and transfered to the firebase. 
  const addCarpool = async (e) => {
        e.preventDefault();
        console.log(item);
        //setItem({ name: '', phone_number: '', location_from: '', location_to: '', pick_up_time_date:   'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
        await addDoc(collection(db, "carpoolRequests"), {
          item: item
        });
        setCarpoolRequests([...carpoolRequests, item]);
        setItem({ name: '', location_from: '', location_to: '', pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: ''});
  }

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "carpoolRequests"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data().item);
      });
      setCarpoolRequests(requests);
      //setItem(requests[0]);
      console.log(requests);
    }
    fetchData();
  }, []);
  
  return (
    <form onSubmit={addCarpool}>
      <h2>Create Carpool Request</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Name:
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Phone Number:
          <input
            type="number"
            name="phone_number"
            value={item.phone_number}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Location from:
          <textarea
            name="location_from"
            value={item.location_from}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Location to:
          <textarea
            name="location_to"
            value={item.location_to}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Pick-up time/date:
          <input
            type="date"
            name="pick_up_time_date"
            value={new Date(item.pick_up_time_date).toLocaleDateString('en-CA')}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Est drive time:
          <input
            type="number"
            name="est_drive_time"
            value={item.est_drive_time}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          How many passengers:
          <input
            type="number"
            name="how_many_passengers"
            value={item.how_many_passengers}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ flex: '0 0 100px' }}>
          Passenger note (optional):
          <textarea
            name="passenger_note"
            value={item.passenger_note}
            onChange={handleChange}
          />
        </label>
      </div>
      <br />
      <button type="submit" onClick={handleCancel}>Cancel</button>
      <button type="submit">Place Request</button>
      <br />
      <h2>For Carpool Drivers (Available Carpools):</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Location From</th>
            <th>Location To</th>
            <th>Pick-up Time/Date</th>
            <th>Est Drive Time</th>
            <th>How Many Passengers</th>
            <th>Passenger Note</th>
          </tr>
        </thead>
        <tbody>
          {carpoolRequests.map((request, index) => {
            console.log('request:', request);
            return (
              <tr key={index}>
                <td>{request.name}</td>
                <td>{request.phone_number}</td>
                <td>{request.location_from}</td>
                <td>{request.location_to}</td>
                <td>{request.pick_up_time_date}</td>
                <td>{request.est_drive_time}</td>
                <td>{request.how_many_passengers}</td>
                <td>{request.passenger_note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};

export default RequestCarpool;
