import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx';
import "./features/shared/globle.scss"
import { PostContextProvider } from './features/post/post.context.jsx';
const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>

        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App