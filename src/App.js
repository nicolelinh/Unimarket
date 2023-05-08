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
import ServiceRequest from './pages/servicerequest';
import Location from './pages/location'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ServiceList from './pages/servicelist';
import ServiceDetail from './pages/serviceDetail';
import RequestSchool from './pages/requestschool';
import UserProfile from './pages/userprofile';
import UserHistory from './pages/userhistory';
import ComparisonResult from './pages/comparisonresult';
import ComparisonSearch from './pages/comparisonsearch';
import Reviews from './pages/reviews';
import ReviewsDisplay from './pages/reviewsdisplay';
import CustomerReport from './pages/customerRoport';
import Favorites from './pages/favorites';
import Searchresults from './pages/searchresults';
import Error from './components/error';
import RequestDisplay from './pages/requestdisplay';

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
          <Route path="/servicerequest" element={<ServiceRequest />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/following" element={<Following />} />
          <Route path="/location" element={<Location />} />
          <Route path="/requestschool" element={<RequestSchool/>} />
          <Route path="/userprofile" element={<UserProfile/>}/>
          <Route path="/userhistory" element={<UserHistory/>}/>
          <Route path="/comparisonsearch/:id" element={<ComparisonSearch/>}/>
          <Route path="/comparisonresult/:id/:id" element={<ComparisonResult/>}/>
          <Route path="/reviews" element={<Reviews/>}/>
          <Route path="/reviewsdisplay" element={<ReviewsDisplay/>}/>
          <Route path="/customerReport" element={<CustomerReport/>}/>
          <Route path='/following' element={<Following/>}/>
          <Route path='/favorites' element={<Favorites/>}/>
          <Route exact path="/search-results/:docid" element={<Searchresults/>} />
          <Route path="*" element={<Error/>} />
          <Route path="/requestdisplay" element={<RequestDisplay/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;

