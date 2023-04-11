import React, { useState, useEffect } from 'react';
import '../css/carpoolrequest.css';
import { Link } from 'react-router-dom';
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

  const [toGeocode, setToGeocode] = useState([]);
  const [fromGeocode, setFromGeocode] = useState([]);
  const [API_KEY, setAPI_KEY] = useState()

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
        e.preventDefault();

        geocode(item.location_to).then(res => setToGeocode(res)).then(() => {
          if (toGeocode.data.status === 'ZERO_RESULTS') {
            alert('Invalid "to" location! Please try again')
          }
        });
        
        geocode(item.location_from).then(res => setFromGeocode(res)).then(() => {
          if (fromGeocode.data.status === 'ZERO_RESULTS') {
            alert('Invalid "from" location! Please try again')
          }
        })
        await addDoc(collection(db, 'carpoolRequests'), { ...item, timestamp: new Date(), seller: JSON.parse(currUser), 
              // The lat and long are specifically stored in these locations
              coords: {
                toCoords: {
                  lat: toGeocode.data.results[0].geometry.location.lat,
                  lng: toGeocode.data.results[0].geometry.location.lng
                },
                fromCoords: {
                  lat: fromGeocode.data.results[0].geometry.location.lat,
                  lng: fromGeocode.data.results[0].geometry.location.lng
                } 
              }
            }).catch((err) => {
              alert("An unknown error occurred. Please refresh the page and try again.")
            });


        // await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        //   params: {
        //     address: item.location_to,
        //     key: API_KEY
        //   }
        // }).then((res) => {
        //   if (res.data.status === 'ZERO_RESULTS') {
        //       console.log('Error: to location does not exist');
        //       setItem({location_to: 'Invalid Location! Please try again'})
        //       return;
        //   } else {
        //     setToGeocode(res)
        //   }

        // })
        // .catch((error) => {
        //   console.log(error)
        // })

        // await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        //   params: {
        //     address: item.location_from,
        //     key: API_KEY
        //   }
        // }).then((res) => {
        //   if (res.data.status === 'ZERO_RESULTS') {
        //       console.log('Error: from location does not exist');
        //       setItem({location_from: 'Invalid Location! Please try again'})
        //       return;
        //   } else {
        //     setFromGeocode(res)
        //   }
        // }).then(async() => {
        //   await addDoc(collection(db, 'carpoolRequests'), { ...item, timestamp: new Date(), seller: JSON.parse(currUser), 
        //     // The lat and long are specifically stored in these locations
        //     coords: {
        //       toCoords: {
        //         lat: toGeocode.data.results[0].geometry.location.lat,
        //         lng: toGeocode.data.results[0].geometry.location.lng
        //       },
        //       fromCoords: {
        //         lat: fromGeocode.data.results[0].geometry.location.lat,
        //         lng: fromGeocode.data.results[0].geometry.location.lng
        //       } 
        //     }
        //   });
        //   setItem({pick_up_time_date: 'mm/dd/yy', est_drive_time: 0, how_many_passengers: 0, passenger_note: ''});
        // }
        // )
        // .catch((error) => {
        //   console.log(error)
        // })
        

          





        // Geocoding both the to and from locations
        // geocode(item.location_to).then(res => setToGeocode(res)).then(() => {
        //   if (toGeocode.data.status === 'ZERO_RESULTS') {
        //     console.log('Invalid to Location');
        //   }
        // });
        // geocode(item.location_from).then(res => setFromGeocode(res)).then(() => {
        //   if (fromGeocode.data.status === 'ZERO_RESULTS') {
        //     console.log('Invalid from Location');
        //   }
        // })
        // console.log(toGeocode)
        // console.log(fromGeocode)


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
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        <button type="submit" onClick={handleCancel} style={{marginRight: '20px', backgroundColor: '#84ad97', borderRadius: '5px', padding: '10px', border: 'none', color: '#fff', cursor: 'pointer'}}>Cancel</button>
        <button type="submit" style={{backgroundColor: '#84ad97', borderRadius: '5px', padding: '10px', border: 'none', color: '#fff', cursor: 'pointer'}}>Place Request</button>
        <br></br>
        <br />
      </form>
    </div>
  );
};

export default RequestCarpool;
