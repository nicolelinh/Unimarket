import React, { useEffect, useState} from "react";
import {collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from "../components/listing";
import Fuse from "fuse.js";
import './tagsinput.css';

const Searchresults = () => {
    // get user inputted search by parsing url
    const did = window.location.pathname.split("/")[2];
    let search = did.replace(/_/g, " ");
    const [allItems, setAllItems] = useState([]);
    const [availableTags, setAvailableTags] = useState([
        "electronics", "books", "home", "clothes"
    ]);

    useEffect(()=>{
        const marketRef = collection(db, "marketListings");
        const Fetchdata = async () => {
            await getDocs(query(marketRef, orderBy('timeCreated', 'desc'))).then((querySnapshot)=>{
                const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
                const options = {
                    isCaseSensitive: false,
                    shouldSort: true,
                    findAllMatches: true,
                    threshold: 0.3,
                    keys: ['title', 'description']
                }
                const fuse = new Fuse(newData, options)
                const result = fuse.search(search).map((result) => result.item);
                setAllItems(result);
                console.log("searching for:", search, "results:", result);
            });
        }
        Fetchdata();
    }, [])

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
            window.location.href=("/search-results/"+searchBarInputURL);
            
        }
        return false;
    }

    function addTagToSearchBar(index) {
        console.log("clicked a tag");
    }

    document.title="Search Results";

    return (
        <div>
            <h3>Search Page </h3>
            <div className="container">
                <form className="d-flex search-form" onSubmit={(event) => {validateData(event)}}>
                        <input className="form-control me-2 search-input" id="usersearch" type="search" placeholder="search here" aria-label="Search" required></input>
                        <button className="search-btn btn-outline-success" type="submit" >search by filter</button>
                </form>
                {/* <div className="tags-input-container">
                    { availableTags.map((tag, index) => (
                        <div className="tag-item" key={index}>
                            <span className="text" onClick={() => addTagToSearchBar(index)}>{tag}</span>
                        </div>
                    )) }
                    
                </div> */}
                <div className="listings-cont">
                            <h3 className="listings-title"><em>Search results for: {search}</em></h3>

                            {/* dynamically create rows and columns based on how many listings are in database */}
                            <div className="row">
                                {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                                {
                                    allItems?.map((data, index)=>(
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
                            {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                            
                </div>
            </div>
        </div>
    )
}

export default Searchresults;