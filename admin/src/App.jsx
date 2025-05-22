import { Route, Routes } from 'react-router-dom'
import {ToastContainer,toast} from 'react-toastify'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import CreateProblem from './pages/CreateProblem.jsx';
import UpdateProblem from './pages/UpdateProblem.jsx';


function App() {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>         
      <Routes>
        <Route path='/' element={<AdminDashboard/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/create-problem' element={<CreateProblem/>} />
        <Route path='/update-problem/:id' element={<UpdateProblem/>} />
        {/* <Route path='/my-profile' element={<Myprofile/>} /> */}
      </Routes>

      <Footer/>

    </div>
  )
}

export default App;
