import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import '../css/Navigation.css';

const Navigation = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = "/";
    };
    

    return (
        <nav className="navigation">
            <div className="title">
                <Link to="/"><h1>MergeMarket</h1></Link>
            </div>
            {isLoggedIn ? (
                    <div>
                        <Link to="/profile"><FaRegUserCircle className="user-icon" /></Link>
                        <CiLogout className="user-icon" onClick={handleLogout} />
                    </div>
                ) : (
                    <div><Link to="/login"><FaRegUserCircle className="user-icon" /></Link></div>
                )}
        </nav>
    );
};

export default Navigation;
