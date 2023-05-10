import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../css/favorites.css';

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

  const removeFavorite = async (event, favoriteItemId) => {
    event.preventDefault();
    try {
      await deleteDoc(doc(db, "favorites", favoriteItemId));
      console.log("Document deleted successfully");
      window.location.reload();
    } catch (event) {
      console.error("Error deleting document:", event);
    }
  };
  
  // Display the favorite list and the corresponding market listings
  return (
    <body>
      <center>
        <div className='favorites-padding'>
          <div className='padding1'>
          <center>
          <div className='background-border'>
            <div className='padding1'>
              <h1 className='favorites-title'>Favorites</h1>
              <ul className='display-list'>
                {favoriteList.map((item) => {
                  const marketItem = marketListings.find(marketItem => marketItem.id === item.itemid);
                  if (marketItem) {
                    return (
                      <li className="favorites-itemcard" key={item.id}>
                        <center>
                        <p className='favorites-titlecard'>{marketItem.title}</p>
                        <img src={marketItem.photo} alt={marketItem.title} />
                        <p>{marketItem.description}</p>
                        <p>Price: {marketItem.price}</p>
                        <button className='favorites-delete' onClick={(e) => removeFavorite(e, item.id)}>Remove from favorites</button>
                        <div className='favorites-padding2'></div>
                        </center>
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