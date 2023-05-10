import React, { useEffect, useState} from "react";
import {collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from "../components/listing";
import Fuse from "fuse.js";
import './tagsinput.css';
import Error from "../components/error";
import '../css/searchresults.css';

const Searchresults = () => {
    // get user inputted search by parsing url
    const did = window.location.pathname.split("/")[2]; 
    let search = did.replace(/_/g, " "); // displayed to user at the top of the search results

    // get user inputted search by checking local storage
    const inputSearch = JSON.parse(window.localStorage.getItem('USER_SEARCHBARINPUT'));
    const tagSearch = JSON.parse(window.localStorage.getItem('USER_TAGGABLESEARCH'));
    const marketRef = collection(db, "marketListings");
    const [allListings, setAllListings] = useState([]);
    const [userTags, setUserTags] = useState([]); 
    // static list of available tags user can choose from
    const [searchTags] = useState([
        "electronics", "books", "home", "furniture", "clothing & shoes", "pets", "music & movies", "video games", "school supplies"
    ]);

    useEffect(()=>{
        // if searching by keywords, checks if localstorage has any words user inputted
        if (inputSearch) {
            console.log("made it into inputsearch!!");
            const fetchKeywordData = async () => {
                // order by timeCreated which is a TimeStamp data type in firestore db
                await getDocs(query(marketRef, orderBy('timeCreated', 'desc'))).then((querySnapshot)=>{
                    const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
                    // options is setting the "settings" of the Fuse.js component
                    const options = {
                        isCaseSensitive: false, // Indicates whether comparisons should be case sensitive
                        shouldSort: true, // Whether to sort the result list, by score
                        findAllMatches: true, // When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string
                        threshold: 0.3, // At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything
                        keys: ['title', 'description'] // Name of key fields in the search collection that should be searched
                    }
                    const fuse = new Fuse(newData, options); // configuring 
                    const result = fuse.search(search).map((result) => result.item); // mapping results into readable format
                    setAllListings(result);
                    console.log("searching for:", search, "results:", result);
                });
            }
            fetchKeywordData();
            // removes key from local storage since input/data is no longer needed after searching has been done 
            //window.localStorage.removeItem('USER_SEARCHBARINPUT');
        }
        // if searching by tags, checks if localstorage has any tags user chose
        if (tagSearch) {
            console.log("made it into tagSearch!!");
            const fetchTagsData = async () => {
                // checks if "tags" field contains any of the tags selected, order by timeCreated which is a TimeStamp data type in firestore db
                await getDocs(query(marketRef, where('tags', 'array-contains-any', tagSearch))).then((querySnapshot)=>{
                    const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
                    setAllListings(newData);
                    console.log("searching for:" + tagSearch + " results:" + newData);
                });
            }
            fetchTagsData();
            // removes key from local storage since tags/data is no longer needed after searching has been done 
            //window.localStorage.removeItem('USER_TAGGABLESEARCH');
        }
    }, [])

    // sets tag user selected as "chosen" or "unchosen"
    function setSelectedTag(index) {
        const tagName = searchTags.filter((el, i) => i === index).toString();
        const clickedTag = document.getElementById(index);
        const clickedTagBG = window.getComputedStyle(clickedTag).backgroundColor;
        // if the tag is green, its currently selected, so clicking it will "unselect" it
        if (clickedTagBG === "rgb(46, 139, 87)") {
            console.log("removing tag: " + tagName + " from " + userTags);
            //remove selected tag from userTag list
            const indexAt = userTags.indexOf(tagName);
            setUserTags(userTags.filter((el, i) => i !== indexAt));
            // change background color so user knows its unselected
            clickedTag.style.backgroundColor="lightgray";
        } 
        // if the tag is gray, its currently not selected, so clicking it will "select" it
        else if (clickedTagBG === "rgb(211, 211, 211)") {
            console.log("adding tag: " + tagName);
            //add selected tag to userTag list
            setUserTags(userTags.concat(tagName));
            // change background color so user knows its selected
            clickedTag.style.backgroundColor="#2D564E";
            clickedTag.style.color="white";
        }
    }

    // makes sure search bar input is valid
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
            //saving search bar input to local storage so it can be accessed and used on a new search
            window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(searchBarInput));
            // takes user to /search-results/words_entered_in_search_bar
            window.location.href=("/search-results/"+searchBarInputURL);
        }
        return false;
    }

    // make sure search by tags is valid
    function searchByTags() {
        if (userTags.length > 0) {
            // save userTags to local storage to access again on refresh
            console.log("redirecting to: " + userTags);
            // useEffect(()=>{
            //     window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(userTags));
            // }, [])
            // delete tagsearch so previous results dont show up
            window.localStorage.removeItem('USER_SEARCHBARINPUT');
            //saving search tags to local storage so it can be accessed and used on a new search
            window.localStorage.setItem('USER_TAGGABLESEARCH', JSON.stringify(userTags));
            //console.log(JSON.parse(window.localStorage.getItem('USER_TAGGABLESEARCH')));
            const searchBarInputURL = userTags.toString().replace(/,|\s/g, '_');
            console.log("testing if searchbarinputurl for tags is ok:" + searchBarInputURL);
            // takes user to /search-results/words_entered_in_search_bar
            window.location.href=("/search-results/"+searchBarInputURL);

        }
        else if (userTags.length === 0) {
            alert("Please select at least one tag first.")
        }
    }

    const [email, setEmail] = useState(() => {
        // getting user details from local storage
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
    }, []);

    document.title="Search Results";

    // if email is not empty, someone is signed in so it shows actual home page, NOT landing page
    if (email !== "") {
        return (
            <center>
            <div className="searchresult-padding1">
                <h2>Re-do Search? </h2>
                <div className="container">
                    <div className='searchresults-searchbar'>
                    <form className="d-flex search-form" onSubmit={(event) => {validateSearch(event)}}>
                            <input className="form-control me-2 search-input" id="usersearch" type="search" placeholder="search here" aria-label="Search" required></input>
                            <button className="search-btn btn-outline-success" type="submit" >search</button>
                    </form>
                </div>
                    <div className="tags-input-container">
                        { searchTags.map((tag, index) => (
                            <div className="tag-item" id={index} key={index}>
                                <span className="text" onClick={() => setSelectedTag(index)}>{tag}</span>
                            </div>
                        )) }
                    </div>
                    <button className='searchresults-buttons' type="button" onClick={() => searchByTags()}>search by tags</button>
                    <center>
                    <div className="row">
                            <div className="searchresults-questions">
                                <h4 className="searchresults-question-1"><em>need to sell or request a market item?</em></h4>
                                <h4 className="searchresults-question-1answer"><em><a className="question-brown" href="/create-listing">sell</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="/request">request</a></em></h4>
                            </div>
                        
                            {/* <div className="col"></div> */}
                        </div>
                    </center>
                    <div className="listings-cont">
                        <h3 className="listings-title"><em>Search results for: {search}</em></h3>

                        {/* dynamically create rows and columns based on how many listings are in database */}
                        <div className="row">
                            {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                            {
                                allListings.length > 0 ?
                                (allListings?.map((data, index)=>(
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
                                ))) : (<h3>no results.</h3>)
                            }
                        </div>
                    </div>
                </div>
            </div>
            </center>
        )
    } else {
        return(
            <Error/>
        )
    }
}

export default Searchresults;