import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, getDoc, setDoc, doc, updateDoc, Timestamp, query } from "firebase/firestore"
import '../App.css';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import haversine from 'haversine-distance';
import { getFunctions, httpsCallable } from "firebase/functions";
import { Loader } from "@googlemaps/js-api-loader"

function Location() {
    const [search, setSearch] = useState("Enter your location below");
    const [locations, setLocations] = useState([])
    const [API_KEY, setAPI_KEY] = useState()
    const functions = getFunctions();
    const geocode = httpsCallable(functions, 'geocode');

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
    // const geocode = async (location) => {
    //     // axios for asynchronous api requests
    //     await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    //         params: {
    //             address: location,
    //             key: API_KEY
    //         }
    //     })
    //     // error checking
    //     .then((res) => {
    //         if (res.data.status === 'ZERO_RESULTS') {
    //             console.log('Error: this location does not exist.');
    //             return null
    //         }
    //         console.log(res)
    //         return res
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // }

    

    const handleClick = async (e, location) => {
        e.preventDefault();
        let b;
        console.log('testign')
        await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: location,
                key: API_KEY,
            },
        }).then((res) => {
            if (res) {
                if (res.data.status === "ZERO_RESULTS") {
                    alert("This location does not exist. Please try again");
                } else {
                    console.log(res)
                    const lat = res.data.results[0].geometry.location.lat
                    const lng = res.data.results[0].geometry.location.lng
                    b = { latitude: lat, longitude: lng }
                }
            } else {
                alert('try again')
            }
        });

        if (locations) {
            let updateLocations = [];
            for (const l of locations) {
                console.log(l)
                const a = { latitude: l.location.coords.toCoords.lat, longitude: l.location.coords.toCoords.lng }
                // console.log(a)
                // console.log(b)
                const distance = haversine(a, b)
                updateLocations.push({
                    location: l.location,
                    distance: distance
                })
            }
            updateLocations.sort((first, second) => first.distance - second.distance)
            setLocations(updateLocations);
        }

        let map;
        if (API_KEY !== "") {
            const loader = new Loader({
                apiKey: API_KEY,
                version: "weekly",
            });
          
            loader.load().then(async () => {
                const { Map, InfoWindow } = await window.google.maps.importLibrary("maps");
                const { Marker } = await window.google.maps.importLibrary("marker")

                
    
                const userPosition = {
                    lat: b.latitude,
                    lng: b.longitude,
                }

                map = new Map(document.getElementById("map"), {
                    center: userPosition,
                    zoom: 10,
                });

                const userMarker = new Marker({
                    map: map,
                    position: userPosition,
                })

                const infoWindow = new InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });

                userMarker.addListener("click", () => {
                    infoWindow.setContent("Your Desired Destination");
                    infoWindow.open(map, userMarker);
                });


                for (const l of locations) {
                    const position = { 
                        lat: l.location.coords.toCoords.lat, 
                        lng: l.location.coords.toCoords.lng,
                    }

                    const toMarker = new Marker({
                        map: map,
                        position: position,
                    })

                    toMarker.addListener("click", () => {
                        infoWindow.setContent(`${l.location.location_from} to ${l.location.location_to} (HERE)`);
                        infoWindow.open(map, toMarker);
                    });
                }
          });
        }


    }


    return (
        <main>
            <div style={{ height: '400px', width: '100%' }} id="map">

            </div>
            <div>
                {locations.map((loc) => {
                    return (<p>{loc.location.location_from} to {loc.location.location_to} on {loc.location.pick_up_time_date} driven by <Link to={{pathname:`/carpool/${loc.id}`}} >{loc.location.name}</Link> distance of {loc.distance} </p>)
                })}
            </div>
            {search}
            <form>
                <input onChange={(event) => {
                            setSearch(event.target.value);
                        }} type="search" placeholder="where are you going" aria-label="Search"></input>
                <button onClick={(e) => handleClick(e, search)} type="submit">enter your location</button>
            </form>


            {/* {console.log(locations)} */}
        </main>
    )
}

export default Location;