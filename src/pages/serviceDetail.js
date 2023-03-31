import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const getService = async () => {
      const docRef = doc(db, "services", id); // getting document reference 
      await getDoc(docRef)
      .then((docData) => {
          const currentService = docData.data();
          setService(currentService);
          console.log(service);
      })
    };

    getService();
  }, [id]);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="servicedetail">
        <h2>{service.name}</h2>
        <h2>{service.usernote}</h2>
        <p>{service.description}</p>
        <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default ServiceDetail;