import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,logout } from "../services/auth.api";
import { getApiError } from "../../shared/services/api";
export const useAuth = ()=>{
    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading,error,setError}  = context

    const handleLogin = async (username,password)=>{
        try {
            setError("")
            setLoading(true)
            const response = await login(username,password)
            setUser(response.user)
            return response.user
        } catch (err) {
            const message = getApiError(err, "Login failed")
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }
    const handleRegister = async (username,email,password)=>{
        try {
            setError("")
            setLoading(true)
            const response = await register(username,email,password)
            setUser(response.user)
            return response.user
        } catch (err) {
            const message = getApiError(err, "Registration failed")
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }
    const handleLogout = async ()=>{
        await logout()
        setUser(null)
    }
    return {
        user,setUser,loading,error,setError,handleLogin,handleRegister,handleLogout
    }
 
}
