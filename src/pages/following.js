import React, { useEffect, useState, useContext } from "react";
import { collection, addDoc, getDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { AuthContext } from '../context/AuthContext';
import Listing from '../components/listing';

const Following = () => {
    const {currentUser} = useContext(AuthContext);
    const [followingList, setFollowingList] = useState([]);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        if (currentUser.uid) {
            try {
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

    const followingListQuery = async() => {
        if (followingList && followingList.length) {
            const marketListingsRef = collection(db, "marketListings");
            const q = query(marketListingsRef, where("seller", "in", followingList));
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
    

    //---------------------I did not write anything in this return, reused from other pages-----------------------------
    return (
        <main>
        <section>
            {listings?.map((data) => {

            })}
        </section>
        <section>
            <div className="padding container">
                <div className="listings-cont">
                    <h3 className="listings-title"><em>listings from your followed users</em></h3>

                    {/* dynamically create rows and columns based on how many listings are in database */}
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
                    {/* allow max of 4 listings per page to test, if over, then go to next page OR continuous scrolling*/}
                    
                </div>
            </div>
        </section>
    </main>
    )
    //---------------------I did not write anything in this return, reused from other pages-----------------------------
}

export default Following;