import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Sidebar from "./components/Sidebar";
import '../src/App.css'
import Deputes from "./pages/Deputes";
import Actualites from "./pages/Actualites";
import SessionsDirect from "./pages/SessionsDirect";
import DocumentsOfficiels from "./pages/DocumentsOfficiels";
import Messages from "./pages/Messages";
import ConsultationInterne from "./pages/ConsultationInterne";
import ConsultationPublique from "./pages/ConsultationPublique";
import ProfileAdmin from "./pages/ProfileAdmin";
import Assemblee from "./pages/Assemblee";
import SettingsPage from "./pages/SettingsPage";
import {EventProvider} from "./providers/EventProvider";
import {ActualityProvider} from "./providers/ActualityProvider";
import {AssemblyProvider} from "./providers/AssemblyProvider";
import {DeputyProvider} from "./providers/DeputyProvider";


function AppWrapper() {
    return (
        <AssemblyProvider>
            <DeputyProvider>
                <ActualityProvider>
                    <EventProvider>
                        <App />
                    </EventProvider>
                </ActualityProvider>
            </DeputyProvider>
        </AssemblyProvider>
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
                <Route path="/deputes" element={<Deputes />} />
                <Route path="/assemblee" element={<Assemblee />} />
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/sessions" element={<SessionsDirect />} />
                <Route path="/documents" element={<DocumentsOfficiels />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/sondages/internes" element={<ConsultationInterne />} />
                <Route path="/sondages/publics" element={<ConsultationPublique />} />
                <Route path="/profile" element={<ProfileAdmin />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppWrapper