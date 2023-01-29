import logo from './logo.svg';
import './App.css';
import {  
  BrowserRouter,  
  Routes,  
  Route
}   
from 'react-router-dom'; 
import Home from './pages/home';
import SignUp from './pages/signup';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
      
    </div>
  );
}

export default App;