import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, setDoc, doc, updateDoc, Timestamp, query } from "firebase/firestore"
import '../App.css';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';


function Location() {
    const [search, setSearch] = useState("test");
    const [locations, setLocations] = useState([])


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
            setLocations(newData);
        })
        console.log('hello')
    }

    useEffect(() => {
        Fetchdata();
    }, [])


    const geocode = (location) => {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: location,
                key: null
            }
        })
        .then((res) => {
            if (res.data.status === 'ZERO_RESULTS') {
                console.log('Error: this location does not exist.')
            } else {
                console.log(res)
                console.log(res.data.results[0].geometry.location)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    

    const handleClick = (e, location) => {
        e.preventDefault();
        console.log('test')
        geocode(location);
    }


    return (
        <main>
            <div>
                {search}
            </div>
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