import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import '../css/reviewdisplay.css';

/* 
previous work:
    - {reviews.map((review) => (
*/

/* 
Explanation of parts of work: 
    - for reviews display, alphabetical order on names so its easier for users to locate
    certain users and group similar submissions of the same seller for cohesion
        - {reviews.sort((a, b) => a.sellerName.localeCompare(b.sellerName)).map((review) => (
*/

// displaying the various user reviews from the database and real-time user inputs. 
const ReviewsDisplay = () => {
  const [reviews, setReviews] = useState([]);

  // fetch and for displaying data. 
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'userReviews'), (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      setReviews(requests);
    });
    return unsubscribe;
  }, []);

  // form for display purposes (to actually implement inputs). 
  // certain styles were used to make it more orderly and fashionable.  
  return (
    <div className="reviewdisplay-padding" style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Reviews</h2>
      <table className='reviewsdisplay-table' style={{ border: '1px solid #A2A2A2', }}>
        <thead className='reviewsdisplay-toprow' style={{ border: '1px solid #A2A2A2' }}>
          <tr>
            <th>Name</th>
            <th>Item</th>
            <th>Description</th>
            <th>rating</th>
          </tr>
        </thead>
        <tbody>
        {reviews.sort((a, b) => a.sellerName.localeCompare(b.sellerName)).map((review) => (
            <tr  key={review.id} style={{ border: '1px solid #A2A2A2' }}>
                <td className='reviewsdisplay-userrows'>{review.sellerName}</td>  
                <td className='reviewsdisplay-userrows'>{review.item}</td>
                <td className='reviewsdisplay-userrows'>{review.description}</td>
                <td className='reviewsdisplay-userrows'>{review.rating}</td>
            </tr>
        ))}
        </tbody>
      </table>
      <Link className='reviewdisplay-link' to="/reviews">Redirect to post a review!</Link>
    </div>
  );
};

export default ReviewsDisplay;
