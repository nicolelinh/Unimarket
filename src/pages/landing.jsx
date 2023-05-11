/*questions? ask dev nicole nguyen*/
import React, { Component } from "react";
import '../css/landing.css';
import logo from '../assets/logo2.png';
import welcometo from '../assets/welcome to.png';
import bubble from '../assets/bubble.png'
import signup from '../assets/signupbutton.png'
import signin from '../assets/signinbutton.png'

class Landing extends Component {
    render() {
        document.title="Landing"

        return(
            <main>
                <body>
                    <div class="landing-padding container">
                        <div class="main_container">
                            <img className="welcometo" src={welcometo} alt="welcometo" id="welcometo"/>
                            <br></br>
                            {/*this is body segmenting between the logo and the bubble/button assets*/}
                            <div className="body">
                                <div className="col">
                                    <img className="logo" src={logo} alt="logo" id="main_img"/>
                                </div>
                                <div className="col">
                                    <div className="bubblecontent">
                                        <img className="bubble" src={bubble} alt="bubble" id="bubble"/>
                                    </div>
                                    <div class="buttons">
                                    <button class="signup"><a href="/signup"><img src={signup}/></a></button>
                                    <button class="signin"><a href="/signin"><img src={signin}/></a></button>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <p className="description">our goal is to ultimately provide every college campus a local community where students can safely market items and exchange services amongst themselves</p>
                        </div>
                    </div>
                </body>
            </main>
        )
    }
}
export default Landing;