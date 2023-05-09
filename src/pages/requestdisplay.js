import React, { useState, useEffect } from 'react';
import '../App.css';
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
    <form  style={{ backgroundColor: '#F8F8F8', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Requested Items:</h2>
      <table style={{ border: '1px solid black' }}>
        <thead>
          <tr style={{ border: '1px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>Buyer</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Quality</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Note</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Image</th>
          </tr>
        </thead>
        <tbody>
          {Requests.map((request, index) => {
            //console.log('request:', request);
            return (
              <tr key={index} style={{ border: '1px solid black' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.buyer}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.description}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.price}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.quality}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{request.merchant_note}</td>
                <img src={request.imageUrl} alt="..." width="300" height="300"/>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/request">Redirect to request an item!</Link>
    </form>
  );
};

export default RequestDisplay;
