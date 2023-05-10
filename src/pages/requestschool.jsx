import React, { Component } from "react";
import '../css/requestschool.css';

class RequestSchool extends Component {
    render() {
        document.title="RequestSchool"

        function copyText(){
            var email = "unimarket@gmail.com";
            navigator.clipboard.writeText(email);
            alert("Email has been copied!");
        }
        return(
            <main>
                <body>
                    <div className="main-container-req">
                        <div className= "mainrequest">
                            <h1 className="request-title">UniMarket RequestSchool</h1>
                            <h2 className="request">Would you like your school to join unimarket?<br></br>Please submit a request by emailing us, and Customer Service will help!</h2>
                            <button className="copybutton" onClick={copyText}>unimarket@gmail.com</button>
                        </div>
                    </div>
                </body>
            </main>
        )

    }
}

export default RequestSchool;