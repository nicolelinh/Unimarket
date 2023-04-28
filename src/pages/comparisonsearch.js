import React, { useEffect, useState} from "react";
import { doc, collection, getDocs, orderBy, query, getDoc, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ComparisonListing from '../components/comparisonlisting';
import Landing from "./landing";
import '../App.css';
import '../css/home.css';

const ComparisonSearch = () => {
    const [info, setInfo] = useState([]);
    const did = window.location.pathname.split("/")[2];
    const [details, setDetails] = useState([]);

    // grabs the single document from db based on the document ID
    const getDetails = async () => {
        const docRef = doc(db, "marketListings", did); // getting document reference 
        await getDoc(docRef).then((docData)=>{
            const newData = docData.data();
            setDetails(newData);
            console.log(details, newData);
        })
    }

    useEffect(()=>{
        getDetails();
    }, []);

    window.addEventListener('load', () => {
        Fetchdata();
    });

    // grabs all documents in marketListings collection in db
    // need to filter/query db to only show listings from your school and by creation date? and those that arent yours? 
    const marketRef = collection(db, "marketListings");
    const Fetchdata = async () => {
        await getDocs(query(marketRef, where('__name__', '!=', did))).then((querySnapshot)=>{
            const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
            setInfo(newData);
            console.log(info, newData);
            console.log(did)
        })
    }

    useEffect(()=>{
        Fetchdata();
    }, []);

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
                            {/* Displays the first listing selected for comparison */}
                            <div style={{ justifyContent: 'normal' }}>
                                <div className="comparison-result">
                                    <img src={details.photo} alt="..." width="300" height="300"/>
                                    <h2>{details.title}</h2>
                                    <p>Price: {details.price}</p>
                                    <p>Seller: {details.seller}</p>
                                    <p>{details.description}</p>
                                </div>
                            </div>
                        <h3 className="listings-title"><em>most recent product listings</em></h3>

                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                info?.map((data, i)=>(
                                    // only allow 4 listings per column by dividing col by 3
                                    <div className="col-3">
                                        <ComparisonListing
                                        title={data.title}
                                        description={data.description}
                                        price={data.price}
                                        photo={data.photo}
                                        docid={data.id}
                                        did={did}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                        {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                        
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

export default ComparisonSearch;