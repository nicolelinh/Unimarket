import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { collection, addDoc, getDocs, query, where,deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function UserHistory(){
    document.title="UserHistory";
    const [newItemText, setNewItemText] = useState('');
  const [newItemLink, setNewItemLink] = useState(''); // Add new state variable for link input
  const [todoList, setTodoList] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Fetch the user's list items from Firestore
  useEffect(() => {
    async function fetchTodoList() {
      const q = query(collection(db, 'todoList'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        link: doc.data().link,
        createdAt: doc.data().createdAt.toDate(),
      }));
      setTodoList(items);
    }

    if (currentUser) {
      fetchTodoList();
    }
  }, [currentUser]);

  // Handle form submit to add a new list item
  async function handleFormSubmit(event) {
    event.preventDefault();

    await addDoc(collection(db, 'todoList'), {
      userId: currentUser.uid,
      text: newItemText,
      link: newItemLink, // Save link in Firestore
      createdAt: new Date(),
    });

    setNewItemText('');
    setNewItemLink(''); // Reset link input value
    setTodoList([...todoList, { id: Date.now(), text: newItemText, link: newItemLink, createdAt: new Date() }]);
  }

  async function handleDeleteButtonClick(itemId) {
    await deleteDoc(doc(db, 'todoList', itemId));

    const updatedTodoList = todoList.filter((item) => item.id !== itemId);
    setTodoList(updatedTodoList);
  }

  return (
    <>
      <h1>User History</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          New Item:
          <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} />
        </label>
        <label>
          Link:
          <input type="text" value={newItemLink} onChange={(e) => setNewItemLink(e.target.value)} /> {/* Add link input field */}
        </label>
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {todoList.map((item) => (
          <li key={item.id}>
            {item.text} {item.link && <a href={item.link}> ({item.link})</a>} {/* Display link as clickable anchor tag */}
            (created at {item.createdAt.toLocaleString()})
            <button onClick={() => handleDeleteButtonClick(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
export default UserHistory;