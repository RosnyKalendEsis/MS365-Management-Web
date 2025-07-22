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
import {BureauProvider} from "./providers/BureauProvider";
import AgendaAdmin from "./pages/AgendaAdmin";
import {AgendaEventProvider} from "./providers/AgendaEventProvider";
import {AuthProvider} from "./providers/AuthProvider";
import {SettingsProvider, useSettings} from "./providers/SettingsProvider";
import {useEffect} from "react";
import {ActivityProvider} from "./providers/ActivityProvider";


function AppWrapper() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <AssemblyProvider>
                    <DeputyProvider>
                        <BureauProvider>
                            <ActualityProvider>
                                <ActivityProvider>
                                    <AgendaEventProvider>
                                        <EventProvider>
                                            <App />
                                        </EventProvider>
                                    </AgendaEventProvider>
                                </ActivityProvider>
                            </ActualityProvider>
                        </BureauProvider>
                    </DeputyProvider>
                </AssemblyProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}

function App() {
    const { settings,updateSiteMeta } = useSettings();

    useEffect(() => {
        if (settings) {
            updateSiteMeta({
                title: settings.siteTitle,
                favicon: `${settings.faviconUrl}`,
            });
        }
    }, [settings]);
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
                <Route path="/agenda" element={<AgendaAdmin />} />
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