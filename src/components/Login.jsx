// Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/LoginRegister.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/auth/login`, {
                username,
                password
            });
            const token = response.data;
            localStorage.setItem('token', token);
            console.log(token);
            window.location.href = "/";
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
        }
    };
    

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
            <p>No tienes una cuenta? <Link to="/register">Haz click aquí para registrarte</Link></p>
        </div>
    );
};

export default Login;
