import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, setDoc, doc, updateDoc, Timestamp, query } from "firebase/firestore"
import '../App.css';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import haversine from 'haversine-distance';
// require('dotenv').config()


function Location() {
    const [search, setSearch] = useState("Enter your location below");
    const [locations, setLocations] = useState([])
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




    // Locations should be an object.
    // First item should be the string location extracted from the DB
    // Second item should be a link to the page

    window.addEventListener('load', () => {
        Fetchdata();
    });

    const marketRef = collection(db, "carpoolRequests");
    const Fetchdata = async () => {
        await getDocs(query(marketRef)).then((querySnapshot)=>{
            console.log('inside fetchdata')
            const newData = querySnapshot.docs.map(
                (doc) => ({...doc.data(), id:doc.id, })
            );
            let temp = []
            for (const l of newData) {
                temp.push({
                    location: l,
                    distance: 0
                })
            }
            console.log(temp)
            setLocations(temp);
        })
    }

    useEffect(() => {
        Fetchdata();
    }, [])


    // Function that invokes the google geocoding api
    const geocode = async (location) => {
        // axios for asynchronous api requests
        await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: API_KEY
            }
        })
        // error checking
        .then((res) => {
            if (res.data.status === 'ZERO_RESULTS') {
                console.log('Error: this location does not exist.');
                return null
            }
            console.log(res)
            return res
        })
        .catch((error) => {
            console.log(error)
        })
    }

    

    const handleClick = async (e, location) => {
        e.preventDefault();
        geocode(location).then((res) => {
            for (const l of locations) {
                const a = { latitude: l.location.coords.fromCoords.lat, longitude: l.location.coords.fromCoords.lng }
                const b = { latitude: res.data.results.geometry.location.lat, longitude: res.data.results.geometry.location.lng }
                console.log(haversine(a, b))
            }
        })

    
        

        // x.sort((first, second) => first.timeCreated - second.timeCreated)
        // locations.sort((first, second) => first.)

    }


    return (
        <main>
            <div>
                {locations.map((loc) => {
                    return (<p>{loc.location.location_from} to {loc.location.location_to} on {loc.location.pick_up_time_date} driven by <Link to={{pathname:`/carpool/${loc.id}`}} >{loc.location.name}</Link></p>)
                })}
            </div>
            {/* {console.log(locations)} */}
            {search}
            <form>
                <input onChange={(event) => {
                            setSearch(event.target.value);
                        }} type="search" placeholder="input location" aria-label="Search"></input>
                <button onClick={(e) => handleClick(e, search)} type="submit">enter your location</button>
            </form>


            {/* {console.log(locations)} */}
        </main>
    )
}

export default Location;