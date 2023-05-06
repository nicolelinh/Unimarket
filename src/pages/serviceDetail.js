import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

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

  // If service couldn't be found, it'll just keep loading
  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="servicedetail">
        <h2>Name: {service.name}</h2>
        <h2>User Note: {service.usernote}</h2>
        <p>Description: {service.description}</p>
        {auth.currentUser.uid === service.uid && (
          <button onClick={handleDelete}>Delete Service</button>
        )}
        <button>dm user button</button>
        <div>
          <button onClick={goBack}>Go Back</button>
        </div>
    </div>
    
  );
};

export default ServiceDetail;