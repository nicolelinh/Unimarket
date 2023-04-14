import React, { useState, useEffect } from 'react';
import '../css/carpoolrequest.css';
import { Link } from 'react-router-dom';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, addDoc, onSnapshot} from "firebase/firestore";

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
        await addDoc(collection(db, 'carpoolRequests'), { ...item, timestamp: new Date() });
        setItem({ name: '', location_from: '', location_to: '', pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: ''});
  }

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'carpoolRequests'), (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      setCarpoolRequests(requests); //lists items in array to be fetched and displayed later
    });
    return unsubscribe;
  }, []);
  
  // updates on general visual appeal. 
  return (
    <div className='container-carpool'>
      <br />
      <form onSubmit={addCarpool} style={{ background: 'linear-gradient(180deg, rgba(149, 185, 178, 0.9) 0%, rgba(233, 221, 192, 0.9) 100%)', borderRadius: '50px', padding: '20px', display: 'inline-block', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Carpool Request</h2>
        <Link className='carpool-link' to="/carpooldisplay">Redirect to Available Carpools</Link>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Name:
            <input
              type="text"
              name="name"
              value={item.name}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Phone Number:
            <input
              type="number"
              name="phone_number"
              value={item.phone_number}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Location from:
            <input
              type="text"
              name="location_from"
              value={item.location_from}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Location to:
            <input
              type="text"
              name="location_to"
              value={item.location_to}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Pick-up time/date:
            <input
              type="date"
              name="pick_up_time_date"
              value={new Date(item.pick_up_time_date).toLocaleDateString('en-CA')}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Est drive time:
            <input
              type="number"
              name="est_drive_time"
              value={item.est_drive_time}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            How many passengers:
            <input
              type="number"
              name="how_many_passengers"
              value={item.how_many_passengers}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <label style={{ flex: '0 0 100px' }}>
            Passenger note (optional):
            <input
              type="text"
              name="passenger_note"
              value={item.passenger_note}
              style={{ textAlign: 'center' }}
              onChange={handleChange}
            />
          </label>
        </div>
        <br />
        <button type="submit" onClick={handleCancel} style={{borderRadius: '5px', padding: '10px', border: 'none', color: '#84ad97', cursor: 'pointer', background: 'transparent', marginRight: 'auto' }}><h2 style={{ margin: '0', fontSize: '16px' }}>Cancel</h2></button>
        <button type="submit" style={{borderRadius: '5px', padding: '10px', border: 'none', color: '#84ad97', cursor: 'pointer', background: 'transparent', marginLeft: 'auto' }}><h2 style={{ margin: '0', fontSize: '16px' }}>Place Request</h2></button>
        <br></br>
        <br />
      </form>
    </div>
  );
};

export default RequestCarpool;
