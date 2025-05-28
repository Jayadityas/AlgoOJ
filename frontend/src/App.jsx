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
import LeaderBoard from './pages/LeaderBoard.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx'


function App() {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>         
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/problems' element={<Problems/>} />
        <Route path='/leaderboard' element={<LeaderBoard/>}/>
        <Route path='/problems/:id' element={<ProblemPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} /> 
        <Route path='/contact' element={<Contact/>} />
        <Route path='/my-profile' element={<Myprofile/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <Footer/>

    </div>
  )
}

export default App;
