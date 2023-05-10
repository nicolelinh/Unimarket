// location.js
import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs, query } from "firebase/firestore"
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import haversine from 'haversine-distance';
import { Loader } from "@googlemaps/js-api-loader"
import '../css/location.css';

function Location() {
    const [search, setSearch] = useState("Where are you going to?");
    const [locations, setLocations] = useState([])
    const [API_KEY, setAPI_KEY] = useState()
    const [clicked, setClicked] = useState(false);

    let map;
    console.log(window.location.hostname);
    console.log(window.location.href);

    // Fetching api key from database, should not be plaintext in files
    const FetchKey = async () => {
        await getDocs(query(collection(db, "API_KEY"))).then((querySnapshot) => {
            const data = querySnapshot.docs.map(
                (doc) => ({...doc.data()})
            );
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
            // We store each location as an object with the location and its distance from the inputted location
            for (const l of newData) {
                temp.push({
                    location: l,
                    distance: 0,
                })
            }
            console.log(temp)
            setLocations(temp);
        })
    }

    useEffect(() => {
        Fetchdata();
    }, [])


    // When a user submits with a location
    const handleClick = async (e, location) => {
        let valid = true;
        e.preventDefault();
        let b;
        console.log('testign')
        await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: location,
                key: API_KEY,
            },
        }).then((res) => {
            // In the case of an invalid location
            if (res) {
                if (res.data.status === "ZERO_RESULTS") {
                    alert("This location does not exist. Please try again");
                    valid = false;
                } else {
                    console.log(res)
                    const lat = res.data.results[0].geometry.location.lat
                    const lng = res.data.results[0].geometry.location.lng
                    b = { latitude: lat, longitude: lng }
                }
            } else {
                alert('try again')
            }
        }).catch((err) => {
            console.log("An error occurred. Please refresh the page and try again.");
        });

        if (locations && valid) {
            let updateLocations = [];
            for (const l of locations) {
                console.log(l)
                const a = { latitude: l.location.coords.toCoords.lat, longitude: l.location.coords.toCoords.lng }
                // console.log(a)
                // console.log(b)
                // Haversine formula calculatres distance based off of latitude/longitude. I installed a package for this purpose
                const distance = haversine(a, b)
                updateLocations.push({
                    location: l.location,
                    distance: distance
                })
            }
            // Sorting locations based off of how close they are to the inputted destination
            updateLocations.sort((first, second) => first.distance - second.distance)
            setLocations(updateLocations);
        }

        // Creating the map with the google maps javascript api 
        if (API_KEY !== "" && valid) {
            const loader = new Loader({
                apiKey: API_KEY,
                version: "weekly",
            });
          
            loader.load().then(async () => {
                const { Map, InfoWindow } = await window.google.maps.importLibrary("maps");
                const { Marker } = await window.google.maps.importLibrary("marker");

                // Simple array which stores locations, determines if we need to add an offset in the case that locations are grouped
                let groupedLocations = [];

                
                const userPosition = {
                    lat: b.latitude,
                    lng: b.longitude,
                }
                groupedLocations.push(userPosition.lng);

                map = new Map(document.getElementById("map"), {
                    center: userPosition,
                    zoom: 10,
                });

                const userMarker = new Marker({
                    map: map,
                    position: userPosition,
                });

                const infoWindow = new InfoWindow({
                    content: "",
                    disableAutoPan: true,
                });

                userMarker.addListener("click", () => {
                    infoWindow.setContent("Your Desired Destination");
                    infoWindow.open(map, userMarker);
                });

                // In the case of multiple locations with the same coordinates, we add a small offset
                let offset = .001;
                for (const l of locations) {
                    let position = { 
                        lat: l.location.coords.toCoords.lat, 
                        lng: l.location.coords.toCoords.lng,
                    }

                    if (groupedLocations.includes(position.lng)) {
                        position.lng += offset;
                        // If the position already exists, increment the offsetfor the next possible one
                        offset += .001;
                    } else {
                        groupedLocations.push(position.lng)
                    }

                    // Creating the body of the marker
                    const contentString = 
                    `<h1>${l.location.location_from} to ${l.location.location_to}</h1>` +
                    '<div id="bodyContent">' +
                    `<p>Driven by ${l.location.name} on ${l.location.pick_up_time_date}</p>` +
                    `<p><a href="/carpool/${l.location.id}">View more details</a></p>` +
                    "</div>";

                    const markerWindow = new InfoWindow({
                        content: contentString,
                        disableAutoPan: true,
                    })

                    const toMarker = new Marker({
                        map: map,
                        position: position,
                    })

                    // toMarker.addListener("click", () => {
                    //     navigate(`/carpool/${l.location.id}`);            
                    // });

                    toMarker.addListener("click", () => {
                        // markerWindow.setContent(`${l.location.location_from} to ${l.location.location_to} (HERE) https://www.google.com/`);
                        markerWindow.open(map, toMarker);
                    });
                }
          });
        }
        setClicked(true);
    }


    return (
        <main>
            <center className="location-center">
            <div className="location-padding">
            <div style={{ height: '400px', width: '100%' }} id="map">
                <p class="pt-5">
                    All available carpools will load once a location is inputted below
                </p>
            </div>
            
            <div className="location-padding3">
            <div className='location-googlemap'>
                {clicked && locations.map((loc) => {
                    return (<p> <b>{loc.location.location_from}</b> to <b>{loc.location.location_to}</b> on {loc.location.pick_up_time_date} driven by <Link className="location-resultlinks"to={{pathname:`/carpool/${loc.location.id}`}} >{loc.location.name}</Link> </p>)
                })}
            </div>
            </div>
            <form>
                <input className="location-searchform" style={{ width: '50%' }} onChange={(event) => {
                            setSearch(event.target.value);
                        }} type="search" placeholder="Insert Location" aria-label="Insert location"></input>
                <div className="location-padding2">
                    <button class="location-searchbutton" onClick={(e) => handleClick(e, search)} type="submit">View map</button>
                </div>
            </form>
            </div>
            </center>
        </main>
    )
}

export default Location;