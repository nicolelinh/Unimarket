import React, { Component } from "react";
import './navbar.css';

class Navbar extends Component {
    //render is needed BECAUSE it extends from Component
    // render inside the parenthesis you write javascript logic to decide what to show
    render(){
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
                                <a className="nav-link" href="/">following</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">messages</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">profile</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">history</a>
                            </li>
                        </ul>
                        <a href="/">#</a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">market</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">carpool</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signup">sign out</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/signout">Sign Out</a>
                            </li>
                            <li>
                                <a className="nav-link" href="/landing">Landing</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            
        );
    }
}

export default Navbar;