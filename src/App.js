import logo from './logo.svg';
import './App.css';
import {  
  BrowserRouter,  
  Routes,  
  Route
}   
from 'react-router-dom'; 
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signup';
import SignOut from './pages/signout';
import Chat from './pages/chat';
import ChatPage from './pages/chatpage'

import AuthDetails from './components/authdetails';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


function App() {

  const {currentUser} = useContext(AuthContext)
  console.log(currentUser)
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<><Login /><AuthDetails /></>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;