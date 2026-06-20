import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <main className="state-page"><p>Loading...</p></main>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
