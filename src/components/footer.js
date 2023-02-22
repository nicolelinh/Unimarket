import React, { Component } from "react";
import './footer.css';

class Footer extends Component {

    // add links to href once we decide what footer should display to users
    render() {
        return (
            
            <footer className="text-white text-center text-lg-start bg-green">
                <div className="container p-4">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Sign Up for Free!</h5>
                            <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
                            molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
                            voluptatem veniam, est atque cumque eum delectus sint!
                            </p>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase">Helpful Links</h5>

                            <ul className="list-unstyled mb-0">
                            <li>
                                <a href="#!" className="text-white">How It Works</a>
                            </li>
                            <li>
                                <a href="#!" className="text-white">About Us</a>
                            </li>
                            <li>
                                <a href="#!" className="text-white">Contact</a>
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center p-3 bg-darkgreen">
                    © 2020 Copyright:
                    <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
                </div>
            </footer>
        )
    }
}

export default Footer;