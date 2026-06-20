import {createBrowserRouter} from 'react-router'
import Register from './features/auth/pages/register'
import Login from './features/auth/pages/login'
import Feed from './features/post/pages/Feed'
import Createpost from './features/post/pages/Createpost'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import Profile from './features/user/pages/Profile'
import EditProfile from './features/user/pages/EditProfile'
import Search from './features/search/pages/Search'

 export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<ProtectedRoute><Feed/></ProtectedRoute>
    },
    {
        path:'/create-post',
        element:<ProtectedRoute><Createpost/></ProtectedRoute>
    },
    {
        path:'/profile/:username',
        element:<ProtectedRoute><Profile/></ProtectedRoute>
    },
    {
        path:'/edit-profile',
        element:<ProtectedRoute><EditProfile/></ProtectedRoute>
    },
    {
        path:'/search',
        element:<ProtectedRoute><Search/></ProtectedRoute>
    }
])
