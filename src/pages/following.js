import React, { useEffect, useState, useContext } from "react";
import { collection, getDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { AuthContext } from '../context/AuthContext';
import Listing from '../components/listing';
import '../css/following.css';

const Following = () => {
    // Set up React states for keeping track of the following list (users), and the listings
    const {currentUser} = useContext(AuthContext);
    const [followingList, setFollowingList] = useState([]);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        if (currentUser.uid) {
            try {
                // Create a list of all users currently being followed
                const follow = async() => {
                    const userDoc = await getDoc(doc(db, "userInfo", currentUser.uid))
                    if (userDoc.data().following) {
                        setFollowingList(userDoc.data().following)
                    }
                }
                follow();
            } catch (e) {
                console.log("Error establishing followingList " + e);
            }
        }
    }, [currentUser.uid]);

    // Building a query to extract the listings from the followed users
    const followingListQuery = async() => {
        if (followingList && followingList.length) { // If at least one user is being followed
            const marketListingsRef = collection(db, "marketListings");
            const q = query(marketListingsRef, where("seller", "in", followingList)); // Firebase query, we check if the seller attribute (email), is in the following list
            const querySnapshot = await getDocs(q);
            const x = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }))
            console.log(x)
            setListings(x)
        } else {
            console.log('test1')
        }
    }

    useEffect(() => {
        followingListQuery();
    }, [followingList])
    

    // The following renders the listings from the currently followed users.
    //---------------------I did not write this code, reused from the home.js page-----------------------------
    return (
        <main>
        <section>
            {listings?.map((data) => {

            })}
        </section>
        <body className="following-background">
            <div className="padding container">
                <div className="listings-cont">
                    <p className="following-title">listings from your followed users</p>
                    {/* dynamically create rows and columns based on how many listings are in database */}
                    <div className="following-items">
                    <div className="row">
                        {/* this maps all the documents grabbed earlier and uses the data from each to create a Listing card */}
                        {
                            listings?.map((data, i)=>(
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
                    </div>
                    {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                    
                </div>
            </div>
            <div className="following-spacer"></div>
        </body>
    </main>
    )
    //---------------------I did not write anything in this return, reused from other pages-----------------------------
}

export default Following;