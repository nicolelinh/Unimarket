import React, { useEffect, useState} from "react";
import {collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import Listing from "../components/listing";
import Fuse from "fuse.js";
import './tagsinput.css';

const Searchresults = () => {
    // get user inputted search by parsing url
    const did = window.location.pathname.split("/")[2]; // don't need this if using local storage
    let search = did.replace(/_/g, " "); // don't need this if using local storage
    // get user inputted search by checking local storage
    const inputSearch = JSON.parse(window.localStorage.getItem('USER_SEARCHBARINPUT'));
    const tagSearch = JSON.parse(window.localStorage.getItem('USER_TAGGABLESEARCH'));
    const marketRef = collection(db, "marketListings");
    const [allItems, setAllItems] = useState([]);
    const [userTags, setUserTags] = useState([]); 
    const [searchTags] = useState([
        "electronics", "books", "home", "furniture", "clothing, shoes & accessories", "pets", "music, movies & games", "school supplies"
    ]);

    useEffect(()=>{
        // if searching by keywords
        if (inputSearch) {
            console.log("made it into inputsearch!!");
            const fetchKeywordData = async () => {
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
            fetchKeywordData();
            window.localStorage.removeItem('USER_SEARCHBARINPUT');
        }
        // if searching by tags
        if (tagSearch) {
            console.log("made it into tagSearch!!");
            const fetchTagsData = async () => {
                await getDocs(query(marketRef, where('tags', 'array-contains-any', tagSearch))).then((querySnapshot)=>{
                    const newData = querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id}));
                    setAllItems(newData);
                    console.log("searching for:" + tagSearch + " results:" + newData);
                });
            }
            fetchTagsData();
            window.localStorage.removeItem('USER_TAGGABLESEARCH');
        }
    }, [])

    function setSelectedTag(index) {
        const tagName = searchTags.filter((el, i) => i === index).toString();
        const clickedTag = document.getElementById(index);
        const clickedTagBG = window.getComputedStyle(clickedTag).backgroundColor;
        if (clickedTagBG === "rgb(46, 139, 87)") {
            console.log("removing tag: " + tagName + " from " + userTags);
            //remove selected tag from userTag list
            const indexAt = userTags.indexOf(tagName);
            setUserTags(userTags.filter((el, i) => i !== indexAt));
            // change background color so user knows its de-selected
            clickedTag.style.backgroundColor="lightgray";
        } else if (clickedTagBG === "rgb(211, 211, 211)") {
            console.log("adding tag: " + tagName);
            //add selected tag to userTag list
            setUserTags(userTags.concat(tagName));
            // change background color so user knows its selected
            clickedTag.style.backgroundColor="seagreen";
        }
    }

    // makes sure search bar input is valid
    async function validateSearch(e) {
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

    function searchByTags() {
        if (userTags.length > 0) {
            // save userTags to local storage to access again on refresh
            console.log("redirecting to: " + userTags);
            // useEffect(()=>{
            //     window.localStorage.setItem('USER_SEARCHBARINPUT', JSON.stringify(userTags));
            // }, [])
            window.localStorage.setItem('USER_TAGGABLESEARCH', JSON.stringify(userTags));
            console.log(JSON.parse(window.localStorage.getItem('USER_TAGGABLESEARCH')));
            const searchBarInputURL = userTags.toString().replace(/,|\s/g, '_');
            console.log("testing if searchbarinputurl for tags is ok:" + searchBarInputURL);
            window.location.href=("/search-results/"+searchBarInputURL);

        }
        else if (userTags.length === 0) {
            alert("Please select at least one tag first")
        }
    }

    document.title="Search Results";

    return (
        <div>
            <h3>Re-do Search? </h3>
            <div className="container">
                <form className="d-flex search-form" onSubmit={(event) => {validateSearch(event)}}>
                        <input className="form-control me-2 search-input" id="usersearch" type="search" placeholder="search here" aria-label="Search" required></input>
                        <button className="search-btn btn-outline-success" type="submit" >search by filter</button>
                </form>
                <h4>Or search by tags?</h4>
                <div className="tags-input-container">
                    { searchTags.map((tag, index) => (
                        <div className="tag-item" id={index} key={index}>
                            <span className="text" onClick={() => setSelectedTag(index)}>{tag}</span>
                        </div>
                    )) }
                </div>
                <button type="button" onClick={() => searchByTags()}>search by tags</button>
                <div className="listings-cont">
                    <h3 className="listings-title"><em>Search results for: {search}</em></h3>

                    {/* dynamically create rows and columns based on how many listings are in database */}
                    <div className="row">
                        {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                        {
                            allItems.length > 0 ?
                            (allItems?.map((data, index)=>(
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
    )
}

export default Searchresults;