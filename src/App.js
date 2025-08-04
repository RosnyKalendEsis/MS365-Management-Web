import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Sidebar from "./components/Sidebar";
import '../src/App.css'
import Users from "./pages/Users";
import DocumentsOfficiels from "./pages/DocumentsOfficiels";
import Notifications from "./pages/Notifications";
import ProfileAdmin from "./pages/ProfileAdmin";
import SettingsPage from "./pages/SettingsPage";
import {UserProvider} from "./providers/UserProvider";
import {AuthProvider} from "./providers/AuthProvider";
import {AlertProvider} from "./providers/AlertProvider";


function AppWrapper() {
    return (
        <AuthProvider>
            <UserProvider>
                <AlertProvider>
                    <App />
                </AlertProvider>
            </UserProvider>
        </AuthProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={
                    <div className="app-layout">
                        <Sidebar />
                        <div className="main-content">
                            <Dashboard />
                        </div>
                    </div>
                } />
                <Route path="/users" element={<Users />} />
                <Route path="/rapports" element={<DocumentsOfficiels />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<ProfileAdmin />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppWrapper