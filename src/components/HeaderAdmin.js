import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    Navbar,
    Nav,
    Offcanvas,
    Badge,
    Dropdown,
    Image,
    Container,
    Button
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaSignOutAlt,
    FaCog,
    FaPoll,
    FaBell,
    FaUserCircle,
    FaUsers,
    FaTachometerAlt,
    FaGlobe,
    FaFileAlt,
    FaChartBar,
    FaCogs,
    FaUserShield
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import logo from '../assets/images/admin-logo.png';
import '../styles/HeaderAdmin.css';

const HeaderAdmin = memo(({
                              appName = "Espace Citoyen",
                              user = { name: "Admin", email: "admin@gouv.cd", role: "Administrateur" },
                              version = "2.2.0",
                              onLogout = () => {},
                              language = 'fr',
                              onLanguageChange = () => {},
                              unreadNotifications = 0
                          }) => {
    const [notifications, setNotifications] = useState(unreadNotifications);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [activeLink, setActiveLink] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        onLogout();
        navigate('/login');
    }, [onLogout, navigate]);

    const handleNavClick = useCallback((path, linkName) => {
        setActiveLink(linkName);
        navigate(path);
        setShowOffcanvas(false);
    }, [navigate]);

    // Simulate real-time notifications
    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(prev => Math.max(0, prev + Math.floor(Math.random() * 2 - 0.8)));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const notificationItems = [
        {
            id: 1,
            icon: <FaUsers size={14} />,
            iconBg: "info",
            text: "5 nouveaux utilisateurs inscrits",
            time: "Il y a 10 minutes",
            read: false
        },
        {
            id: 2,
            icon: <FaPoll size={14} />,
            iconBg: "warning",
            text: 'Sondage "Infrastructures" clôturé',
            time: "Il y a 1 heure",
            read: true
        },
        {
            id: 3,
            icon: <FaUserShield size={14} />,
            iconBg: "danger",
            text: "Nouvelle demande de vérification",
            time: "Il y a 2 heures",
            read: false
        }
    ];

    const navLinks = [
        { name: 'dashboard', path: '/dashboard', label: 'Tableau de bord', icon: <FaTachometerAlt /> },
        { name: 'polls', path: '/polls', label: 'Sondages', icon: <FaPoll /> },
        { name: 'reports', path: '/reports', label: 'Rapports', icon: <FaFileAlt /> },
        { name: 'analytics', path: '/analytics', label: 'Analytique', icon: <FaChartBar /> },
        { name: 'users', path: '/users', label: 'Utilisateurs', icon: <FaUserShield /> },
        { name: 'settings', path: '/settings', label: 'Configuration', icon: <FaCogs /> }
    ];

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="admin-navbar" sticky="top">
            <Container fluid>
                {/* Logo and App Name */}
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Navbar.Brand
                        as={Link}
                        to="/dashboard"
                        className="d-flex align-items-center brand-container"
                        onClick={() => setActiveLink('dashboard')}
                    >
                        <Image
                            src={logo}
                            alt="Logo Admin"
                            height="40"
                            className="me-2 brand-logo"
                        />
                        <span className="brand-text">
              {appName} <strong className="brand-highlight">Admin+</strong>
              <small className="version-badge ms-2">v{version}</small>
            </span>
                    </Navbar.Brand>
                </motion.div>

                {/* Right-side controls */}
                <div className="d-flex align-items-center controls-container">
                    {/* Language Selector */}
                    <LanguageSelector
                        language={language}
                        onChange={onLanguageChange}
                        className="me-2"
                    />

                    {/* Notifications */}
                    <NotificationsDropdown
                        count={notifications}
                        items={notificationItems}
                        className="me-3"
                    />

                    {/* User Profile */}
                    <UserDropdown
                        user={user}
                        onLogout={handleLogout}
                    />

                    {/* Mobile Menu Toggle */}
                    <Navbar.Toggle
                        aria-controls="admin-offcanvas"
                        aria-label="Toggle navigation"
                        onClick={() => setShowOffcanvas(!showOffcanvas)}
                        className="ms-2 menu-toggle"
                    />
                </div>
            </Container>
        </Navbar>
    );
});

