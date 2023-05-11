import React, { useState, useEffect } from 'react';
import '../css/carpoolrequest.css';
import { Link, useNavigate } from 'react-router-dom';
// importing database link to carpool request listing, as well as the designated folder for inputs. 
import { db } from '../firebaseConfig';
import {collection, addDoc, onSnapshot, getDocs, query } from "firebase/firestore";
// import geocode from "../funcs/geocode"
import axios from 'axios';

// setting up of inputs for a base level carpool request. 
const RequestCarpool = () => {
  const currUser = window.localStorage.getItem('USER_EMAIL');
  const [item, setItem] = useState({ name: '', phone_number: '', location_from: '', location_to: '', pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
  const [carpoolRequests, setCarpoolRequests] = useState([]);

  const [API_KEY, setAPI_KEY] = useState()

  let navigate = useNavigate();

    const FetchKey = async () => {
        await getDocs(query(collection(db, "API_KEY"))).then((querySnapshot) => {
            const data = querySnapshot.docs.map(
                (doc) => ({...doc.data()})
            );
            console.log('test')
            console.log(data[0])
            setAPI_KEY(data[0].key)
        })
    }

    useEffect(() => {
        FetchKey();
    }, [])

  
  const handleChange = (event) => {
    setItem({ ...item, [event.target.name]: event.target.value });
  };

  // cancel button function (still needs fixing to completely work)
  const handleCancel = (event) => {
    setItem({ name: '', phone_number: '', location_from: '', location_to: '', pick_up_time_date:   'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: '' });
  };

  // ------------------------------------------------Walid's Contribution---------------------------------------------------------------------------------
  async function geocode(location) {
    // Invoking the google API
    return await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
          address: location,
          key: API_KEY
      }
    })
  }
  // addition of the user inputs into a single carpool listing request into the database folder. item (user inputs) is logged and transfered to the firebase. 
  const addCarpool = async (e) => {
        let valid = true;
        e.preventDefault();

        // don't use a geocoding function since I ran into some weird async
        let coords = {
          toCoords: {
            lat: 0,
            lng: 0,
          },
          fromCoords: {
            lat: 0,
            lng: 0,
          }
        }
        // To Location
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: item.location_to,
            key: API_KEY,
          }
        }).then((res) => {
          if (res.data.status === 'ZERO_RESULTS') {
            alert('Invalid "to" location! Please try again.')
            valid = false;
          } else {
            coords.toCoords.lat = res.data.results[0].geometry.location.lat;
            coords.toCoords.lng = res.data.results[0].geometry.location.lng;
          }
        }).catch((err) => {
          console.log(err);
          alert("An unknown error occurred. Please try again.");
        })

        // From Location
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: item.location_from,
            key: API_KEY,
          }
        }).then((res) => {
          if (res.data.status === 'ZERO_RESULTS') {
            alert('Invalid "from" location! Please try again.');
            valid = false;
          } else {
            coords.fromCoords.lat = res.data.results[0].geometry.location.lat;
            coords.fromCoords.lng = res.data.results[0].geometry.location.lng;
          }
        }).catch((err) => {
          console.log(err);
          alert("An unknown error occurred. Please try again.");
        })

        if (!valid) { return; }
        

        await addDoc(collection(db, 'carpoolRequests'), { ...item, timestamp: new Date(), seller: JSON.parse(currUser), coords
              // The lat and long are specifically stored in these locations
              // coords: {
              //   toCoords: {
              //     lat: toGeocode.data.results[0].geometry.location.lat,
              //     lng: toGeocode.data.results[0].geometry.location.lng
              //   },
              //   fromCoords: {
              //     lat: fromGeocode.data.results[0].geometry.location.lat,
              //     lng: fromGeocode.data.results[0].geometry.location.lng
              //   } 
              // }
            }).catch((err) => {
              console.log(err);
              alert("An unknown error occurred. Please refresh the page and try again.");
            });
          navigate("/carpooldisplay");

        // ------------------------------------------------End Walid's Contribution------------------------------------------------------------------------------------------
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
      <br/>
      <form className="carpoolrequest-form" onSubmit={addCarpool} style={{ borderRadius: '50px', padding: '20px', display: 'inline-block', flexDirection: 'column', alignItems: 'center' }}>
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
        <button className='carpoolrequest-buttons' type="submit" onClick={handleCancel}>Cancel</button>
        <button className='carpoolrequest-buttons' type="submit">Place Request</button>
        <br></br>
        <br />
      </form>
    </div>
  );
};

export default RequestCarpool;

