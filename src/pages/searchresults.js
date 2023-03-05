import React, { useEffect, useState} from "react";
import {collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from "../components/listing";

const Searchresults = () => {
    // get user inputted search by parsing url
    const did = window.location.pathname.split("/")[2];
    let search = did.replace(/_/g, " ");
    var searchBarInputQuery = search.split(" ");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(()=>{
        const marketRef = collection(db, "marketListings");
        const Fetchdata = async () => {
            // https://firebase.google.com/docs/firestore/query-data/queries 
            // right now only returns listings where title is EXACT as search bar input
            // firebase doesnt allow wildcard searching "WHERE title LIKE %search%"
            await getDocs(query(marketRef, where("title", "in", [search]))).then((querySnapshot)=>{
                const newSearchResults = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
                setSearchResults(newSearchResults);
                console.log("inside query 1", searchResults, newSearchResults);
            });
            // await getDocs(query(marketRef, where("description", "in", [search]))).then((querySnapshot)=>{
            //     const newSearchResults = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
            //     setSearchResults(newSearchResults);
            //     console.log("inside query 2", newSearchResults);
            // });
        }
        Fetchdata();
    }, [])

    document.title="Search Results";

    return (
        <div>
            <h3>Search Page </h3>
            <div className="container">
                <div className="listings-cont">
                            <h3 className="listings-title"><em>Search results for: {search}</em></h3>

                            {/* dynamically create rows and columns based on how many listings are in database */}
                            <div className="row">
                                {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                                {
                                    searchResults?.map((data, i)=>(
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
            </div>
        </div>
    )
}

export default Searchresults;