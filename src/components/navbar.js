import React, { useState } from "react";
import './navbar.css';

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
            <nav className="navbar navbar-expand-sm navbar-dark bg-green">
                <div className="container">
                    <a className="navbar-brand" href="/home"><b>UniMarket</b></a>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">following</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/chat">messages</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">history</a>
                            </li>
                        </ul>
                        <a href="/">#</a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">market</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/carpoolrequest">carpool</a>
                            </li>
                            <li>
                                <a className="nav-link" href="/request">request item</a>
                            </li>
                            <li>
                                <a className="nav-link" href="/servicerequest">service request</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/servicelist">services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signout">sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
    else {
        return(
            <nav className="navbar navbar-expand-sm navbar-dark bg-green">
                <div className="container">
                    <a className="navbar-brand" href="/"><b>UniMarket</b></a>
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signin">Sign In</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">Sign Up</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signout">Sign Out</a>
                            </li>
                            <li>
                                <a className="nav-link" href="/landing">Landing</a>
                            </li>
                        </ul>
                        {/* removed search bar */}
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;
