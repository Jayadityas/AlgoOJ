import { Route, Routes } from 'react-router-dom'
import {ToastContainer,toast} from 'react-toastify'
import Home from './pages/Home.jsx';
import Problems from './pages/Problems.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Myprofile from './pages/Myprofile.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';


function App() {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>         
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/problems' element={<Problems/>} />
        {/* <Route path='/problems/:id' element={<Doctors/>} /> */}
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} /> 
        <Route path='/contact' element={<Contact/>} />
        <Route path='/my-profile' element={<Myprofile/>} />
      </Routes>

      <Footer/>

    </div>
  )
}

export default App;
