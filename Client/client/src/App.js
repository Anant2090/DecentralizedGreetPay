import logo from './logo.svg';
import gsap from 'gsap';
import  Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import Services from './components/Services';
import Transaction  from './components/Transaction';


import './App.css';
import { useEffect } from 'react';

function App() {
  
  return (
    <div className='hh min-h-screen'>
      <div className='gradient-bg-welcome'>
      
      <Navbar/>
      <Welcome/>
      </div>
      <Services/>
      <Transaction/>
      <Footer/>
    </div>
  );
}

export default App;
