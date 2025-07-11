import React, {useContext, useEffect, useState} from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayoutPremium from "../../layouts/AuthLayoutPremium";
import { Eye, EyeSlash, Lock, Envelope } from 'react-bootstrap-icons';
import {AuthContext} from "../../providers/AuthProvider";

export default function LoginPremium() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {loading, login, error,setError,isAuthenticate,user} = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    useEffect(() => {
        if(isAuthenticate) {
            switch (user.role) {
                case "ADMIN":
                    navigate('/dashboard');
                    setError("")
                    break;
                default:
                    console.error("Rôle non pris en charge:", user.role);
                    return;
            }
        }
    },[isAuthenticate, navigate, setError, user.role])

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     try {
    //         await new Promise(resolve => setTimeout(resolve, 1500));
    //         navigate('/dashboard');
    //     } catch (err) {
    //         setError('Identifiants incorrects. Veuillez réessayer.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <AuthLayoutPremium title="Connexion Administrateur">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                </motion.div>
            )}

            <Form onSubmit={handleSubmit}>
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Form.Group className="mb-4">
                        <Form.Label className="d-flex align-items-center">
                            <Envelope className="me-2" size={18} />
                            Adresse email
                        </Form.Label>
                        <div className="input-with-icon">
                            <Form.Control
                                type="email"
                                placeholder="admin@gouv.cd"
                                className="auth-input-premium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Form.Group className="mb-4">
                        <Form.Label className="d-flex align-items-center">
                            <Lock className="me-2" size={18} />
                            Mot de passe
                        </Form.Label>
                        <div className="password-input-container">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="auth-input-premium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="link"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlash /> : <Eye />}
                            </Button>
                        </div>
                    </Form.Group>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="d-flex justify-content-between align-items-center mb-4"
                >
                    <Form.Check
                        type="checkbox"
                        label="Se souvenir de moi"
                        className="remember-me"
                    />
                    <Link to="/forgot-password" className="auth-link-premium">
                        Mot de passe oublié ?
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="d-grid mb-4"
                >
                    <Button
                        type="submit"
                        className="auth-btn-premium"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Connexion en cours...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </Button>
                </motion.div>
            </Form>
        </AuthLayoutPremium>
    );
}