import { useState,createContext,useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    
    const navigate = useNavigate()

    //getting the token from the frontend and saving it in the local storage of the admin pane
    const [adminData, setAdminData] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)               //whenever page reloads dom loads due to which states are intialized by their values
    const [problems, setProblems] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAdminData = async () => {

        try {
            
            const {data} = await axios.get(`${backendUrl}/api/user/my-profile`, {headers:{token}})
            if(data.success){
                setAdminData(data.user)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    const getProblems = async () => {

        try {
            
            const {data} = await axios.get(`${backendUrl}/api/problem/all`)
            if(data.success){
                setProblems(data.problems)
            }
            else {
                setProblems([])
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        adminData,setAdminData,
        token,setToken,
        getAdminData,getProblems,
        problems,setProblems,
        backendUrl,
    }

    useEffect(()=>{
        if(token){
            getAdminData()
        }
        else setAdminData(false)
    },[token])

    useEffect(()=>{
        getProblems();
    },[])

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider