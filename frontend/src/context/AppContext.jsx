import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [userData, setUserData] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') || false)
    const [problems, setProblems] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    console.log("Backend URL is:", backendUrl)

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/my-profile`, { headers: { token } })
            if (data.success) setUserData(data.user)
            else toast.error(data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProblems = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/problem/all`)
            if (data.success) setProblems(data.problems)
            else {
                setProblems([])
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => { getProblems() }, [])
    useEffect(() => { token ? getUserData() : setUserData(null) }, [token])

    return (
        <AppContext.Provider value={{
            userData, setUserData,
            token, setToken,
            problems, setProblems,
            backendUrl,
            getUserData, getProblems
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
