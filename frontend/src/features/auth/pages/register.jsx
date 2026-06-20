import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const { loading, error, handleRegister } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await handleRegister(username, email, password)
      navigate('/')
    } catch {
      // Error is shown from auth context.
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="form-container">
          <p className="auth-loading">Loading...</p>
        </div>
      </main>
    )
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

          <p className="form-subtitle">Sign up to follow friends and discover posts.</p>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">@</span>
              <input
                onChange={(event) => { setEmail(event.target.value) }}
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <span className="input-icon">M</span>
              <input
                onChange={(event) => { setUsername(event.target.value) }}
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">#</span>
              <input
                onChange={(event) => { setPassword(event.target.value) }}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
              />
            </div>
            <button className="button primary-button" type="submit">Sign up</button>
          </form>

          <div className="divider">or</div>

          <div className="form-footer">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register
