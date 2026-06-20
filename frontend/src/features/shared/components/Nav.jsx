import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../../post/nav.scss'


const Nav = () => {

    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()

    async function logoutAndGoHome() {
        await handleLogout()
        navigate('/login')
    }

  return (
    <nav className='nav-bar'>
        <Link className='brand' to="/">
            <span className="brand-mark">M</span>
            <span>MessageGram</span>
        </Link>
        <div className='nav-actions'>
        <Link className='nav-link' to="/">Home</Link>
        <Link className='nav-link' to="/search">Search</Link>
        {user && <Link className='button secondary-button' to={`/profile/${user.username}`}>Profile</Link>}
        <button 
        onClick={()=>{
            navigate('/create-post')
        }}
        className='button primary-button'
        >New Post</button>
        <button className='button ghost-button' onClick={logoutAndGoHome}>Logout</button>
        </div>
        <div className="mobile-tabbar">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <button onClick={() => navigate('/create-post')}>Post</button>
            {user && <Link to={`/profile/${user.username}`}>Me</Link>}
        </div>
    </nav>
  )
}

export default Nav
