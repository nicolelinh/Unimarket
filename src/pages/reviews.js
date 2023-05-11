import React, { useState } from "react";
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import profilepic from '../assets/profilepic.png';
import '../css/reviews.css';

/*
steps to figuring out star rating system: run npm install react-icons --save
to install the 'react-icons/fa'. 
*/

// reviews function for the three main inputs (for now)
const Reviews = () => {
    const [sellerName, setSellerName] = useState("");
    const [item, setItem] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(null);
  
    // submit button to capture user inputs. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "userReviews"), {
                sellerName: sellerName,
                item: item,
                description: description,
                rating: rating,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setSellerName("");
        setItem("");
        setDescription("");
        setRating(null);
    };
  
    // function to handle the star rating input
    const handleRating = (value) => {
        setRating(value);
    };
  
    // form for display purposes (to actually implement inputs). 
    // certain styles were used to make it more orderly and fashionable.  
    return (
        <div className="reviews-background">
            <br></br>
            <form className='reviews-form' onSubmit={handleSubmit} style={{background: 'linear-gradient(180deg, rgba(149, 185, 178, 0.509) 0%, rgba(233, 221, 192, 0.627) 100%)', borderRadius: '50px', padding: '20px', display: 'inline-block', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Reviews</h2>
            <div><Link className='reviews-link' to="/reviewsdisplay">Redirect to Existing Reviews</Link></div>
            <img className="profilepic" src={profilepic} alt="profilepic" id="profilepic"/>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label style={{ flex: '0 0 100px' }}>
                        username:
                        <input
                            type="text"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            style={{ textAlign: 'center' }}
                        />
                    </label>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label>
                        rating:
                        <div>
                            {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label key={i}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() => handleRating(ratingValue)}
                                        />
                                        <FaStar
                                            className="star"
                                            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                                            size={40}
                                            onMouseEnter={() => handleRating(ratingValue)}
                                            onMouseLeave={() => handleRating(ratingValue)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </label>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label style={{ flex: '0 0 100px' }}>
                        title:
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            style={{ textAlign: 'center' }}
                        />
                    </label>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <label style={{ flex: '0 0 100px' }}>
                        description:
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ textAlign: 'center' }}
                        />
                    </label>
                </div>
                <br />
                <button className= 'reviews-button' >publish review</button>
                <br />
                <br />
            </form>
            <br />
            <br />
        </div>
    );
};

export default Reviews;

/*
import React, { useState } from "react";
import { db } from '../firebaseConfig';
import {collection, addDoc} from "firebase/firestore";

// reviews function for the three main inputs (for now)
const Reviews = () => {
    const [sellerName, setSellerName] = useState("");
    const [item, setItem] = useState("");
    const [description, setDescription] = useState("");
  
    // submit button to capture user inputs. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const docRef = await addDoc(collection(db, "userReviews"), {
            sellerName: sellerName,
            item: item,
            description: description,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        setSellerName("");
        setItem("");
        setDescription("");
      };
  
    // form for display purposes (to actually implement inputs). 
    // certain styles were used to make it more orderly and fashionable.  
    return (
      <div >
        <h2>Reviews</h2>
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label style={{ flex: '0 0 100px' }}>
                    username:
                    <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                    />
                </label>
            </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label style={{ flex: '0 0 100px' }}>
                    Item:
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                    />
                </label>
            </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label style={{ flex: '0 0 100px' }}>
                    description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
            </div>
          <br />
          <button type="submit" style={{backgroundColor: '#84ad97', borderRadius: '5px', padding: '10px', border: 'none', color: '#fff', cursor: 'pointer'}}>publish review</button>
          <br />
          <br />
        </form>
      </div>
    );
  };
  
  export default Reviews;
  */