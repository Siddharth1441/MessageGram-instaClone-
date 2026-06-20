import React, { useState } from 'react'
import "../style/form.scss"
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const { user, loading, error, handleLogin } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await handleLogin(username, password)
      navigate('/')
    } catch {
      // Error is shown from auth context.
    }
  }

  if (loading && !user) {
    return (
      <main className="auth-page">
        <div className="form-container">
          <p className="auth-loading">Loading...</p>
        </div>
      </main>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="auth-page">
      <div className="form-wrapper">
        <div className="instagram-banner">
          <div className="phone-mockup">
            <div className="phone-content">
              <div className="mock-topbar">MessageGram</div>
              <div className="mock-story-row">
                <span></span><span></span><span></span><span></span>
              </div>
              <div className="mock-post"></div>
              <div className="mock-actions"></div>
            </div>
          </div>
        </div>

        <div className="form-container">
          <div className="instagram-logo">
            <div className="logo-text">MessageGram</div>
            <div className="logo-subtext">Share moments, start conversations</div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">@</span>
              <input
                onInput={(event) => { setUsername(event.target.value) }}
                type="text"
                name="username"
                id="username"
                placeholder="Username or email"
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <span className="input-icon">#</span>
              <input
                onInput={(event) => { setPassword(event.target.value) }}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
              />
            </div>
            <button className="button primary-button" type="submit">Log in</button>
          </form>

          <div className="divider">or</div>

          <div className="forgot-password">
            <a href="#forgot">Forgot password?</a>
          </div>

          <div className="form-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
