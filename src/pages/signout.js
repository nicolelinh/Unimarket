import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig'

function SignOut () {
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

    return (
        <div>
            {<button onClick={userSignOut}>Sign Out</button>}
        </div>
    );
}


export default SignOut;