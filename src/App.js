import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route }   from 'react-router-dom'; 
import Home from './pages/home';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import SignOut from './pages/signout';
import AuthDetails from './components/authdetails';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Landing from './pages/landing';
import Createlisting from './pages/createlisting';
import Listingdetails from './pages/listingdetails';
import Editlisting from './pages/editlisting';

function App() {
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
          <Route path="/create-listing" element={<Createlisting/>}/>
          <Route exact path="/listing-details/:docid" element={<Listingdetails/>}/>
          <Route exact path="/edit-listing/:docid" element={<Editlisting/>}/>
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;