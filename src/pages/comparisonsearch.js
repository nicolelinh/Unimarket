import React, { useEffect, useState} from "react";
import { doc, collection, getDocs, query, getDoc, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import ComparisonListing from '../components/comparisonlisting';
import Landing from "./landing";
import '../css/comparisonsearch.css';

const ComparisonSearch = () => {
    // Majority of code is written by Leilani and was copied from home.js to complete Use Case #14
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

    // Checks searchbar for validity and redirects to the correct results
    async function validateSearch(e) {
        e.preventDefault();

        var searchBarInput = document.getElementById('usersearch').value; // grabbing input from form below
        var searchBarInputURL = searchBarInput.replace(/\s/g, '_'); // replacing whitespace with an _ to create URL
        var searchBarLimit = document.getElementById('usersearch').value.length;
        var isValidSearch = false;

        if (searchBarLimit <= 40 || searchBarInput > 0) {
            isValidSearch = true;
        } else {
            alert('Search Bar character limit is 40 characters.');
        }

        if (isValidSearch) {
            console.log("redirecting to: " + searchBarInputURL);
            // useEffect(()=>{
            //     window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            // }, [])

            // removing tagsearch so previous results dont show up
            window.localStorage.removeItem('USER_TAGGABLESEARCH');
            //saving search bar input to local storage so it can be accessed and used in searchresults.js page
            window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            // takes user to /search-results/words_entered_in_search_bar
            window.location.href=("/search-results/"+searchBarInputURL);
        }
        return false;
    }

    // sort listings on page (code written by Walid and copied code from home.js to develop Use Case #14)
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

    document.title="Home";

    // if email is not empty, someone is signed in so it shows actual home page, NOT landing page
    if (email !== "") {
        return (
            <main>
                <center>
            <body>
                <div className="comparisonsearch-background">
                <div className="padding container">
                    <h2>Choose an item to compare with:</h2>                                                                                                                                                                         
                    <div className="listings-cont">
                            {/* Displays the first listing selected for comparison */}
                            <div className='comparisonsearch-initialitem' style={{ justifyContent: 'normal' }}>
                                <div className="comparison-result">
                                    <img className='comparisonsearch-picture' src={details.photo} alt="..."/>
                                    <h2 className='comparisonsearch-itemtitle'>{details.title}</h2>
                                    <p>Price: {details.price}</p>
                                    <p>Seller: {details.seller}</p>
                                    <p>{details.description}</p>
                                </div>
                            </div>
                        <p className="comparisonsearch-searchtitle">product listings</p>
                            <select className="comparisonseatch-filter" onChange = {(e) => sortListings(e.target.value)}>
                                <option value="">order by</option>
                                <option value="newest">newest</option>
                                <option value="oldest">oldest</option>
                                <option value="most-viewed">most viewed</option>
                                <option value="least-viewed">least viewed</option>
                                <option value="lowest-price">lowest price</option>
                                <option value="highest-price">highest price</option>
                                {/* <option value="favorite-asc">most favorited</option> */}
                            </select>
                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="comparisonsearch-padding1"></div>
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                info?.map((data, index)=>(
                                    // only allow 4 listings per column by dividing col by 3
                                    <div className="col-3" key={index}>
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
                <div className="row">
                    <div className="col col-spacing">
                        <h4 className="question-3"><em>have something to say?</em></h4>
                        <h4 className="question-3"><em><a className="question-brown" href="/reviews">review</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/customerreport">report</a></em></h4>
                    </div>
                    {/* <div className="col"></div> */}
                </div>
                </div>
            </body>
            </center>
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