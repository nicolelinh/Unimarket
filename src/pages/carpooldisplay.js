import React, { useState, useEffect } from 'react';
import '../App.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, onSnapshot} from "firebase/firestore";

// setting up of inputs for a base level carpool request. 
const CarpoolDisplay = () => {
  const [carpoolRequests, setCarpoolRequests] = useState([]);

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'carpoolRequests'), (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      setCarpoolRequests(requests);
    });
    return unsubscribe;
  }, []);

  const handleContactRequester = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  }
  
  return (
    <form  style={{ backgroundColor: '#F8F8F8', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Available Carpools (For Drivers):</h2>
      <table style={{ border: '1px solid black' }}>
        <thead>
          <tr style={{ border: '1px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Location From</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Location To</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Pick-up Time/Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Est Drive Time</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>How Many Passengers</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Passenger Note</th>
          </tr>
        </thead>
        <tbody>
          {carpoolRequests.map((request, index) => {
            //console.log('request:', request);
            return (
              <tr key={index} style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.phone_number}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.location_from}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.location_to}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.pick_up_time_date}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.est_drive_time}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.how_many_passengers}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.passenger_note}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}><button onClick={() => handleContactRequester(request.phone_number)}>Contact Requester</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};

export default CarpoolDisplay;