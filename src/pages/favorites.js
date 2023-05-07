import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Favorites() {
  const [favoriteList, setFavoriteList] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    async function fetchFavoriteList() {
      const q = query(
        collection(db, 'favorites'),
        where('userid', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        itemid: doc.data().itemid,
      }));
      setFavoriteList(items);
    }

    if (currentUser) {
      fetchFavoriteList();
    }
  }, [currentUser]);
  
  

 // Fetch the market listings and display them based on the favorite list
 useEffect(() => {
    async function fetchMarketListings() {
      const q = query(collection(db, 'marketListings'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          description: data.description,
          photo: data.photo,
          title: data.title,
          price: data.price
        });
      });
      setMarketListings(items);
    }

    fetchMarketListings();
  }, []);
  
  // Display the favorite list and the corresponding market listings
  return (
    <body>
      <center>
        <div className='background-border'>
          <div className='padding1'>
          <center>
          <div className='background-border'>
            <div className='padding1'>
              <h1>Favorites</h1>
              <p>{currentUser.uid}</p>
              <ul className='display-list'>
                {favoriteList.map((item) => {
                  const marketItem = marketListings.find(marketItem => marketItem.id === item.itemid);
                  if (marketItem) {
                    return (
                      <li key={item.id}>
                        <h3>{marketItem.title}</h3>
                        <img src={marketItem.photo} alt={marketItem.title} />
                        <p>{marketItem.description}</p>
                        <p>Price: {marketItem.price}</p>
                      </li>
                    );
                  } else {
                    return null;
                  }
                })}
              </ul>
            </div>
          </div>
        </center>
          </div>
        </div>
      </center>
    </body>
  );
}
export default Favorites;