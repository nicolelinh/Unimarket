import React, { useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from '../components/listing';
import Pagination from "../components/pagination";
import Landing from "./landing";
import '../App.css';
import './home.css';

const Home = () => {
    const [info, setInfo] = useState([]);

    window.addEventListener('load', () => {
        Fetchdata();
    });

    // grabs all documents in marketListings collection in db
    const Fetchdata = async () => {
        // need to filter/query db to only show listings from your school and by creation date? and those that arent yours? 
        await getDocs(collection(db, "marketListings")).then((querySnapshot)=>{
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

    document.title="Home";

    // if email is not empty, someone is signed in so it shows actual home page, NOT landing page
    if (email !== "") {
        return (
            <main>
            <section>
                <div className="padding container">
                    <h1 className="pill-form">Welcome {email}</h1>
                    <form className="d-flex search-form">
                        <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                        <button className="search-btn btn-outline-success" type="submit">search by filter</button>
                    </form>
                    <div className="row">
                        <div className="col col-spacing">
                            <h4 className="question-1"><em>need to sell or request a market item?</em></h4>
                            <h4 className="question-1"><em><a className="question-brown" href="/create-listing">sell</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="#">request</a></em></h4>
                        </div>
                        {/* <div className="col"></div> */}
                    </div>
                    <div className="row">
                        {/* <div className="col"></div> */}
                        <div className="col col-spacing">
                            <h4 className="question-2"><em>looking for carpool or other services?</em></h4>
                            <h4 className="question-2"><em><a className="question-brown" href="#">carpool</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="#">other services</a></em></h4>
                        </div>
                    </div>

                    <div className="listings-cont">
                        <h3 className="listings-title"><em>most recent product listings</em></h3>

                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                info?.map((data, i)=>(
                                    // only allow 4 listings per column by dividing col by 3 (col-3)because containers have 12 columns total
                                    <div className="col-3">
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
                        
                        {/* allow max of 4 listings per page to test, if over, then go to next page */}
                        <Pagination/>
                    </div>
                </div>
            </section>
        </main>
        )
    }
    else {
        return(
        <Landing/>
        )
    }
}

export default Home;