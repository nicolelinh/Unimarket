import React, { Component } from "react";
import '../App.css';
import './home.css';
import Listing from '../components/listing';

class Home extends Component {
    render() {
        document.title="Home"
        const user = 'leilani';

        return(
            <main>
                <section>
                    <div className="padding container">
                        <h1 className="pill-form">Welcome {user}</h1>
                        <form className="d-flex search">
                            <input className="form-control me-2" type="search" placeholder="search here" aria-label="Search"></input>
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="row">
                            <div className="col">
                                <h4 className="question"><em>need to sell or request a market item?</em></h4>
                                <h4><em><a href="#">sell</a>&nbsp;&nbsp;&nbsp;<a href="#">request</a></em></h4>
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col">
                                <h4 className="question"><em>looking for carpool or other services?</em></h4>
                                <h4><em><a href="#">carpool</a>&nbsp;&nbsp;&nbsp;<a href="#">other services</a></em></h4>
                            </div>
                            
                        </div>
                        


                        <Listing/>
                    </div>
                </section>
            </main>
        )

    }
}

export default Home;