import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, setDoc, getDoc, getDocs, deleteDoc, collection, query, where, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../css/servicedetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  let navigate = useNavigate(); 
  let submitEvent;

  // Back function do redirect to previous page
  const goBack = () => {
    window.history.back();
  };

  // Process to get document from "services" collection and the ID from route
  useEffect(() => {
    const getService = async () => {
      const docRef = doc(db, "services", id); // getting document reference 
      await getDoc(docRef).then((docData) => {
          const currentService = docData.data();
          setService(currentService);
          console.log(service);
      })
    };
    getService();
  }, [id]);

  // Delete service list if original poster wants to remove it
  const handleDelete = async () => {
    const docRef = doc(db, "services", id);
    try {
      // Delete the service document
      await deleteDoc(docRef);
      console.log("Service successfully deleted!");
      window.location.href = '/services';
    } catch (error) {
      console.error("Error deleting service: ", error);
    }
  };

  // Handles logic for message button
  const handleMessageSelect = async (event, userEmail) => {
    // https://stackoverflow.com/questions/58408111/firebase-firestore-query-get-one-result
    event.preventDefault();
    // Building the query for finding the user ID of the current page
    let userDoc;
    let dmUID;
    let dmUsername;
    try {
        userDoc = await getDoc(doc(db, "userInfo", auth.currentUser.uid))
        const userInfoRef = collection(db, "userInfo");
        const q = query(userInfoRef, where("email", "==", userEmail)); // We know the email, but we need ID
        const querySnapshot = await getDocs(q);
        const x = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id }));
        dmUID = x[0].uid; // Since the query only returns ONE value (email is unique), first element of the array will hold the value
        dmUsername = x[0].username;
        console.log("DMUID " + dmUID)
    } catch (e) {
        alert("Error establishing a direct message. Please refresh and try again. If the error persists, please contact the user through other means (email or phone number)")
    }

    // A conversation in the database is identified by a combination of ID's
    // the greater of the ID is first, this logic handles that
    let convoID = null;
    if (auth.currentUser.uid > dmUID) {

        convoID = auth.currentUser.uid + dmUID;
    } else {
        convoID = dmUID + auth.currentUser.uid;
    }
    const existingChat = await getDoc(doc(db, "messages", convoID));

    // If this is the first time being messaged, create a new conversation
    if (!existingChat.exists() && convoID) {
        await setDoc(doc(db, "messages", convoID), { messages: [] });

        // Update the database for both the currently logged in user and the clicked user to reflect the new conversation
        await updateDoc(doc(db, "userInfo", auth.currentUser.uid), {
            ["conversations."+convoID]: {
                uid: dmUID,
                userName: dmUsername, // The clicked user's information
                date: Timestamp.now(), // Needed for sorting messages, (most recent)
                lastMessage: "" // Lastmessage for ease of access, needed in the UI
            }
        });

        // Update the database for the other user (listing page owner, NOT logged in user)
        await updateDoc(doc(db, "userInfo", dmUID), {
            ["conversations."+convoID]: {
                uid: auth.currentUser.uid,
                userName: userDoc.data().username, 
                date: Timestamp.now(), 
                lastMessage: "" 
            }
        });
    }
    // If the chat already exists, we are just taken to the chat page
    navigate('/chatpage');   
  }

  submitEvent = (event) => handleMessageSelect(event, service.seller);

  // If service couldn't be found, it'll just keep loading
  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <center>
    <div className='servicedetail-padding1'>
    <div className="servicedetail">
        <h2>Name: {service.name}</h2><br/>
        <h2>User Note: {service.usernote}</h2><br/>
        <p>Description: {service.description}</p>
        {auth.currentUser.uid === service.uid && (
          <button onClick={handleDelete}>Delete Service</button>
        )}
        {auth.currentUser.uid !== service.uid && (
          <button className='servicedetail-buttons' onClick={submitEvent}>dm user button</button>
        )}
        <div><br/>
          <button className='servicedetail-buttons' onClick={goBack}>Go Back</button>
        </div>
    </div>
    </div>
    </center>
  );
};

export default ServiceDetail;