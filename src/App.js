import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'
import { collection, getDocs, addDoc } from "firebase/firestore"

function App() {
  // variables to set new email, password, and username
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  // creates an array type to store all information about each user
  const [users, setUsers] = useState([])

  // gets data from the collection "users"
  const usersCollectionRef = collection(db, "users");

  // create users function
  const createUser = async () => {
    await addDoc(usersCollectionRef, {email: newEmail, password: newPassword, username: newUsername});
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
      console.log(data);
    }
    getUsers();
  }, []);

  
  return (
    <div className="App">
      <input
        placeholder="Email..."
        onChange={(event) => {
          setNewEmail(event.target.value);
        }}
      />

      <input
        placeholder="Password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
        />

      <input
        placeholder="Username..."
        onChange={(event) => {
          setNewUsername(event.target.value);
        }}
      />

      <button onClick={createUser}> Create User </button>
      {users.map((user) => {
        return (
          <div>
            <h1>Email: {user.email}</h1>
            <h1>Password: {user.password}</h1>
            <h1>Username: {user.username}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default App;