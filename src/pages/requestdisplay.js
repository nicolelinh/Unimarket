import React, { useState, useEffect } from 'react';
import '../css/requestdisplay.css';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, onSnapshot} from "firebase/firestore";
import { Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// setting up of inputs for a base level carpool request. 
const RequestDisplay = () => {
  const [Requests, setRequests] = useState([]);

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requestListings'), (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      setRequests(requests);
    });
    return unsubscribe;
  }, []);
  
  return (
    <div className='requestdisplay-background'>
    <form  style={{ backgroundColor: 'transparent', padding: '20px', paddingTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className='requestdisplay-title'>Requested Items:</h2>
      <Link className='requestdisplay-redirectlink' to="/request">Redirect to request an item!</Link>
      <table style={{ border: '1px solid #A2A2A2' }}>
        <thead>
          <tr className='requestdisplay-columns' style={{ border: '1px solid #A2A2A2' }}>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Buyer</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Quality</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Note</th>
            <th style={{ border: '1px solid #A2A2A2', padding: '8px' }}>Image</th>
          </tr>
        </thead>
        <tbody>
          {Requests.map((request, index) => {
            //console.log('request:', request);
            return (
              <tr className='requestdisplay-item' key={index} style={{ border: '1px solid #A2A2A2' }}>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.buyer}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.description}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.price}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.quality}</td>
                <td style={{ border: '1px solid #A2A2A2', padding: '8px' }}>{request.merchant_note}</td>
                <img src={request.imageUrl} alt="..." width="300" height="300"/>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
    </div>
  );
};

export default RequestDisplay;
