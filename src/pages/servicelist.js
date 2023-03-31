import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { getDocs, collection } from "firebase/firestore";
import profilepic from '../assets/profilepic.png';
import '../App.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  //initialize starting page to 1

    //variables used to keep track of current pages and each page will contain 3 services
    const itemsPerPage = 3;
    const totalPages = Math.ceil(services.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //retrieves the other services from firebase
    useEffect(() => {
        const getServices = async () => {
            const data = await getDocs(collection(db, "services"));
            const serviceList = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            setServices(serviceList);
        }
        getServices();
    }, []);

    //function to take care of the previous button click
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    //function to take care of the next button click
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
      <div className="service-list">
        {/*Title*/}
        <h1>Other Services</h1>
        {/*This part is essentially just the services (it currrently only contains the name and description)*/}
        {services.slice(startIndex, endIndex).map((service) => {
            return(
                <div key={service.id} style={{ border: '3px solid black', borderRadius: '20px', margin: '3%', marginLeft: '20%', marginRight: '20%' }}>
                    <a href={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', padding: '1%' }}>
                            <img className="profilepic" src={profilepic} alt="profilepic" id="profilepic"/>
                            <h2 style={{ width: '10%', marginLeft: '5%', marginRight: '25%', marginTop: '6%' }}>{service.name}</h2>
                            <p>{service.description}</p>
                        </div>
                    </a>
                </div>
            );
        })}
        {/*This portion creates the the prev and next page button and keeps track of the current page*/}
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
            <p>Page {currentPage} of {totalPages}</p>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    );
}

export default ServiceList;