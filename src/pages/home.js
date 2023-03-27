import React, { useEffect, useState} from "react";
import {collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from '../components/listing';
import Landing from "./landing";
import '../App.css';
import './home.css';

const Home = () => {
    const [info, setInfo] = useState([]);

    // window.addEventListener('load', () => {
    //     Fetchdata();
    // });

    // grabs all documents in marketListings collection in db
    const marketRef = collection(db, "marketListings");
    const Fetchdata = async () => {
        await getDocs(query(marketRef, orderBy("timeCreated", "desc"))).then((querySnapshot)=>{
            const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
            setInfo(newData);
            console.log(info, newData);
        })
    }

    useEffect(()=>{
        Fetchdata();
    }, [])

    const [email, setEmail] = useState(() => {
        // getting user details from local storage
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
    }, []);

    // makes sure search bar input is valid
    async function validateData(e) {
        e.preventDefault();

        var searchBarInput = document.getElementById('usersearch').value;
        var searchBarInputURL = searchBarInput.replace(/\s/g, '_');
        var searchBarLimit = document.getElementById('usersearch').value.length;
        var isValidSearch = false;

        if (searchBarLimit <= 40 || searchBarInput > 0) {
            isValidSearch = true;
        } else {
            alert('Search Bar character limit is 40 characters.');
        }

        if (isValidSearch) {
            // takes user to /search-results/words_entered_in_search_bar
            console.log("redirecting to: " + searchBarInputURL);
            // useEffect(()=>{
            //     window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            // }, [])
            window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            window.location.href=("/search-results/"+searchBarInputURL);
        }
        return false;
    }

    document.title="Home";

    // if email is not empty, someone is signed in so it shows actual home page, NOT landing page
    if (email !== "") {
        return (
            <main>
                <section>
                    <div className="padding container">
                        <h1 className="pill-form">Welcome {email}</h1>
                        <form className="d-flex search-form" onSubmit={(event) => {validateData(event)}}>
                            <input className="form-control me-2 search-input" id="usersearch" type="search" placeholder="search here" aria-label="Search" required></input>
                            <button className="search-btn btn-outline-success" type="submit" >search by filter</button>
                        </form>
                        <div className="row">
                            <div className="col col-spacing">
                                <h4 className="question-1"><em>need to sell or request a market item?</em></h4>
                                <h4 className="question-1"><em><a className="question-brown" href="/create-listing">sell</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/create-request">request</a></em></h4>
                            </div>
                            {/* <div className="col"></div> */}
                        </div>
                        <div className="row">
                            {/* <div className="col"></div> */}
                            <div className="col col-spacing">
                                <h4 className="question-2"><em>looking for carpool or other services?</em></h4>
                                <h4 className="question-2"><em><a className="question-brown" href="/create-carpool-request">carpool</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/">other services</a></em></h4>
                            </div>
                        </div>
                        <div className="listings-cont">
                            <h3 className="listings-title"><em>most recent product listings</em></h3>

                            {/* dynamically create rows and columns based on how many listings are in database */}
                            <div className="row">
                                {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                                {
                                    info?.map((data, index)=>(
                                        // only allow 4 listings per column by dividing col by 3
                                        <div className="col-3" key={index}>
                                            <Listing
                                            title={data.title}
                                            description={data.description}
                                            price={data.price}
                                            photo={data.photo}
                                            docid={data.id}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    } else {
        return(
            <Landing/>
        )
    }
}

export default Home;