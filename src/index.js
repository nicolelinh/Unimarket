import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDocs,
    addDoc, deleteDoc, doc
}  from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCr10TXAJS1Cd92EUiojxPlHNsoIvSnTiw",
    authDomain: "unimarket-a7ff4.firebaseapp.com",
    projectId: "unimarket-a7ff4",
    storageBucket: "unimarket-a7ff4.appspot.com",
    messagingSenderId: "180731477688",
    appId: "1:180731477688:web:d056ea4ce59ca6342fbe4d",
    measurementId: "G-2F1BJQXR7T"
}

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'users')

// get collection data
getDocs(colRef)
    .then((snapshot) => {
        let users = []
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id })
        })
        console.log(users)
    })
    .catch(err => {
        console.log(err.message)
    })

// adding documents
const addUserForm = document.querySelector('.add')
addUserForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        email: addUserForm.email.value,
        password: addUserForm.password.value,
        username: addUserForm.username.value,  
    })
    .then(() => {
        addUserForm.reset()
    })
})

// deleting documents - FROM TUTORIAL
// const deleteUserForm = document.querySelector('.delete')
// deleteUserForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     const docRef = doc(db, 'users', deleteUserForm.id.value)

//     deleteDoc(docRef)
//         .then(() => {
//             deleteUserForm.reset()
//         })
// })

// READING DATA FROM THE DATABASE AND DISPLAYING IT
const q = query(colRef);
const querySnapshot = await getDocs(q);
console.log(querySnapshot)

// The "find all users" button, has an id of findusers
const findBtn = document.getElementById('findusers')

// The list, which contains all users, displayed to the interface
const usersList = document.getElementById('userlist')

function displayUsers() {
    // Clear the list, incase the button is pressed again, so the data is not duplicated
    usersList.innerHTML = ""

    // For every user in the database, create a new list element (li), add text for each user, then appent it to the list (using the const we declared earlier)
    querySnapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`Username: ${doc.data().username},    Email: ${doc.data().email},    Password: ${doc.data().password}`));
        usersList.appendChild(li);
    })
}

findBtn.addEventListener('click', displayUsers)