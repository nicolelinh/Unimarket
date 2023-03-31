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
import Chat from './pages/chat';
import ChatPage from './pages/chatpage'
import ServiceRequest from './pages/servicerequest';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ServiceList from './pages/servicelist';
import RequestSchool from './pages/requestschool';
import UserProfile from './pages/userprofile';
import UserHistory from './pages/userhistory';



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
          <Route path="/carpooldisplay" element={<CarpoolDisplay/>}/>  
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/servicerequest" element={<ServiceRequest />} />
          <Route path="/servicelist" element={<ServiceList />} />
          <Route path="/requestschool" element={<RequestSchool/>} />
          <Route path="/userprofile" element={<UserProfile/>}/>
          <Route path="/userhistory" element={<UserHistory/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;
