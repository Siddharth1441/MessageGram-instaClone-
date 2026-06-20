/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let isMounted = true

        async function hydrateSession() {
            try {
                const response = await getMe()
                if (isMounted) setUser(response.user)
            } catch {
                if (isMounted) setUser(null)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        hydrateSession()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading,error,setError}}>
            {children}
        </AuthContext.Provider>
    )

}
