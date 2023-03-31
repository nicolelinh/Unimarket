import React, { Component } from "react";
import '../App.css';
import '../css/userhistory.css';

class UserHistory extends Component {
    render() {
        document.title="UserHistory"

        return(
            <main>
                <section>
                    <div class="mainsquare">
                        <h1 className="title">User History</h1>
                        <div className="content">
                            <button className="support"><a className="support" href="/landing">need help with your records?</a></button> 
                            {/*below this is the order links to users history and such*/}
                            <li className="order">
                                <a className="orderlink"href="/landing">order #1</a>
                            </li>
                            <li className="order">
                                <a className="orderlink"href="/landing">order #2</a>
                            </li>
                            <li className="order">
                                <a className="orderlink"href="/landing">order #3</a>
                            </li>
                            <li className="order">
                                <a className="orderlink"href="/landing">order #4</a>
                            </li>
                        </div>
                    </div> 
                <div className="backsquare"></div> 
                </section>
            </main>
        )
    }
}

export default UserHistory;