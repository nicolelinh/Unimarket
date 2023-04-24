import React, { Component } from "react";
import FourOhFourImg from "../assets/404-error.jpg";

class Error extends Component {

    render() {
        return (
            <div>
                <img src={FourOhFourImg} alt="broken robot"/>
            </div>
        )
    }
}

export default Error;