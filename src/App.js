import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route }   from 'react-router-dom'; 
import Home from './pages/home';

import SignIn from './pages/signin';
import SignUp from './pages/signup';
import SignOut from './pages/signout';
import AuthDetails from './components/authdetails';
import ForgotPassword from './pages/forgotpassword';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Landing from './pages/landing';
import Createlisting from './pages/createlisting';
import Listingdetails from './pages/listingDetails';
import Editlisting from './pages/editlisting';
import Request from './pages/request'
import CarpoolRequest from './pages/carpoolrequest'
import CarpoolDisplay from './pages/carpooldisplay'
import CarpoolDetails from './pages/carpoolDetails'
import Chat from './pages/chat';
import Following from './pages/following'
import ChatPage from './pages/chatpage'
import Location from './pages/location'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';



function App() {

  const {currentUser} = useContext(AuthContext)
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />

          <Route path="/home" element={<Home/>} />
          <Route path="/signin" element={<><SignIn /><AuthDetails /></>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/landing" element={<Landing/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
          <Route path="/create-listing" element={<Createlisting/>}/>
          <Route exact path="/listing-details/:docid" element={<Listingdetails/>}/>
          <Route exact path="/edit-listing/:docid" element={<Editlisting/>}/>
          <Route path="/request" element={<Request/>}/>
          <Route path="/carpoolrequest" element={<CarpoolRequest/>}/>
          <Route exact path="/carpool/:docid" element={<CarpoolDetails/>}/>
          <Route path="/carpooldisplay" element={<CarpoolDisplay/>}/>  
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/following" element={<Following />} />
          <Route path="/location" element={<Location />} />
  
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;
