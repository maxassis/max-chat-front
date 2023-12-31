import Login from '../Login.tsx'
import Chat from '../Chat.tsx'
import Register from '../Register.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './privateRoute.tsx'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/"
                 element={
                    <PrivateRoute>
                        <Chat />
                    </PrivateRoute>
                 } />
            </Routes>
        </BrowserRouter>
    )
}