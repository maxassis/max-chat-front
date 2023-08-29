import Login from './Login.tsx'
import Chat from './Chat.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    )
}