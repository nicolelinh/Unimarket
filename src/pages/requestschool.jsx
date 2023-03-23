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
                <section>
                    <div classname="spacer"></div>
                    <div className= "mainrequest">
                        <h1>UniMarket RequestSchool</h1>
                        <h2>Would you like your school to join unimarket?<br></br>Please submit a request by emailing us, and Customer Service will help!</h2>
                        <button onClick={copyText}>unimarket@gmail.com</button>
                        </div>
                    <div classname="spacer"></div>
                </section>
            </main>
        )

    }
}

export default RequestSchool;