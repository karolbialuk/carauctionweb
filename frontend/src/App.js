import { React, useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import AddAuction from './pages/addAuction/AddAuction'
import Auction from './pages/auction/Auction'
import Home from './components/home/Home'
import Navbar from './components/navbar/Navbar'
import Profile from './pages/profile/Profile'
import './style.scss'
import { NavbarProvider } from './context'

const App = () => {
  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          <Navbar />
          <div style={{ display: 'flex' }}>
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
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
        {
          path: '/addauction',
          element: <AddAuction />,
        },

        {
          path: '/auction/:id',
          element: <Auction />,
        },
        {
          path: '/myauctions',
          element: <Home />,
        },
        {
          path: '/favourite',
          element: <Home />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: (
        <QueryClientProvider client={queryClient}>
          <Register />
        </QueryClientProvider>
      ),
    },
  ])

  return (
    <div>
      <NavbarProvider>
        <RouterProvider router={router} />
      </NavbarProvider>
    </div>
  )
}

export default App
