import React, { useState } from 'react';
import '../css/servicerequest.css';
import '../css/signin.css';
import { auth, db } from '../firebaseConfig';
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
            description: service.description,
            seller: auth.currentUser.email,
            uid: auth.currentUser.uid
        });
        setService({ name: '', description: '', usernote: '' });
    }

    return (
        <div className='servicerequest-padding1'>
            <center>
            <div className='servicerequest-form'>
        <form onSubmit={submitRequest}>
            <p className='servicerequest-title'>Create Service Request</p>
            <label>
                Name:<br/>
                <input
                type="text"
                name="name"
                value={service.name}
                onChange={handleChange}
                />
            </label>
            <br/>
            <label className='servicerequest-name'>
                Description:<br/>
                <textarea className='servicerequest-text'
                name="description"
                value={service.description}
                onChange={handleChange}
                />
            </label>
            <br />
            <label>
                User Note:<br/>
                <textarea className='servicerequest-text'
                name="usernote"
                value={service.usernote}
                onChange={handleChange}
                />
            </label>
            <br />
            <div className='servicerequest-padding2'>
            <button className='servicerequest-button1' type="submit">Place Request</button>
            <button className='servicerequest-button2'><a href="/home">Cancel</a></button>
            </div>
        </form>
        </div>
        </center>
        </div>
    );
};

export default ServiceRequest;