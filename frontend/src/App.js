import { React, useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import Home from './components/home/Home'
import Navbar from './components/navar/Navbar'
import './style.scss'

const App = () => {
  const Layout = () => {
    return (
      <div>
        <Navbar />
        <div style={{ display: 'flex' }}>
          <Outlet />
        </div>
      </div>
    )
  }

  const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem('user')) {
      return <Navigate to="/login" />
    }
    return children
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
