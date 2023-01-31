import React, { Component } from "react";
import '../App.css';
import './home.css';
import Listing from '../components/listing';
import Pagination from "../components/pagination";

class Home extends Component {
    render() {
        document.title="Home"
        const user = '[username]';

        return(
            <main>
                <section>
                    <div className="padding container">
                        <h1 className="pill-form">Welcome {user}</h1>
                        <form className="d-flex search-form">
                            <input className="form-control me-2 search-input" type="search" placeholder="search here" aria-label="Search"></input>
                            <button className="search-btn btn-outline-success" type="submit">search by filter</button>
                        </form>
                        <div className="row">
                            <div className="col col-spacing">
                                <h4 className="question-1"><em>need to sell or request a market item?</em></h4>
                                <h4 className="question-1"><em><a className="question-brown" href="#">sell</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="#">request</a></em></h4>
                            </div>
                            {/* <div className="col"></div> */}
                        </div>
                        <div className="row">
                            {/* <div className="col"></div> */}
                            <div className="col col-spacing">
                                <h4 className="question-2"><em>looking for carpool or other services?</em></h4>
                                <h4 className="question-2"><em><a className="question-brown" href="#">carpool</a>&nbsp;&nbsp;&nbsp;<a className="question-brown" href="#">other services</a></em></h4>
                            </div>
                        </div>

                        <div className="listings-cont">
                            <h3 className="listings-title"><em>most recent product listings</em></h3>

                            {/* need to dynamically create rows and columns based on how many listings are in database */}
                            <div className="row">
                                <div className="col">
                                    <Listing/>
                                </div>
                                <div className="col">
                                    <Listing/>
                                </div>
                                <div className="col">
                                    <Listing/>
                                </div>
                                <div className="col">
                                    <Listing/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Listing/>
                                </div>
                            </div>
                            <Pagination/>
                            
                        </div>
                        
                        
                    </div>
                </section>
            </main>
        )

    }
}

export default Home;