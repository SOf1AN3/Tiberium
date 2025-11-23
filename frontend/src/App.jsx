import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Import components
import Services from './pages/Services';
import Home from './pages/Home';
import ConnexionPage from './pages/ConnexionPage';
import Expats from './pages/Expats';
import Contact from './pages/Contact';
import AboutPage from './pages/AboutPage';
import InscriptionPage from './pages/InscriptionPage';
import Users from './components/Users';
import NotFoundPage from './pages/NotFoundPage';
import Messages from './pages/Messages';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProfileSettings from './components/ProfileSettings';

// Import styles
import './App.css';
import './styles/about.css';
import './styles/services.css';
import './styles/contact.css';
import './styles/connexion.css';
import './styles/expats.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/connexion" element={<ConnexionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/inscription" element={<InscriptionPage />} />
            <Route path="/expats" element={<Expats />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<ProfileSettings />} />
            {/* Protected Routes */}


            < Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />



            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminRoute> <Users /> </AdminRoute>} />

            {/* 404 Route - Always Last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;