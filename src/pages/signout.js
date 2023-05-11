import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import '../css/signout.css'

function SignOut () {
    // sign out function
    const userSignOut = () => {
        signOut(auth)
        .then(() => {
            localStorage.clear(); // clearing local storage so user data is no longer available
            console.log('Sign out successful');
            
            // redirects back to the home page
            window.location.href = '/home'
        })
        .catch((error) => {
            console.log(error);
            // ..
        });
    };


    // visible portion of the page(sign out the current user)
    return (
        <center>
        <body>
        <div className="signout-1">
            <p className="signout?">Are you sure you want to sign out?<br></br>Please click the "sign out" button to sign out</p>
            <div className="signout-border">
                <button className="signout" onClick={userSignOut}>Sign Out</button>
            </div>
        </div>
        </body>
        </center>
    );
}


export default SignOut;