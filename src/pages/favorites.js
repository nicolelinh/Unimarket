import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Favorites() {
  const [favoriteList, setFavoriteList] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Fetch the user's favorite items from Firestore
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

  

  return (
    <body>
      <center>
        <div className='background-border'>
          <div className='padding1'>
            <h1>Favorites</h1>
            <p>{currentUser.uid}</p>
            <ul className='display-list'>
              {favoriteList.map((item) => (
                <li key={item.id}>{item.itemid}</li>
              ))}
            </ul>
          </div>
        </div>
      </center>
    </body>
  );
}

export default Favorites;