import React, { useState } from "react";
import './navbar.css';
import icon from '../assets/HomeButton.png';

const Navbar = () => {
    const [email, setEmail] = useState(() => {
        // getting stored user data
        const saved = window.localStorage.getItem('USER_EMAIL');
        const initialValue = JSON.parse(saved);
        return initialValue || "";
      }, []);

    // checking if USER_EMAIL is empty or not, if not then someone is signed in so navbar links change
    if (email !== "") {
        return (
            <center>
            <nav className="navbar navbar-expand-sm navbar-dark bg-green">
                <div className="container">                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/following">following</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/chatpage">messages</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/userprofile">profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/userhistory">history</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/favorites">favorites</a>
                            </li>
                            </ul>
                            <button className= "nav-button">
                                <a href="/home">
                                <img src={icon} alt="home" />
                                </a>
                            </button>
                            <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/carpoolrequest">carpool</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/request">request item</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/servicerequest">service request</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/services">services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signout">sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            </center>
        )
    }
    else {
        return(
            <center>
            <nav className="navbar navbar-expand-sm navbar-dark bg-green">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                            <li className="nav-item">
                                <a className="nav-link" href="/signin">Sign In</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">Sign Up</a>
                            </li>
                            <button className= "nav-button">
                                <a href="/home">
                                <img src={icon} alt="home" />
                                </a>
                            </button>
                            <li className="nav-item">
                                <a className="nav-link" href="/signout">Sign Out</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/requestschool">Join Us</a>
                            </li>
                        </ul>
                        {/* removed search bar */}
                    </div>
                </div>
            </nav>
            </center>
        )
    }
}

export default Navbar;
