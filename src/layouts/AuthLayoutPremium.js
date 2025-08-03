import { Container, Row, Col, Image } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Authenticate from '../assets/images/authetification.png';
import '../styles/auth-layout-premium.css';
import { useEffect, useState } from 'react';

const AuthLayoutPremium = ({ children, title }) => {
    const location = useLocation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('#0073ff'); // Bleu RDC par défaut

    // Effet pour changer le thème de manière aléatoire
    useEffect(() => {
        const themes = ['#0073ff', '#2d5f7c', '#1a3e72', '#004a8f'];
        const interval = setInterval(() => {
            setCurrentTheme(themes[Math.floor(Math.random() * themes.length)]);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Animation au changement de route
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 1000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="auth-layout-premium">
            <Container>
                <div className="auth-box">
                    <Row className="g-0">
                        {/* Colonne gauche (Illustration) */}
                        <Col md={6} className="d-none d-md-block auth-illustration">
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.8}}
                                className="d-flex flex-column justify-content-center align-items-center p-5"
                                style={{backgroundColor: currentTheme}}
                            >
                                <motion.div
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    className="logo-container me-4 ms-4"
                                >
                                    <Link to="/" className="mb-1">
                                        <Image
                                            src={Authenticate}
                                            alt="Logo RDC"
                                            fluid
                                            className="logo-image"
                                        />
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{y: 20, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.4, duration: 0.6}}
                                    className="text-content"
                                >
                                    <h2 className="text-white text-center mb-3">
                                        Tableau de bord de gestion automatique des licences MS 365
                                    </h2>
                                    <p className="text-white-50 text-center">
                                        Connectez-vous pour accéder au Dashboard
                                    </p>
                                </motion.div>
                            </motion.div>
                        </Col>

                        {/* Colonne droite (Formulaire) */}
                        <Col md={6} className="auth-form-container">
                            <Container className=" d-flex flex-column justify-content-center py-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={location.pathname}
                                        initial={isAnimating ? {opacity: 0, x: 20} : false}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -20}}
                                        transition={{duration: 0.4}}
                                        className="auth-form-wrapper"
                                    >
                                        {/* En-tête du formulaire */}
                                        <div className="text-center mb-5">
                                            <motion.div
                                                whileHover={{rotate: 5}}
                                                whileTap={{scale: 0.95}}
                                            >
                                                <Link to="/">
                                                    <Image
                                                        src="https://img.freepik.com/photos-gratuite/drapeau-republique-democratique-du-congo_1401-92.jpg?uid=R128185230&ga=GA1.1.1695710534.1736772060&semt=ais_hybrid&w=740"
                                                        alt="Logo RDC"
                                                        fluid
                                                        className="form-logo w-25"
                                                    />
                                                </Link>
                                            </motion.div>
                                            <motion.h1
                                                className="h3 mt-3 fw-bold text-primary"
                                                initial={{y: -10, opacity: 0}}
                                                animate={{y: 0, opacity: 1}}
                                                transition={{delay: 0.2}}
                                            >
                                                {title}
                                            </motion.h1>
                                        </div>

                                        {/* Contenu des enfants */}
                                        {children}

                                        {/* Pied de page */}
                                        <motion.div
                                            className="text-center mt-4 text-muted"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            transition={{delay: 0.6}}
                                        >
                                            <small>
                                                © {new Date().getFullYear()} ITM HR - Tous droits
                                                réservés
                                            </small>
                                            <div className="mt-2">
                                                <a href="/privacy" className="footer-link">Confidentialité</a>
                                                <span className="mx-2">•</span>
                                                <a href="/terms" className="footer-link">Conditions</a>
                                                <span className="mx-2">•</span>
                                                <a href="/help" className="footer-link">Aide</a>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </Container>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

AuthLayoutPremium.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
};

export default AuthLayoutPremium;