// Language Selector Component
const LanguageSelector = memo(({ language, onChange, className }) => (
    <Dropdown className={`language-selector ${className}`}>
        <Dropdown.Toggle variant="transparent" className="language-toggle">
            <FaGlobe className="me-1" />
            <span>{language === 'fr' ? 'FR' : 'EN'}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="language-menu">
            <Dropdown.Item
                active={language === 'fr'}
                onClick={() => onChange('fr')}
                className="language-item"
            >
                Français
            </Dropdown.Item>
            <Dropdown.Item
                active={language === 'en'}
                onClick={() => onChange('en')}
                className="language-item"
            >
                English
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
));

// Notifications Dropdown Component
const NotificationsDropdown = memo(({ count, items, className }) => {
    const [unreadCount, setUnreadCount] = useState(count);

    const markAsRead = useCallback((id) => {
        // In a real app, you would update the backend here
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    return (
        <Dropdown align="end" className={`notifications-dropdown ${className}`}>
            <Dropdown.Toggle
                variant="transparent"
                className="position-relative p-0 notification-toggle"
            >
                <FaBell size={20} className="notification-icon" />
                {unreadCount > 0 && (
                    <Badge
                        pill
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle notification-badge"
                    >
                        {unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="notification-menu">
                <Dropdown.Header className="notification-header">
                    Notifications ({unreadCount} non lues)
                </Dropdown.Header>

                {items.length > 0 ? (
                    <>
                        {items.map((item) => (
                            <Dropdown.Item
                                key={item.id}
                                className={`notification-item ${!item.read ? 'unread' : ''}`}
                                onClick={() => markAsRead(item.id)}
                            >
                                <div className="notification-content">
                                    <div className={`notification-icon-container bg-${item.iconBg}`}>
                                        {item.icon}
                                    </div>
                                    <div className="notification-text">
                                        <p className="notification-message">{item.text}</p>
                                        <small className="notification-time">{item.time}</small>
                                    </div>
                                </div>
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item
                            as={Link}
                            to="/notifications"
                            className="text-center text-primary view-all"
                        >
                            Voir toutes les notifications
                        </Dropdown.Item>
                    </>
                ) : (
                    <Dropdown.Item disabled className="no-notifications">
                        Aucune notification
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
});

// User Dropdown Component
const UserDropdown = memo(({ user, onLogout }) => (
    <Dropdown align="end" className="user-dropdown">
        <Dropdown.Toggle
            variant="transparent"
            className="d-flex align-items-center user-toggle"
        >
            <div className="user-avatar me-2">
                <FaUserCircle size={28} />
            </div>
            <span className="user-name d-none d-lg-inline">
        {user.name}
                {user.role && <small className="d-block text-muted user-role">{user.role}</small>}
      </span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="profile-menu">
            <Dropdown.Header className="profile-header">
                <div className="d-flex align-items-center">
                    <div className="profile-avatar me-3">
                        <FaUserCircle size={48} />
                    </div>
                    <div>
                        <h6 className="mb-0 profile-name">{user.name}</h6>
                        <small className="text-muted profile-email">{user.email}</small>
                        {user.role && <div className="profile-role-badge">{user.role}</div>}
                    </div>
                </div>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/profile" className="profile-item">
                <FaUserCircle className="me-2" /> Mon profil
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/settings" className="profile-item">
                <FaCog className="me-2" /> Paramètres
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
                onClick={onLogout}
                className="logout-item"
            >
                <FaSignOutAlt className="me-2" /> Déconnexion
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
));

// PropTypes
HeaderAdmin.propTypes = {
    appName: PropTypes.string,
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string
    }),
    version: PropTypes.string,
    onLogout: PropTypes.func,
    language: PropTypes.oneOf(['fr', 'en']),
    onLanguageChange: PropTypes.func,
    unreadNotifications: PropTypes.number
};

HeaderAdmin.defaultProps = {
    appName: "Espace Citoyen",
    user: {
        name: "Admin",
        email: "admin@gouv.cd",
        role: "Administrateur"
    },
    version: "2.2.0",
    onLogout: () => {},
    language: 'fr',
    onLanguageChange: () => {},
    unreadNotifications: 0
};

export default HeaderAdmin;