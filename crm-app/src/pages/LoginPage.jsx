import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="modal-overlay" style={{ background: 'var(--bg-color)' }}>
            <div className="glass" style={{ padding: '40px', borderRadius: '12px', width: '360px', textAlign: 'center' }}>
                <img src="/logo.png" alt="AquaBLOCK" style={{ height: '70px', marginBottom: '30px', objectFit: 'contain' }} />
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ingrese su usuario"
                        />
                    </div>
                    <div className="form-group" style={{ textAlign: 'left', position: 'relative' }}>
                        <label>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ width: '100%', paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && <p style={{ color: 'var(--error-color)', fontSize: '13px' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{
                            background: 'var(--accent-color)',
                            color: 'white',
                            padding: '12px',
                            fontWeight: '600',
                            marginTop: '10px'
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '20px' }}>
                    Acceso exclusivo para empleados de AquaBLOCK
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
