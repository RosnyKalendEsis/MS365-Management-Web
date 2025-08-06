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
import {RapportProvider} from "./providers/RapportProvider";
import {AzureStateProvider, useAzureState} from "./providers/AzureStateProvider";
import {useEffect, useState} from "react";
import ModalAzureDisconnected from "./components/ModalAzureDisconnected";


function AppWrapper() {
    return (
        <AuthProvider>
            <AzureStateProvider>
                <UserProvider>
                    <AlertProvider>
                        <RapportProvider>
                            <App />
                        </RapportProvider>
                    </AlertProvider>
                </UserProvider>
            </AzureStateProvider>
        </AuthProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ModalAzureDisconnected/>
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