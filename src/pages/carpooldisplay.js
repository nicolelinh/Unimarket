import React, { useState, useEffect } from 'react';
import '../css/carpooldisplay.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, onSnapshot} from "firebase/firestore";
import { Link } from 'react-router-dom';

// setting up of inputs for a base level carpool request. 
const CarpoolDisplay = () => {
  const [carpoolRequests, setCarpoolRequests] = useState([]);

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'carpoolRequests'), (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
      setCarpoolRequests(requests);
    });
    return unsubscribe;
  }, []);

  const handleContactRequester = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  }
  
  return (

    <div className='carpooldisplay-padding'>
      <h2 className='carpooldisplay-title'>Available Carpools (For Drivers):</h2>
    <form className='carpooldisplay-form' style={{ backgroundColor: 'transparent', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <table className="carpooldisplay-table" style={{ border: '1px solid #A2A2A2' }}>
        <thead>
          <tr className="carpooldisplay-columns" style={{ border: '1px solid #A2A2A2' }}>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Location From</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Location To</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Pick-up Time/Date</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Est Drive Time</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>How Many Passengers</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Passenger Note</th>
          </tr>
        </thead>
        <tbody>
          {carpoolRequests.map((request, index) => {
            //console.log('request:', request);
            return (
              
              <tr className="carpooldisplay-row" key={index} style={{ border: '1px solid #A2A2A2' }}>
                {console.log(request)}
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>
                  <Link className='carpooldisplay-namelinks'to={{pathname:`/carpool/${request.id}`}} >{request.name}</Link>
                  {/* <a href="">{request.name}
                  </a> */}
                </td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.phone_number}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.location_from}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.location_to}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.pick_up_time_date}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.est_drive_time}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.how_many_passengers}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.passenger_note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='carpooldisplay-padding2'>
      <Link className='carpooldisplay-bottomlinks' to="/carpoolrequest">Redirect to request a carpool for yourself!</Link>
      <br></br>
      <Link className='carpooldisplay-bottomlinks' to="/location">Or find carpools close to you using our location services!</Link>
      </div>
    </form>
    
    </div>
  );
};

export default CarpoolDisplay;
