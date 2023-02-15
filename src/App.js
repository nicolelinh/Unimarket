import logo from './logo.svg';
import './App.css';
import {  
  BrowserRouter,  
  Routes,  
  Route
}   
from 'react-router-dom'; 
import Home from './pages/home';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import SignOut from './pages/signout';
import AuthDetails from './components/authdetails';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Landing from './pages/landing';
//Item and Carpool Listing Request pages imported to UniMarket site. 
import Request from './pages/request'
import CarpoolRequest from './pages/carpoolrequest'


function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<><SignIn /><AuthDetails /></>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/landing" element={<Landing/>}/>
          <Route path="/request" element={<Request/>}/>
          <Route path="/carpoolrequest" element={<CarpoolRequest/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;