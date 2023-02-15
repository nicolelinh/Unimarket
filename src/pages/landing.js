import React, { Component } from "react";
import '../App.css';
import logo from '../assets/logo2.png';

class Landing extends Component {
    render() {
        document.title="Landing"

        return(
            <main>
                <section>
                    <div class="main">
                        <div class="main_container">
                            <h1>Welcome to</h1>
                            <img src={logo} alt="logo" id="main_img"/>
                            <p>unimarket is an "all in one" online marketplace web app</p>
                            <p>built by students for students</p>
                            <button class="signup"><a href="/signup">SignUp</a></button>
                            <button class="signin"><a href="/signin">SignIn</a></button>
                        </div>
                    </div>
                </section>
            </main>
        )

    }
}
export default Landing;