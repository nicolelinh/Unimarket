import React, { useState } from 'react';
import '../App.css';
import '../css/signin.css';
import { db } from '../firebaseConfig';
import {collection, addDoc} from "firebase/firestore";

const ServiceRequest = () => {
    const [service, setService] = useState({ name: '', description: '', usernote: '' });

    const handleChange = (event) => {
        setService({ ...service, [event.target.name]: event.target.value });
    };

    // Submits the request and all details are saved into the database in "services" collection
    const submitRequest = async (e) => {
        e.preventDefault();
        console.log(service);
        await addDoc(collection(db, "services"), {
            name: service.name,
            usernote: service.usernote,
            description: service.description
        });
        setService({ name: '', description: '', usernote: '' });
    }

    return (
        <form onSubmit={submitRequest}>
            <h2>Create Service Request</h2>
            <label>
                Name:
                <input
                type="text"
                name="name"
                value={service.name}
                onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Description:
                <textarea
                name="description"
                value={service.description}
                onChange={handleChange}
                />
            </label>
            <br />
            <label>
                User Note:
                <textarea
                name="usernote"
                value={service.usernote}
                onChange={handleChange}
                />
            </label>
            <br />
            <button type="submit">Place Request</button>
            <button><a href="/home">Cancel</a></button>
        </form>
    );
};

export default ServiceRequest;