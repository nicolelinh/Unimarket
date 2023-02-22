import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig'

function SignOut () {
    // sign out function
    const userSignOut = () => {
        signOut(auth)
        .then(() => {
            localStorage.clear(); // clearing local storage so user data is no longer available
            console.log('Sign out successful');
        })
        .catch((error) => {
            console.log(error);
            // ..
        });
    };

    // visible portion of the page(sign out the current user)
    return (
        <div>
            {<button onClick={userSignOut}>Sign Out</button>}
        </div>
    );
}


export default SignOut;