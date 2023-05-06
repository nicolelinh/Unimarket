import React, { useEffect, useState} from "react";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from '../components/listing';
import Landing from "./landing";
import '../App.css';
import '../css/home.css';

const Home = () => {
    const [info, setInfo] = useState([]);

    window.addEventListener('load', () => {
        Fetchdata();
    });

    // grabs all documents in marketListings collection in db
    // need to filter/query db to only show listings from your school and by creation date? and those that arent yours? 
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
        console.log('INFO: ')
        console.log(info)
    }, [])

    const [email, setEmail] = useState(() => {
        // getting user details from local storage
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
      }, []);


    // Massive if/else chain is probbaly not the best way to approach this, but each sorting requirement is different
    //------------------------------------------------------------Walid's Contribution-----------------------------------------------------------------------
    const sortListings = (filter) => {
        const x = [...info]
        if (filter === "oldest") {
            x.sort((first, second) => first.timeCreated - second.timeCreated)
        }
        else if (filter === "newest") {
            x.sort((first, second) => second.timeCreated - first.timeCreated)
        }
        else if (filter === "lowest-price") {
            x.sort((first, second) => Number(first.price.slice(1)) - Number(second.price.slice(1)))
        }
        else if (filter === "highest-price") {
            x.sort((first, second) => Number(second.price.slice(1)) - Number(first.price.slice(1)))
        }
        else if (filter === "most-viewed") {
            x.sort((first, second) => second.views - first.views)
        } 
        else if (filter === "least-viewed") {
            x.sort((first, second) => first.views - second.views)
        }
        setInfo(x)
    }
    //--------------------------------------------------------------End Walid's Contribution------------------------------------------------------------------------


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
                            <h4 className="question-1"><em><a className="question-brown" href="/create-listing">sell</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/request">request</a></em></h4>
                        </div>
                        {/* <div className="col"></div> */}
                    </div>
                    <div className="row">
                        {/* <div className="col"></div> */}
                        <div className="col col-spacing">
                            <h4 className="question-2"><em>looking for carpool or other services?</em></h4>
                            <h4 className="question-2"><em><a className="question-brown" href="/carpoolrequest">carpool</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="#">other services</a></em></h4>
                        </div>
                    </div>
                    <div className="listings-cont">
                        <h3 className="listings-title"><em>most recent product listings</em> 
                        <select className="sort-metrics" onChange = {(e) => sortListings(e.target.value)}>
                            <option value="">order by</option>
                            <option value="newest">newest (default)</option>
                            <option value="oldest">oldest</option>
                            <option value="most-viewed">most viewed</option>
                            <option value="least-viewed">least viewed</option>
                            <option value="lowest-price">lowest price</option>
                            <option value="highest-price">highest price</option>
                            {/* <option value="favorite-asc">most favorited</option> */}
                        </select>
                        </h3>

                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                info?.map((data, i)=>(
                                    // only allow 4 listings per column by dividing col by 3
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
                        {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                        
                    </div>
                    <div className="row">
                        <div className="col col-spacing">
                            <h4 className="question-3"><em>have something to say?</em></h4>
                            <h4 className="question-3"><em><a className="question-brown" href="/reviews">review</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/customerreport">report</a></em></h4>
                        </div>
                        {/* <div className="col"></div> */}
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